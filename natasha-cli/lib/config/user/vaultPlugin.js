module.exports = (config, vaultConfig) => {
  if (config.plugins.get('VaultPlugin')) {
    config.plugin('VaultPlugin').tap((args) => {
      args[0] = { ...args[0], ...vaultConfig };
      return args;
    });
  }
};
