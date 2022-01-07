module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2]
  }
}
