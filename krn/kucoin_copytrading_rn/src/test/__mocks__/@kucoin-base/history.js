/**
 * Owner: iron@kupotech.com
 */

const history = {
  push: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  location: {
    query: {},
  },
};

module.exports = history;
