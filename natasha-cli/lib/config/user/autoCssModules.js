// 默认根据用户引用方式，来自动判断是否启用 css modules
// 如果 autoCssModules 为 false, 则全部使用 css modules，不再智能判断

module.exports = (config, autoCssModules) => {
  const cssModulesOptions =
  config.module.rule('less').oneOf('css-modules').use('css-loader').get('options').modules || {};

  const tapOptions = (rule) => {
    rule.use('css-loader').tap((options) => {
      return {
        ...options,
        modules: autoCssModules
          ? false
          : cssModulesOptions
      };
    });
  };

  tapOptions(config.module.rule('less').oneOf('normal'));
  tapOptions(config.module.rule('css').oneOf('normal'));
};
