import {formatCurrency, transformSymbolInfo} from 'utils/futures-helper';
import {getDigit} from 'utils/helper';

// Mock dependencies
jest.mock('utils/helper', () => ({
  getDigit: jest.fn(),
}));

jest.mock('utils/operation', () => ({
  toNonExponential: jest.fn(value => value),
}));

describe('futures-helper.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('formatCurrency', () => {
    it('should convert XBT to BTC', () => {
      expect(formatCurrency('XBT')).toBe('BTC');
    });

    it('should return original currency for non-XBT', () => {
      expect(formatCurrency('BTC')).toBe('BTC');
      expect(formatCurrency('ETH')).toBe('ETH');
      expect(formatCurrency('USDT')).toBe('USDT');
    });

    it('should handle undefined input', () => {
      expect(formatCurrency(undefined)).toBeUndefined();
    });

    it('should handle null input', () => {
      expect(formatCurrency(null)).toBeNull();
    });
  });

  describe('transformSymbolInfo', () => {
    const mockGetDigit = (value, isBase = false) => {
      if (isBase) return 8;
      return 2;
    };

    beforeEach(() => {
      getDigit.mockImplementation(mockGetDigit);
    });

    it('should transform spot symbol info correctly', () => {
      const spotInfo = {
        priceIncrement: '0.01',
        baseIncrement: '0.0001',
        baseCurrency: 'BTC',
        quoteCurrency: 'USDT',
        settleCurrency: 'USDT',
        pricePrecision: 2,
        isInverse: undefined,
      };

      const result = transformSymbolInfo(spotInfo);

      expect(result).toEqual({
        ...spotInfo,
        tickSize: undefined,
        indexPriceTickSize: 1,
        priceIncrement: '0.01',
        baseIncrement: '0.0001',
        baseCurrency: 'BTC',
        quoteCurrency: 'USDT',
        settleCurrency: 'USDT',
        pricePrecision: 2,
        indexPricePrecision: 2,
        basePrecision: 8,
      });
    });

    it('should transform futures symbol info correctly', () => {
      const futuresInfo = {
        tickSize: '0.1',
        indexPriceTickSize: '0.01',
        multiplier: '0.001',
        lotSize: '0.001',
        baseCurrency: 'XBT',
        quoteCurrency: 'USDT',
        settleCurrency: 'USDT',
        isInverse: true,
      };

      const result = transformSymbolInfo(futuresInfo);

      expect(result).toEqual({
        ...futuresInfo,
        tickSize: '0.1',
        indexPriceTickSize: '0.01',
        priceIncrement: '0.1',
        baseIncrement: '0.001',
        baseCurrency: 'BTC',
        quoteCurrency: 'USDT',
        settleCurrency: 'USDT',
        pricePrecision: 2,
        indexPricePrecision: 2,
        basePrecision: 8,
      });
    });

    it('should handle undefined input', () => {
      const result = transformSymbolInfo(undefined);
      expect(result).toEqual({
        tickSize: undefined,
        indexPriceTickSize: 1,
        priceIncrement: undefined,
        baseIncrement: undefined,
        baseCurrency: undefined,
        quoteCurrency: undefined,
        settleCurrency: undefined,
        pricePrecision: undefined,
        indexPricePrecision: undefined,
        basePrecision: 8,
      });
    });

    it('should handle null input', () => {
      const result = transformSymbolInfo(null);
      expect(result).toEqual({
        tickSize: undefined,
        indexPriceTickSize: 1,
        priceIncrement: undefined,
        baseIncrement: undefined,
        baseCurrency: undefined,
        quoteCurrency: undefined,
        settleCurrency: undefined,
        pricePrecision: undefined,
        indexPricePrecision: undefined,
        basePrecision: 8,
      });
    });

    it('should handle empty object input', () => {
      const result = transformSymbolInfo({});
      expect(result).toEqual({
        tickSize: undefined,
        indexPriceTickSize: 1,
        priceIncrement: undefined,
        baseIncrement: undefined,
        baseCurrency: undefined,
        quoteCurrency: undefined,
        settleCurrency: undefined,
        pricePrecision: undefined,
        indexPricePrecision: undefined,
        basePrecision: 8,
      });
    });
  });
});
