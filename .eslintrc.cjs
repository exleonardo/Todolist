module.exports = {
  overrides: [
    {
      files: ["**/*.stories.tsx"],
      rules: {
        "react-hooks/rules-of-hooks": "off",
        "no-console": "off"
      }
    }
  ],
  extends: ["@it-incubator/eslint-config", "plugin:storybook/recommended"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off"
  }
}
