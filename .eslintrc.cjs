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
  plugins: ["react", "@typescript-eslint"],
  rules: {},
  overrides: [
    {
      files: ["*.js", "*.cjs", "*.ts", "*.tsx"],
      rules: {
        quotes: ["warn", "double"],
        "react/no-unescaped-entities": "off",
        "require-jsdoc": "off",
        "valid-jsdoc": "off", // TS should be sufficient
      },
    },
  ],
};
