module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  sourceType: "module",
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    indent: ["warn", 2],
    "linebreak-style": ["warn", "unix"],
    quotes: ["warn", "double"],
    semi: ["error", "never"],
    "no-undef": ["off", "never"],
    "object-curly-spacing": ["warn", "always"],
    "no-whitespace-before-property": "warn",
    "@typescript-eslint/no-explicit-any": "off"
  }
}