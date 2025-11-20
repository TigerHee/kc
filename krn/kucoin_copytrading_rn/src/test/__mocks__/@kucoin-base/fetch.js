/**
 * Owner: jessie@kupotech.com
 */

const fn = jest.fn();

fn.interceptors = {
  request: {
    use: jest.fn(),
  },
};

module.exports = fn;
