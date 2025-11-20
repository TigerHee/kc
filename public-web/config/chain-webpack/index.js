const output = require('./output');
const plugins = require('./plugins');
const externals = require('./externals');
const optimize = require('./optimize');
const webpackModule = require('./webpackModule');

const compose = function (...args) {
  return function (x) {
    return args.reduceRight((ret, cb) => cb(ret), x);
  };
};

export default compose(optimize, externals, webpackModule, plugins, output);
