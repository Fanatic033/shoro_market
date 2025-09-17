// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // Включаем сортировку импортов
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",        // Встроенные модули Node.js (если есть)
            "external",       // Сторонние библиотеки (react, expo, zustand и т.д.)
            "internal",       // Твои внутренние модули (@/components, @/store и т.п.)
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always", // Разделять группы пустыми строками
          "alphabetize": {
            "order": "asc",   // Сортировка по алфавиту
            "caseInsensitive": true
          }
        }
      ],
  
      // Опционально: требовать порядок внутри группы
      "sort-imports": [
        "off", // отключаем стандартный sort-imports, если мешает
      ]
    },
    settings: {
      "import/resolver": {
        "typescript": {}, // если используешь TS
        "node": {
          "paths": ["src"], // если у тебя алиасы типа "@/components"
          "extensions": [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    }
  },
]);
