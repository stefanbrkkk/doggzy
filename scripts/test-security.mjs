import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

// Transpile the production modules in memory using the existing compiler.
// Resolve aliases as Next does; no separate test runner dependency is required.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const modules = new Map()
function moduleUrl(file) {
  if (modules.has(file)) return modules.get(file)
  const source = fs.readFileSync(file, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const resolved = compiled.replace(
    /(from\s*|import\s*)['"]([^'"]+)['"]/g,
    (match, prefix, specifier) => {
      let url
      if (specifier.startsWith('@/'))
        url = moduleUrl(path.join(root, 'src', specifier.slice(2) + '.ts'))
      else if (specifier.startsWith('.'))
        url = moduleUrl(path.resolve(path.dirname(file), specifier + '.ts'))
      else
        url = specifier.startsWith('node:')
          ? specifier
          : pathToFileURL(require.resolve(specifier)).href
      return `${prefix}'${url}'`
    },
  )
  const url = `data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`
  modules.set(file, url)
  return url
}
const load = (file) => import(moduleUrl(path.join(root, file)))
const { hashPassword } = await load('src/lib/auth.ts')
const { POST } = await load('src/app/api/admin/login/route.ts')
const { rateLimit } = await load('src/lib/rate-limit.ts')
process.env.AUTH_SECRET = 'test-only-random-placeholder-secret-32-characters'
process.env.ADMIN_EMAIL = 'admin@example.test'
process.env.ADMIN_PASSWORD_HASH = await hashPassword('test-only-password')
function request(body, ip) {
  return new Request('https://example.test/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body,
  })
}

test('valid same-origin login still creates a protected session', async () => {
  const valid = request(
    JSON.stringify({ email: 'admin@example.test', password: 'test-only-password' }),
    '192.0.2.3',
  )
  valid.headers.set('origin', 'https://example.test')
  const response = await POST(valid)
  assert.equal(response.status, 200)
  assert.match(response.headers.get('set-cookie'), /HttpOnly/i)
  assert.match(response.headers.get('set-cookie'), /SameSite=Lax/i)
  const token = response.cookies.get('doggzy_admin').value
  const { verifySession } = await load('src/lib/auth-edge.ts')
  assert.deepEqual(await verifySession(token), { sub: 'admin@example.test', role: 'admin' })
  assert.equal(await verifySession(token.slice(0, -4) + 'AAAA'), null)
})
test('cross-origin public intake and logout are rejected', async () => {
  for (const file of [
    'src/app/api/kontakt/route.ts',
    'src/app/api/prijava/route.ts',
    'src/app/api/admin/logout/route.ts',
  ]) {
    const route = await load(file)
    const forged = request('{}', '192.0.2.4')
    forged.headers.set('origin', 'https://other.test')
    assert.equal((await route.POST(forged)).status, 403)
  }
})
test('cross-origin login cannot set an admin session', async () => {
  const forged = request(
    JSON.stringify({ email: 'admin@example.test', password: 'test-only-password' }),
    '192.0.2.2',
  )
  forged.headers.set('origin', 'https://other.test')
  assert.equal((await POST(forged)).status, 403)
})
test('login rejects oversized streamed bodies before JSON parsing', async () => {
  const response = await POST(
    request(
      JSON.stringify({ email: 'admin@example.test', password: 'x'.repeat(20000) }),
      '192.0.2.1',
    ),
  )
  assert.equal(response.status, 413)
})
test('rotating submitted email and IP cannot buy unlimited password hashing', async () => {
  const statuses = []
  for (let index = 0; index < 9; index++) {
    const response = await POST(
      request(
        JSON.stringify({ email: `wrong${index}@example.test`, password: 'incorrect' }),
        `192.0.2.${index + 20}`,
      ),
    )
    statuses.push(response.status)
  }
  assert.equal(statuses[8], 429)
})
test('rate buckets have a hard bound and cannot clear active lockouts', () => {
  const blocked = 'security-test:existing'
  assert.equal(rateLimit(blocked, 1, 60000).allowed, true)
  for (let index = 0; index < 6000; index++) rateLimit(`security-test:${index}`, 1, 60000)
  assert.equal(rateLimit('security-test:overflow', 1, 60000).allowed, false)
  assert.equal(rateLimit(blocked, 1, 60000).allowed, false)
})

test('notification provider failures do not copy private data into error logs', async () => {
  const { deliverNotification } = await load('src/lib/notify.ts')
  const previousFetch = globalThis.fetch
  const previousError = console.error
  const logs = []
  process.env.RESEND_API_KEY = 'test-only-placeholder'
  process.env.NOTIFY_TO = 'operator@example.test'
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ name: 'validation_error', message: 'test-private-contact@example.test' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    )
  console.error = (...args) => logs.push(args)
  try {
    assert.equal(
      await deliverNotification({ subject: 'Test notification', lines: ['Test body'] }),
      false,
    )
    assert.equal(
      logs.some((args) => JSON.stringify(args).includes('test-private-contact@example.test')),
      false,
    )
  } finally {
    globalThis.fetch = previousFetch
    console.error = previousError
    delete process.env.RESEND_API_KEY
    delete process.env.NOTIFY_TO
  }
})
