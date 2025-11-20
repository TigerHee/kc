module.exports = (config, extraPostCSSPlugins) => {
  const tapOptions = (rule) => {
    rule.use('postcss-loader').tap((options) => {
      if (!options.postcssOptions) {
        options.postcssOptions = {};
      }
      if (!options.postcssOptions.plugins) {
        options.postcssOptions.plugins = [];
      }
      options.postcssOptions.plugins = [...options.postcssOptions.plugins, ...extraPostCSSPlugins];
      return options;
    });
  };

  tapOptions(config.module.rule('css').oneOf('css-modules'));
  tapOptions(config.module.rule('css').oneOf('normal'));
  tapOptions(config.module.rule('less').oneOf('css-modules'));
  tapOptions(config.module.rule('less').oneOf('normal'));
};
