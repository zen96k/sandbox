import eslintConfigPrettier from "eslint-config-prettier/flat"
import withNuxt from "./.nuxt/eslint.config.mjs"

const config = withNuxt([
  {
    languageOptions: { parserOptions: { projectService: true } },
    rules: {
      "arrow-body-style": ["error", "always"],
      curly: ["error", "all"],
      "@typescript-eslint/return-await": ["error", "always"],
      "vue/attributes-order": ["warn", { alphabetical: true }]
    }
  }
]).append(eslintConfigPrettier)

export default config
