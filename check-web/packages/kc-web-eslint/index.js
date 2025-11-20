const CustomRules = require("./rules/customRules");

module.exports = {
  extends: [
    require.resolve("@umijs/fabric/dist/eslint"),
    require.resolve("./jsx-a11y-recommend"),
  ],
  plugins: ["eslint-plugin-ui-module", "kupo-lint", "es-x"],
  rules: CustomRules,
};
