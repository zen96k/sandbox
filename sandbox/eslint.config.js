import eslintConfigPrettier from "eslint-config-prettier/flat"
import withNuxt from "./.nuxt/eslint.config.mjs"

const config = withNuxt([
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ["drizzle.config.ts"] }
      }
    },
    rules: { "@typescript-eslint/return-await": ["error", "always"] }
  },
  {
    rules: {
      "arrow-body-style": ["error", "always"],
      curly: "error",
      "vue/attributes-order": ["error", { alphabetical: true }]
    }
  }
]).append(eslintConfigPrettier)

export default config
