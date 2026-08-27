import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // One-off browser probes written at the repo root during review passes.
      // Git ignores them for the same reason; linting them only ever produced
      // noise that made a real warning easy to miss.
      '*.mjs',
      '!eslint.config.mjs',
      '!postcss.config.mjs',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Errors, not warnings: the previous config let 21 of these accumulate.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/no-unescaped-entities': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'object-shorthand': 'error',
    },
  },
  {
    // Build-time CLI scripts print to stdout by design.
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
]

export default config
