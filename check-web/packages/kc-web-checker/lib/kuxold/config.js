function getDefaultConfig() {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`${process.env.PWD}/.kc-web-checker.js`);
  } catch (e) {
    return {};
  }
}

const getConfig = () => {
  const { kuxold: KuxOldConfig } = getDefaultConfig();
  const _config = Object.assign(
    {},
    {
      src: ['./src'],
      exclude: [ 'node_modules', '.umi' ],
      name: '*.jsx|*.js',
      type: 'f',
    },
    KuxOldConfig || {}
  );
  return _config;
};

module.exports = {
  getDefaultConfig,
  getConfig,
};
