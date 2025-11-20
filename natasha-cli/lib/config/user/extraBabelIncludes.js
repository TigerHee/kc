module.exports = (config, extraBabelIncludes, context) => {
  const { rootDir } = context;
  config.module.rule('babel').use('babel-loader').tap((options) => {
    options.include = [...(options.include || [rootDir]), ...extraBabelIncludes];
    return options;
  });
};
