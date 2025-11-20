/**
 * Owner: iron@kupotech.com
 */

const sentry = {
  init: jest.fn(() => {}),
  configureScope: jest.fn(() => {}),
  captureEvent: jest.fn(() => {}),
  captureException: jest.fn(() => {}),
  default: {
    captureException: jest.fn(() => {}),
  },
};

module.exports = sentry;
