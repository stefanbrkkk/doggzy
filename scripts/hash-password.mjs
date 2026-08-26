#!/usr/bin/env node
import { randomBytes, scrypt } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { promisify } from 'node:util'
import { stdin, stdout } from 'node:process'

/**
 * Generates the value for ADMIN_PASSWORD_HASH.
 *
 * Run with `npm run admin:hash`. The password is read from stdin rather than
 * argv so it never lands in the shell history or the process list.
 *
 * The hash is colon-delimited on purpose: dotenv expands `$NAME` inside .env
 * values, so a `$`-delimited hash arrives at the server truncated.
 */

const scryptAsync = promisify(scrypt)

// Without a terminal `question()` never resolves and node exits with an
// "unsettled top-level await" warning and no hash — which reads as success in
// a pipeline and writes an empty value into .env.
if (!stdin.isTTY) {
  console.error('Pokreni interaktivno: lozinka se čita sa terminala, ne iz pipe-a.')
  process.exit(1)
}

const rl = createInterface({ input: stdin, output: stdout })
const password = await rl.question('Lozinka: ')
rl.close()

if (password.length < 12) {
  console.error('\nLozinka mora imati bar 12 karaktera.')
  process.exit(1)
}

const salt = randomBytes(16)
const derived = await scryptAsync(password, salt, 64)

console.log('\nDodaj u .env.local:\n')
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString('hex')}:${derived.toString('hex')}`)
console.log(`AUTH_SECRET=${randomBytes(32).toString('hex')}`)
