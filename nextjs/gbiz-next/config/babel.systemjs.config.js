function getCorejsVersion() {
  const corejsVersion = require(require.resolve('core-js/package.json')).version;
  const [major, minor] = corejsVersion.split('.');
  return `${major}.${minor}`;
}

module.exports = {
  babelHelpers: 'runtime',
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  // exclude: /node_modules\/(?!i18next)/,
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: getCorejsVersion() },
        bugfixes: true,
        loose: true,
        include: ['@babel/plugin-transform-block-scoping'],
        targets: {
          chrome: '64',
          edge: '79',
          firefox: '67',
          opera: '51',
          safari: '12',
        },
      },
    ],
    ['@babel/preset-react'],
  ],
  plugins: [
    '@emotion/babel-plugin',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'babel-plugin-react-require',
    'lodash',
    [
      'import',
      {
        libraryName: '@kux/icons',
        libraryDirectory: '/',
        camel2DashComponentName: false,
      },
      '@kux/icons',
    ],
    [
      'import',
      {
        libraryName: '@kux/mui-next',
        libraryDirectory: '/',
        camel2DashComponentName: false,
      },
      '@kux/mui-next',
    ],
  ],
};
