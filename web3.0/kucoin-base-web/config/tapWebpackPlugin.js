const merge = require('lodash/merge');

module.exports =
  (name, options = {}) =>
  (config) => {
    const plugins = config.plugins.filter((plugin) => plugin.constructor.name === name);
    if (plugins.length === 0) {
      throw new Error('Cannot find ' + name);
    }
    for (const plugin of plugins) {
      plugin.userOptions = merge(plugin.userOptions, options);
    }

    return config;
  };
