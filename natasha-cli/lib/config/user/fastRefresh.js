const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (config, value, context) => {
  const { command } = context;
  if (command === 'start' && value) {
    config.plugin('ReactRefreshWebpackPlugin')
      .use(ReactRefreshWebpackPlugin, [{
        overlay: false
      }]);
    // add babel plugin for react-refresh
    config.module
      .rule('babel')
      .use('babel-loader')
      .tap((options) => {
        const { plugins = [] } = options;
        return {
          ...options,
          plugins: [
            ...plugins,
            require.resolve('react-refresh/babel')
          ]
        };
      });
  }
};
