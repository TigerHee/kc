/**
 * Owner: iron@kupotech.com
 */

const sentry = {
  init: jest.fn(() => {}),
  configureScope: jest.fn(() => {}),
  captureEvent: jest.fn(() => {}),
};

module.exports = sentry;
