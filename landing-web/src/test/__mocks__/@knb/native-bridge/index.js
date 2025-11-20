/**
 * Owner: terry@kupotech.com
 */
const jsBridge = {
  isApp: jest.fn(() => false),
  open: jest.fn(),
};

module.exports = jsBridge;
