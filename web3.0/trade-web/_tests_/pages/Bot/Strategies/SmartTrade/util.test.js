/**
 * Owner: mike@kupotech.com
 */
import {
  handleSortPercent,
  transformDecimalToInteger,
  diffChange,
  dropOthers,
  dropNull,
  getSymbolsNameTexts,
  timesPercent100,
} from 'Bot/Strategies/SmartTrade/util';

jest.mock('utils/lang', () => ({
  getLang: function () {
    return 'en-US';
  },
  _t: function () {
    return '';
  },
  isRTLLanguage: () => false,
}));

describe('智能持仓函数handleSortPercent', () => {
  it('should sort the data array in descending order based on the percent property', () => {
    const data = [{ percent: '0.1' }, { percent: '0.3' }, { percent: '0.2' }];

    const expectedResult = [
      { percent: '0.3', formatedPercent: 70 },
      { percent: '0.2', formatedPercent: 20 },
      { percent: '0.1', formatedPercent: 10 },
    ];

    const result = handleSortPercent(data);

    expect(result).toMatchObject(expectedResult);
  });

  it('should calculate the formatedPercent property for each item in the data array', () => {
    const data = [{ percent: '0.1' }, { percent: '0.3' }, { percent: '0.2' }];

    const expectedResult = [
      { percent: '0.3', formatedPercent: 70 },

      { percent: '0.2', formatedPercent: 20 },

      { percent: '0.1', formatedPercent: 10 },
    ];

    const result = handleSortPercent(data);

    expect(result).toMatchObject(expectedResult);
  });

  it('should return an empty array if the input data array is empty', () => {
    const data = [];

    const expectedResult = [];

    const result = handleSortPercent(data);

    expect(result).toEqual(expectedResult);
  });
  it('no paramater', () => {
    expect(handleSortPercent()).toEqual([]);
  });
});

describe('智能持仓函数transformDecimalToInteger', () => {
  it('should transform decimal percentages to integers', () => {
    const data = [{ percent: '0.502' }, { percent: '0.3' }, { percent: '0.198' }];

    const expectedResult = [{ percent: 50 }, { percent: 30 }, { percent: 20 }];

    const result = transformDecimalToInteger(data);

    expect(result).toMatchObject(expectedResult);
  });

  it('should return the input data if all percentages are already integers', () => {
    const data = [{ percent: '0.25' }, { percent: '0.5' }, { percent: '0.25' }];

    const expectedResult = [{ percent: 25 }, { percent: 50 }, { percent: 25 }];

    const result = transformDecimalToInteger(data);

    expect(result).toMatchObject(expectedResult);
  });

  it('should return an empty array if the input data array is empty', () => {
    const data = [];

    const expectedResult = [];

    const result = transformDecimalToInteger(data);

    expect(result).toEqual(expectedResult);
  });
});

