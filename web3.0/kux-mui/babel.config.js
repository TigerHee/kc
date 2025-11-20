/**
 * Owner: victor.ren@kupotech.com
 */
module.exports = {
  presets: [['@babel/preset-env'], ['@babel/preset-typescript'], ['@babel/preset-react']],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-transform-modules-commonjs'],
  ],
};
