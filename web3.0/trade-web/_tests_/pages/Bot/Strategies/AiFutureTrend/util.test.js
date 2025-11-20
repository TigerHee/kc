/**
 * Owner: mike@kupotech.com
 */
import { getMinInvestCacheKey } from 'Bot/Strategies/AiFutureTrend/util';

describe('getMinInvestCacheKey', () => {
  it('should return a string combining symbol, leverage, and pullBack with hyphens', () => {
    const params = {
      symbol: 'BTC',

      leverage: 10,

      pullBack: 0.5
    };

    const expectedCacheKey = 'BTC-10-0.5';

    const result = getMinInvestCacheKey(params);

    expect(result).toEqual(expectedCacheKey);
  });
});
