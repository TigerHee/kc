module.exports = (config, value, context) => {
  const { command, commandArgs } = context;
  if (!value.endsWith('/')) {
    value = `${value}/`;
  }
  if (command === 'start' && value.startsWith('/')) {
    config.output.publicPath(`http://localhost:${commandArgs.port}${value}`);
  } else {
    config.output.publicPath(value);
  }
};
