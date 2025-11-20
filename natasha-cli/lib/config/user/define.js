
module.exports = (config, define) => {
  if (config.plugins.get('DefinePlugin')) {
    config.plugin('DefinePlugin').tap((args) => {
      const targetDefine = {};
      Object.keys(define).forEach((key) => {
        targetDefine[key] = JSON.stringify(define[key]);
      });
      args[0] = { ...args[0], ...targetDefine };
      return args;
    });
  }
};
