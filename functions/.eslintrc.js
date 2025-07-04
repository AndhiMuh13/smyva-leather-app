module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // Baris ini memberitahu ESLint tentang lingkungan Node.js
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "require-jsdoc": 0, // Menonaktifkan aturan yang mengharuskan komentar JSDoc
  },
  parserOptions: {
    "ecmaVersion": 2020, // Menggunakan versi ECMAScript yang lebih modern
  },
};
