module.exports = {
  ignorePatterns: [
    "scripts/",
    "docs/",
    "dist/",
    "example/"
  ],
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "@typescript-eslint/indent": ["error", 4, { "MemberExpression": 0 }],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/interface-name-prefix": 0
  }
};
