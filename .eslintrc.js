module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    indent: ["warn", 2, { SwitchCase: 1, flatTernaryExpressions: true }],
    "linebreak-style": ["warn", "unix"],
    quotes: ["warn", "double"],
    semi: ["error", "never"],
    "no-undef": ["off", "never"],
    "object-curly-spacing": ["warn", "always"],
    "no-whitespace-before-property": "warn"
  }
}