const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        module: "readonly",
        require: "readonly",
        exports: "writable",
        console: "readonly",
        Among: "readonly",
        SnowballProgram: "readonly",
      },
    },
    rules: {
      eqeqeq: "warn",
      "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^(Among|SnowballProgram|\\w+Stemmer)$" }],
      "no-undef": "error",
      "no-redeclare": "off",
      "no-unused-labels": "warn",
      "no-fallthrough": "warn",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
