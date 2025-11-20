import {
  formatTradingPair,
  formatTs,
  getNumberWrapper,
  getPairInfo,
  getSettleCurrency,
  getSideWrapper,
  SymbolName,
  tradeTypeName,
} from 'src/routes/AccountPage/Transfer/components/OneClickProcess/TransferTable/columns';

jest.mock('@kux/mui');
jest.mock('react-redux');
jest.mock('src/helper');
jest.mock('src/tools/i18n');
jest.mock('src/routes/AccountPage/Transfer/components/OneClickProcess/components/CommonTable');

// describe('<TimeBox>', () => {
//   test('test TimeBox', () => {
//     customRender(<TimeBox timestamp="1332345678123" />, {});
//   });
// });
// describe('<SideText> buy', () => {
//   test('test SideText buy', () => {
//     customRender(<SideText text="buy" />, {});
//   });
// });

// describe('<SideText> sell', () => {
//   test('test SideText sell', () => {
//     customRender(<SideText text="sell" />, {});
//   });
// });

describe('formatTs', () => {
  // it('should expose a function', () => {
  //   expect(formatTs('1345678432123')).toBe('2012-08-23 07:33:52');
  // });

  it('formatTs should return expected output', () => {
    expect(formatTs(0)).toBe('--');
  });
});
describe('formatTradingPair', () => {
  it('should expose a function', () => {
    expect(formatTradingPair('a/b')).toBeDefined();
  });

  it('formatTradingPair should return expected output', () => {
    expect(formatTradingPair('')).toBe('');
  });
});
describe('getPairInfo', () => {
  it('should expose a function', () => {
    expect(getPairInfo('')).toBeDefined();
  });

  it('getPairInfo should return expected output', () => {
    expect(getPairInfo('2021-2020')).toBeDefined();
  });
});
describe('getSettleCurrency', () => {
  it('should expose a function', () => {
    expect(getSettleCurrency('XBT')).toBe('BTC');
  });

  it('getSettleCurrency should return expected output', () => {
    expect(getSettleCurrency('ETH')).toBe('ETH');
  });
});
describe('getSideWrapper', () => {
  it('should expose a function', () => {
    expect(getSideWrapper('buy')).toBeDefined();
  });

  it('getSideWrapper should return expected output', () => {
    expect(getSideWrapper('sell')).toBeDefined();
  });
});
describe('getNumberWrapper', () => {
  it('should expose a function', () => {
    expect(getNumberWrapper(0)).toBeDefined();
  });

  it('getNumberWrapper should return expected output', () => {
    // const retValue = getNumberWrapper(number);
    expect(getNumberWrapper(12.23)).toBeDefined();
  });
});
describe('SymbolName', () => {
  it('should expose a function', () => {
    expect(SymbolName({ symbol: '' })).toBe('--');
  });

  it('SymbolName should return expected output', () => {
    // const retValue = SymbolName();
    expect(SymbolName({ symbol: 'ETH' })).toBeDefined();
  });
});
describe('tradeTypeName', () => {
  it('should expose a function', () => {
    expect(tradeTypeName('MARGIN_TRADE')).toBeDefined();
  });

  it('tradeTypeName should return expected output', () => {
    expect(tradeTypeName('MARGIN_ISOLATED_TRADE')).toBeDefined();
  });
});

describe('stopMark', () => {});
