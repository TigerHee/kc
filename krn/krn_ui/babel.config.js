/**
 * Owner: willen@kupotech.com
 */
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".json"],
        alias: {
          "@krn/ui": "./src",
          utils: "./src/utils",
          components: "./src/components",
          assets: "./src/assets",
          hooks: "./src/hooks",
          theme: "./src/theme",
          context: "./src/context",
        },
      },
    ],
  ],
};
