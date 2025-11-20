
module.exports = (config, cssLoaderModules) => {
  const tapOptions = (rule) => {
    rule.use('css-loader').tap((options) => {
      // 如果当前 rule 没有开启 css modules，则直接返回
      if (!options.modules) {
        return options;
      }
      return {
        ...options,
        modules: {
          ...(options.modules || {}),
          ...cssLoaderModules
        }
      };
    });
  };

  tapOptions(config.module.rule('css').oneOf('css-modules'));
  tapOptions(config.module.rule('css').oneOf('normal'));
  tapOptions(config.module.rule('less').oneOf('css-modules'));
  tapOptions(config.module.rule('less').oneOf('normal'));
};
