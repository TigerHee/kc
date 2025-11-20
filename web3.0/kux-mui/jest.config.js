/**
 * Owner: victor.ren@kupotech.com
 */
const baseConfig = require('./jest.config.base');

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  coverageDirectory: '<rootDir>/__coverage__',
};
