const path = require('path');
const isObject = require('../../utils/isObject');

const resolveEntryPath = (entry, rootDir) => {
  if (typeof entry === 'string') {
    return path.isAbsolute(entry) ? entry : path.resolve(rootDir, entry);
  } else if (Array.isArray(entry)) {
    return entry.map(file => resolveEntryPath(file, rootDir));
  }

  return '';
};

module.exports = (config, value, context) => {
  const { rootDir } = context;
  let entry;
  if (Array.isArray(value) || typeof value === 'string') {
    entry = {
      index: value
    };
  } else if (isObject(value)) {
    entry = value;
  }

  const entryNames = Object.keys(entry);
  entryNames.forEach(entryName => {
    const entryValue = resolveEntryPath(entry[entryName], rootDir);
    entry[entryName] = entryValue;
  });

  config.entryPoints.clear();
  config.merge({ entry });
};
