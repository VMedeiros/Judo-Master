// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.angular/**',
      'node_modules/**',
      'out-tsc/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // Application code
  {
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      sonarjs.configs.recommended,
      prettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      // Covered by TypeScript's own checks.
      'sonarjs/no-unused-vars': 'off',
    },
  },

  // Unit tests: Jasmine globals, and fixtures may be written loosely.
  {
    files: ['src/**/*.spec.ts', 'src/testing/**/*.ts'],
    languageOptions: { globals: { ...globals.jasmine } },
    rules: {
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/no-clear-text-protocols': 'off',
    },
  },

  // The seed data is a long literal: size rules do not apply to it.
  {
    files: ['src/data/**/*.ts'],
    rules: { 'sonarjs/no-duplicate-string': 'off' },
  },

  // Templates
  {
    files: ['src/**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
    },
  },

  // End-to-end tests
  {
    files: ['e2e/**/*.ts', 'playwright.config.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      sonarjs.configs.recommended,
      prettier,
    ],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      'sonarjs/no-clear-text-protocols': 'off',
    },
  },

  // Node scripts and config files
  {
    files: ['scripts/**/*.mjs', '*.mjs', '*.cjs'],
    extends: [eslint.configs.recommended, sonarjs.configs.recommended, prettier],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'module',
    },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },

  // Classic scripts loaded by index.html before Angular boots
  {
    files: ['src/assets/**/*.js'],
    extends: [eslint.configs.recommended, sonarjs.configs.recommended, prettier],
    languageOptions: { globals: { ...globals.browser }, sourceType: 'script' },
  }
);
