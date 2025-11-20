module.exports = (config, value) => {
  if (config.has('externals')) {
    const externals = config.get('externals');
    if (Array.isArray(externals)) {
      if (Array.isArray(value)) {
        config.externals([...externals, ...value]);
      } else {
        config.externals([...externals, value]);
      }
    } else {
      config.externals([externals, value]);
    }
  } else {
    config.merge({ externals: value });
  }
};
