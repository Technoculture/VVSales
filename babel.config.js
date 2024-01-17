module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      "react-native-reanimated/plugin",
      ["inline-import", { extensions: [".sql"] }],
      "nativewind/babel",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
//commented this to fix flatlist render error according to link below
//https://github.com/facebook/react-native/issues/36828

      // ["@babel/plugin-transform-private-methods", { loose: true }],
    ],
  };
};
