/**
 * Owner: iron@kupotech.com
 */

const report = jest.fn(() => ({
  logSelfDefined: jest.fn(),
  logAction: jest.fn(),
}));

module.exports = report;
