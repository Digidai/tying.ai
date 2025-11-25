import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'public/**',
      'archive/**',
      '**/*.js',
      '**/*.mjs',
      'build.sh',
      'push-to-github.sh',
      'playwright.config.ts',
    ],
  },

  // JavaScript files
  js.configs.recommended,

  // TypeScript files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // Astro files
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // Allow console in Astro components (for server-side logging)
      'no-console': 'off',
    },
  },
];
