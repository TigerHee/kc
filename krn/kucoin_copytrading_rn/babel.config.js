/* eslint-disable no-sparse-arrays */
module.exports = api => {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.json'],
        },
      ],
      [
        'module:react-native-dotenv',
        {
          allowlist: ['BUILD_ENV'],
        },
      ],
    ],
  };
};
