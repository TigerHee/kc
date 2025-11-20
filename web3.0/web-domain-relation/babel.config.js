const { dirname } = require("path");

function getCorejsVersion() {
  const corejsVersion = require(require.resolve(
    "core-js/package.json"
  )).version;
  const [major, minor] = corejsVersion.split(".");
  return `${major}.${minor}`;
}
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: { version: getCorejsVersion() },
        bugfixes: true,
        loose: false,
        targets: {
          chrome: '64',
          edge: '79',
          firefox: '67',
          opera: '51',
          safari: '12',
        },
      },
    ],
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        // https://github.com/babel/babel/issues/10261
        version: require("@babel/runtime/package.json").version,
        // 7.13 之后根据 exports 自动选择 esm 和 cjs，无需此配置
        useESModules: false,
        // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
        absoluteRuntime: dirname(
          require.resolve("@babel/runtime/package.json")
        ),
      },
    ],
  ],
};
