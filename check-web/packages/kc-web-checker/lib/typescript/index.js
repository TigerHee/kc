const { genInfoHTML } = require('../utils');
const scanFile = require('./scanfile');

async function main() {
  try {
    const count = await scanFile();
    return {
      code: 0,
      msg: genInfoHTML('ts', 'PASS'),
      extraData: count,
    };
  } catch {
    return {
      code: 1,
      msg: genInfoHTML('ts', 'FAIL'),
    };
  }
}

module.exports = main;
