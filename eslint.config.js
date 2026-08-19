const js = require("@eslint/js");

// Flat config (ESLint 9+). El proyecto declara "type": "commonjs" en
// package.json, por lo que este archivo se carga con require y los fuentes
// se analizan como CommonJS.
module.exports = [
  {
    ignores: ["node_modules/", "coverage/", "k8s/"],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",

      globals: {
        process: "readonly",
        console: "readonly",
        module: "writable",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
      },
    },

    rules: {
      "no-unused-vars": "error",
      // El servidor escribe en consola de forma intencional (logs de arranque).
      "no-console": "off",
      eqeqeq: "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },

  {
    files: ["test/**/*.js"],

    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
];
