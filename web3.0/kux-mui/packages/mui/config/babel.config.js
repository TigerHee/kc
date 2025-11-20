
/**
 * Owner: victor.ren@kupotech.com
 */

const isDev = process.env.NODE_ENV !== 'production';
export default {
  presets: [
    [
      '@babel/preset-env',
      {
        'loose': true,
      },
    ],
    ['@babel/preset-react'],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime'],
    [
      'import',
      {
        libraryName: '@kux/icons',
        libraryDirectory: isDev ? 'lib' : '',
        camel2DashComponentName: false,
      },
      '@kux/icons',
    ],
    ['lodash'],
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
  ],
  env: {
    production: {
      plugins: [['transform-remove-console', { 'exclude': ['error'] }]],
    },
  },
};
