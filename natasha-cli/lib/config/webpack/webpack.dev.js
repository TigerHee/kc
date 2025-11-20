module.exports = (config) => {
  config
    .plugin('friendly-error')
    .use(require('@nuxtjs/friendly-errors-webpack-plugin'), [
      {
        clearConsole: false
      }
    ]);
  config.stats('errors-warnings');
  config.devtool('cheap-module-source-map');
};
