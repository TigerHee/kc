module.exports = {
  babelHelpers: 'runtime',
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  exclude: 'node_modules/**',
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        'loose': true,
      },
    ],
    ['@babel/preset-react']
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