const path = require('path');

module.exports = (config, alias, context) => {
  const { rootDir } = context;
  const absoluteAlias = {};
  Object.keys(alias).forEach((key) => {
    if (path.isAbsolute(alias[key])) {
      absoluteAlias[key] = alias[key];
    } else {
      let resolvePath = '';
      try {
        // 判断在 node_modules 里面是否能找到模块
        const requireResolvePath = require.resolve(alias[key], { paths: [rootDir] });
        if (requireResolvePath.includes('node_modules')) {
          resolvePath = alias[key].startsWith('.') ? path.join(rootDir, alias[key]) : alias[key];
        }
      } catch (e) {
      }
      absoluteAlias[key] = resolvePath || path.join(rootDir, alias[key]);
    }
  });
  config.merge({
    resolve: {
      alias: absoluteAlias
    }
  });
};
