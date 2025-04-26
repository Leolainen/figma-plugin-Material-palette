const reactHooks = require("eslint-plugin-react-hooks");

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "google", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    ...reactHooks.configs["recommended-latest"].plugins,
  ],
  rules: {
    ...reactHooks.configs["recommended-latest"].rules,
    "react-hooks/react-compiler": "error",
  },
  overrides: [
    {
      files: ["*.js", "*.cjs", "*.ts", "*.tsx"],
      rules: {
        quotes: ["warn", "double"],
        "react/no-unescaped-entities": "off",
        "react/prop-types": "off", // TS handles this better
        "require-jsdoc": "off",
        "valid-jsdoc": "off", // TS should be sufficient
      },
    },
  ],
};
