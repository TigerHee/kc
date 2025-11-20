const path = require('path');
const optionConfig = require('../config/option.config');

module.exports = (api) => {
  const { registerCliOption, log } = api;
  const optionKeys = Object.keys(optionConfig);
  registerCliOption(optionKeys.map((optionKey) => {
    const { module, commands } = optionConfig[optionKey];
    const moduleName = module || optionKey;
    const optionDefinition = {
      name: optionKey,
      commands
    };
    let configFunc = null;
    if (module !== false) {
      try {
        configFunc = require(path.isAbsolute(moduleName) ? moduleName : `./cliOption/${moduleName}`);
      } catch (err) {
        log.error(err);
      }
    }
    return {
      ...optionDefinition,
      configWebpack: (...rest) => {
        if (configFunc) {
          configFunc(...rest, api);
        }
      }
    };
  }));
};
