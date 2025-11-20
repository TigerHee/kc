/*
 * Owner: jesse.shao@kupotech.com
 */

import coinReport from 'utils/coinReport';

describe('_t', () => {
  test('coinReport function should work correctly', () => {
    const logSelfDefinedMock = jest.fn();
    window._KC_REPORT_ = {
      logSelfDefined: logSelfDefinedMock,
    };
    coinReport('BTC', true);
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1000);
    coinReport('BTC', false);

    global.Date.now.mockRestore();
  });

  test('coinReport function should work correctly', () => {
    coinReport('BTC', true);
  });
});