describe('智能持仓函数diffChange', () => {
  it('should calculate the difference between targets and coins', () => {
    const targets = [
      { currency: 'A', value: 10, balance: 100 },

      { currency: 'B', value: 20, balance: 200 },
    ];

    const coins = [
      { currency: 'A', value: 15, balance: 150, triggerPrice: 1 },

      { currency: 'C', value: 30, balance: 300, triggerPrice: 2 },
    ];

    const expectedResult = {
      change: [
        {
          base: 'A',

          before: 10,

          beforeBalance: 100,

          after: 15,

          afterBalance: 150,

          triggerPrice: 1,

          changer: 5,
        },

        {
          base: 'C',

          before: 0,

          beforeBalance: 0,

          after: 30,

          afterBalance: 300,

          triggerPrice: 2,

          changer: 30,
        },
        {
          base: 'B',

          before: 20,

          beforeBalance: 200,

          after: 0,

          afterBalance: 0,

          triggerPrice: '',

          changer: -20,
        },
      ],

      add: {
        C: { currency: 'C', value: 30, balance: 300, triggerPrice: 2 },
      },
    };

    const result = diffChange(targets, coins);
    expect(result).toMatchObject(expectedResult);
  });

  it('should return empty change and add arrays if both input arrays are empty', () => {
    const targets = [];

    const coins = [];

    const expectedResult = {
      change: [],
      add: {},
    };

    const result = diffChange(targets, coins);

    expect(result).toEqual(expectedResult);
  });
  it('币种删除的情况', () => {
    const targets = [
      { currency: 'A', value: 10, balance: 100 },

      { currency: 'B', value: 20, balance: 200 },
    ];

    const coins = [{ currency: 'A', value: 15, balance: 150, triggerPrice: 1 }];

    const expectedResult = {
      change: [
        {
          base: 'A',

          before: 10,

          beforeBalance: 100,

          after: 15,

          afterBalance: 150,

          triggerPrice: 1,

          changer: 5,
        },
        {
          base: 'B',

          before: 20,

          beforeBalance: 200,

          after: 0,

          afterBalance: 0,

          changer: -20,
        },
      ],
      add: {},
    };

    const result = diffChange(targets, coins);
    expect(result).toMatchObject(expectedResult);
  });
  it('币种value空的情况', () => {
    const targets = [
      { currency: 'A', value: '', balance: '' },

      { currency: 'B', value: '', balance: '' },
    ];

    const coins = [{ currency: 'A', value: '', balance: '', triggerPrice: 1 }];

    const expectedResult = {
      change: [
        {
          base: 'A',

          before: 0,

          beforeBalance: 0,

          after: 0,

          afterBalance: 0,

          triggerPrice: 1,

          changer: 0,
        },
        {
          base: 'B',

          before: 0,

          beforeBalance: 0,

          after: 0,

          afterBalance: 0,

          changer: 0,
        },
      ],
      add: {},
    };

    const result = diffChange(targets, coins);
    expect(result).toMatchObject(expectedResult);
  });
});

describe('持仓util', () => {
  it('去除额外的字段', () => {
    const obj = {
      interval: '3D',
      threshold: '0.04',
      autoChange: true,
      time: 999,
    };
    const results2 = {
      interval: '3D',
      threshold: '0.04',
      autoChange: true,
    };
    expect(dropOthers(obj)).toEqual(results2);
  });
  it('检查提交的时候去除空函数', () => {
    const obj = {
      interval: null,
      threshold: '0.04',
      autoChange: true,
    };
    const results2 = {
      threshold: '0.04',
      autoChange: true,
    };
    expect(dropNull(obj)).toEqual(results2);
  });
  it('timesPercent100将后端返回的数据，value、percent * 100', () => {
    const targets = [
      {
        currency: 'BTC',
        percent: 0.6,
      },
      { currency: 'KCS', percent: 0.4 },
    ];
    const results = [
      {
        currency: 'BTC',
        percent: 60,
        value: 60,
      },
      { currency: 'KCS', percent: 40, value: 40 },
    ];
    expect(timesPercent100(targets)).toEqual(results);
  });
  it('timesPercent100将后端返回的数据，value、percent * 100', () => {
    expect(timesPercent100()).toEqual([]);
  });
});
jest.mock('Bot/hooks/useSpotSymbolInfo', () => ({
  getCurrencyName: jest.fn((currency) => currency),
}));
describe('getSymbolsNameTexts', () => {
  it('should return "--" when snapshots is undefined', () => {
    expect(getSymbolsNameTexts(undefined)).toBe('--');
  });

  it('should return "--" when snapshots is an empty array', () => {
    expect(getSymbolsNameTexts([])).toBe('--');
  });

  it('should return a string of currency names separated by "、" when snapshots is a non-empty array', () => {
    const snapshots = [{ currency: 'USD' }, { currency: 'EUR' }, { currency: 'GBP' }];

    expect(getSymbolsNameTexts(snapshots)).toBe('USD、EUR、GBP');
  });
});
