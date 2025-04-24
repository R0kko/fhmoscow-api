// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import nodePlugin from 'eslint-plugin-n';
import securityPlugin from 'eslint-plugin-security';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      n: nodePlugin,
      security: securityPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,
      ...nodePlugin.configs.recommended.rules,
      ...securityPlugin.configs.recommended.rules,

      // Стиль кода
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'max-len': ['warn', { code: 100, ignoreUrls: true }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'object-curly-spacing': ['error', 'always'],

      // Работа с переменными
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Прочее
      'no-console': 'warn',

      // Правила для работы с импортами
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',

      // Дополнительные проверки
      complexity: ['warn', 10],
      'no-shadow': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },
]);
