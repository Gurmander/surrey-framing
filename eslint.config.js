import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', '.netlify/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Config files run in Node.
    files: ['*.config.{js,mjs}'],
    languageOptions: {
      globals: { process: 'readonly', URL: 'readonly', console: 'readonly' },
    },
  },
];
