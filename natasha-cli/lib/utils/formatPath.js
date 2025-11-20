const path = require('path');

module.exports = function formatPath (pathString) {
  return process.platform === 'win32' ? pathString.split(path.sep).join('/') : pathString;
};
