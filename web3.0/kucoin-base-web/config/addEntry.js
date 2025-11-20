module.exports = (name, entry) => (config) => {
  const orgEntry = config.entry;
  if (typeof orgEntry === "string") {
    config.entry = {
      main: orgEntry,
    };
  }

  config.entry[name] = entry;

  return config;
};
