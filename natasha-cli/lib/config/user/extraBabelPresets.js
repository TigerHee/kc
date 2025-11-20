module.exports = (config, extraBabelPresets) => {
  config.module.rule('babel').use('babel-loader').tap((options) => {
    options.presets = [...options.presets, ...extraBabelPresets];
    return options;
  });
};
