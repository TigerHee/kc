/**
 * Owner: tiger@kupotech.com
 */
const fetch = {
  interceptors: {
    request: {
      use: jest.fn(() => ({})),
    },
  },
};

module.exports = fetch;
