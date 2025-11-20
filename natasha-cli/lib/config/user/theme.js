module.exports = (config, theme) => {
  const tapOptions = (rule) => {
    rule.use('less-loader').tap((options) => {
      options.lessOptions.modifyVars = theme;
      return options;
    });
  };

  tapOptions(config.module.rule('less').oneOf('css-modules'));
  tapOptions(config.module.rule('less').oneOf('normal'));
};
