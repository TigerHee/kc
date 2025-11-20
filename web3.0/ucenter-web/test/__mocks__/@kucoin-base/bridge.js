/**
 * Owner: iron@kupotech.com
 */
const jsBridge = {
  isApp: jest.fn(() => false),
  init: jest.fn(() => ({})),
  open: jest.fn(() => ({})),
};

module.exports = jsBridge;
