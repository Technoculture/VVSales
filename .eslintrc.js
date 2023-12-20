module.exports = {
  root: true,
  extends: ["universe/native"],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};
