module.exports = (config, devServer, context) => {
  const { commandArgs } = context;
  if (typeof devServer.allowedHosts === 'string') {
    devServer.allowedHosts = [devServer.allowedHosts];
  }
  devServer.devMiddleware = {
    ...devServer.devMiddleware,
    publicPath: `http://localhost:${commandArgs.port}/`
  };
  config.merge({ devServer });
};
