// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("@expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

config.resolver.sourceExts.push("sql");

module.exports = {
  ...config,
  watchFolders: [path.resolve(__dirname, "..")],
};
