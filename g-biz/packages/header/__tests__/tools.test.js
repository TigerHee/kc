import { convertLegacyFuturesUri, TRADE_FUTURES_PATH } from '../src/Header/tools';

describe('convertLegacyFuturesUri', () => {
  it('should convert a legacy futures URI to the new format', () => {
    const legacyUri = '/futures/trade/BTC_USDT';
    const expectedUri = `${TRADE_FUTURES_PATH}/BTC_USDT`;
    expect(convertLegacyFuturesUri(legacyUri)).toBe(expectedUri);
  });

  it('should return the new format with an empty symbol if no symbol is present in the legacy URI', () => {
    const legacyUri = '/futures/trade/';
    const expectedUri = `${TRADE_FUTURES_PATH}/`;
    expect(convertLegacyFuturesUri(legacyUri)).toBe(expectedUri);
  });

  it('should return the new format with an empty symbol if the URI is null or undefined', () => {
    expect(convertLegacyFuturesUri(null)).toBe(`${TRADE_FUTURES_PATH}/`);
    expect(convertLegacyFuturesUri(undefined)).toBe(`${TRADE_FUTURES_PATH}/`);
  });

  it('should ignore query parameters and hash fragments in the legacy URI', () => {
    const legacyUri = '/futures/trade/BTC_USDT?param=value#hash';
    const expectedUri = `${TRADE_FUTURES_PATH}/BTC_USDT`;
    expect(convertLegacyFuturesUri(legacyUri)).toBe(expectedUri);
  });

  it('should return the new format with an empty symbol if the legacy URI does not match the expected pattern', () => {
    const legacyUri = '/some/other/path';
    const expectedUri = `${TRADE_FUTURES_PATH}/`;
    expect(convertLegacyFuturesUri(legacyUri)).toBe(expectedUri);
  });
});
