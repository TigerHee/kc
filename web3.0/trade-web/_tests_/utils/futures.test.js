/**
 * Owner: garuda@kupotech.com
 */
import {
  checkContractsStatus,
  formatCurrency,
  getPrefixTopic,
  quantityPlaceholder,
  sortedMarket,
} from '@/utils/futures';

describe('test utils/futures function', () => {
  it.each([
    {
      symbol: 'XBTX',
      contracts: {},
      expected: false,
    },
    {
      symbol: 'SPELLUSDTM',
      contracts: { SPELLUSDTM: { status: 'init' } },
      expected: false,
    },
    {
      symbol: 'SPELLUSDTM',
      contracts: { SPELLUSDTM: { status: 'Paused' } },
      expected: true,
    },
  ])('测试 checkContractsStatus 方法，参数为 %j', ({ symbol, contracts, expected }) => {
    expect(checkContractsStatus({ symbol, contracts })).toBe(expected);
  });

  it.each([
    {
      symbol: 'XBTX',
      expected: 'XBTX',
    },
    {
      symbol: 'XBT',
      expected: 'BTC',
    },
  ])('测试 formatCurrency 方法，参数为 %j', ({ symbol, expected }) => {
    expect(formatCurrency(symbol)).toBe(expected);
  });

  it.each([
    {
      topic: '',
      expected: '',
    },
    {
      topic: 'XBT',
      expected: '',
    },
    {
      topic: 'futuresTopic:KCSUSDTM',
      expected: 'KCSUSDTM',
    },
  ])('测试 getPrefixTopic 方法，参数为 %j', ({ topic, expected }) => {
    expect(getPrefixTopic(topic)).toBe(expected);
  });

  it.each([
    {
      baseCurrency: 'XBT',
      isInverse: true,
      expected: '1 global.unit = 0.01 USD',
      quoteCurrency: 'USD',
    },
    {
      baseCurrency: 'USDT',
      isInverse: false,
      multiplier: '0.001',
      expected: '1 global.unit = 0.001 USDT',
    },
  ])(
    '测试 quantityPlaceholder 方法, 参数为 %j',
    ({ baseCurrency, isInverse, multiplier, quoteCurrency, expected }) => {
      const mockFn = jest.fn((v) => v);
      expect(
        quantityPlaceholder({ baseCurrency, isInverse, multiplier, quoteCurrency }, mockFn),
      ).toBe(expected);
    },
  );

  it.each([
    {
      params: '',
      expected: [],
    },
    {
      params: [{ priceChgPct: 0.01 }, { priceChgPct: 0.02 }],
      expected: [
        { lastPrice: undefined, priceChgPct: 0.02, symbol: undefined },
        { lastPrice: undefined, priceChgPct: 0.01, symbol: undefined },
      ],
    },
    {
      params: [
        { turnover: 0.02, priceChgPct: 0.01 },
        { turnover: 0.01, priceChgPct: 0.02 },
      ],
      expected: [
        { lastPrice: undefined, priceChgPct: 0.01, symbol: undefined },
        { lastPrice: undefined, priceChgPct: 0.02, symbol: undefined },
      ],
    },
  ])('测试 sortedMarket 方法，参数为 %j', ({ params, expected }) => {
    expect(sortedMarket(params)).toEqual(expected);
  });
});
