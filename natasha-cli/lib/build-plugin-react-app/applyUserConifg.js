const baseUserConifgs = require('../config/user.config');

module.exports = (api) => {
  const { registerUserConfig } = api;
  const finallyConfigs = baseUserConifgs.map(config => {
    const { name } = config;
    let configFunc = null;
    try {
      configFunc = require(`../config/user/${name}`);
    } catch (err) {}

    return {
      configWebpack: (...rest) => {
        if (configFunc) {
          configFunc(...rest, api);
        }
      },
      ...config
    };
  });

  registerUserConfig(finallyConfigs);
};
