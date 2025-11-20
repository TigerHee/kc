module.exports = (config, extraBabelPlugins) => {
  config.module.rule('babel').use('babel-loader').tap((options) => {
    options.plugins = [...options.plugins, ...extraBabelPlugins];
    return options;
  });
};
