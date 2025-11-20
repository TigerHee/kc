/**
 * Owner: tiger@kupotech.com
 */
const jsBridge = {
  interceptors: {
    request: {
      use: jest.fn(() => ({})),
    },
  },
};

module.exports = jsBridge;
