module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2015
  },
  plugins: [
    'prettier',
    'node'
  ],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier'
  ],
  env: {
    node: true
  },
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true
    }]
  }
};
