function getDefaultConfig() {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`${process.env.PWD}/.kc-web-checker.js`);
  } catch (e) {
    return {};
  }
}

const getConfig = () => {
  const { owner: OwnerConfig } = getDefaultConfig();
  const _config = Object.assign(
    {},
    {
      src: './src',
      exclude: ['node_modules', '.umi'],
      name: '*.js',
      type: 'f',
    },
    OwnerConfig || {}
  );
  _config.name = _config.name.split('|');
  return _config;
};

exports.getConfig = getConfig;
