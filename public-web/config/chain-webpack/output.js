const pkg = require('../../package.json');
const path = require('path');

module.exports = function (memo) {
  memo.output.path(path.resolve(__dirname, `../../dist/${pkg.name}/${pkg.version}/`));
  return memo;
};
