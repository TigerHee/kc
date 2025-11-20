/**
 * Owner: willen@kupotech.com
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.json'],
        alias: {
          src: './src',
        },
      },
    ],
    'transform-inline-environment-variables',
  ],
};
