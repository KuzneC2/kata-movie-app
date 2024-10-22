import globals from 'globals';
import js from '@eslint/js';
import eslintReact from 'eslint-plugin-react';

import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigAirbnb from 'eslint-config-airbnb';
import eslintPluginImport from 'eslint-plugin-import';
import eslintConfigAlly from 'eslint-plugin-jsx-a11y';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      ...eslintConfigPrettier.rules,
      'prefer-const': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      react: eslintReact,
      'react-refresh': eslintReactRefresh,
      'airbnb/base': eslintConfigAirbnb,
      'import/recommended': eslintPluginImport,
      'jsx-a11y': eslintConfigAlly,
      'react-hooks': eslintReactHooks,
      prettier: eslintPluginPrettier,
    },
  },
  {
    ignores: ['node_modules', 'dist'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: eslintReact.configs.recommended.parserOptions,
    },
  },
];
