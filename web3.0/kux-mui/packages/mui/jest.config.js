/**
 * Owner: victor.ren@kupotech.com
 */
const baseConfig = require('../../jest.config.base');

const packageJson = require('./package.json');

const packageName = packageJson.name.split('@kux/').pop();

module.exports = {
  ...baseConfig,
  name: packageName,
  displayName: packageName,
  rootDir: '../..',
  roots: [`<rootDir>/packages/${packageName}`],
  setupFilesAfterEnv: [`<rootDir>/packages/${packageName}/jest.setup.js`],
  moduleDirectories: ['node_modules', 'src'],
};
