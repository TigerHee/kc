import { displayName, nameMap, SUB_ACCOUNT_MAP } from 'src/routes/AccountPage/SubAccount/config';

jest.mock('tools/i18n', () => {
  return {
    __esModule: true,
    default: null,
    _t: jest.fn((i) => i),
  };
});

describe('displayName', () => {
  it('should return "-" when tradeTypes is empty or not provided', () => {
    expect(displayName()).toBe('-');
    expect(displayName([])).toBe('-');
  });

  it('should return correct display names for given tradeTypes', () => {
    const tradeTypes = ['Spot', 'Margin', 'Futures', 'Option'];
    const expectedOutput = `${nameMap[SUB_ACCOUNT_MAP.spot]}, ${nameMap[SUB_ACCOUNT_MAP.option]}, ${
      nameMap[SUB_ACCOUNT_MAP.margin]
    }, ${nameMap[SUB_ACCOUNT_MAP.futures]}`;
    expect(displayName(tradeTypes)).toBe(expectedOutput);
  });

  it('should return "-" when an error occurs', () => {
    expect(displayName('not an array')).toBe('-');
  });
});
