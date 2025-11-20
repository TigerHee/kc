/**
 * Owner: lori@kupotech.com
 */
import { transData, multiply, useIsMobile } from 'src/routes/SpotNFTPage/util.js';
import Decimal from 'decimal.js';

jest.mock('@kufox/mui', () => {
  return {
    __esModule: true,
    useResponsive: () => {
      return {
        sm: true,
        md: false,
        lg: false,
      };
    },
  };
});

describe('test routes/SpotNFTPage/util', () => {
  test('test transData', () => {
    expect(transData([], 3)).toEqual([]);
    expect(transData([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    expect(transData([1, 2, 3, 4, 5], 3)).toEqual([
      [1, 2, 3],
      [4, 5, undefined],
    ]);
  });

  test('test multiply', () => {
    expect(multiply(null, 2)).toBe(0);
    expect(multiply(undefined, 2)).toBe(0);
    expect(multiply(2, null)).toBe(0);
    expect(multiply(2, undefined)).toBe(0);
    expect(multiply(2, 0)).toBe(0);
    expect(multiply(2, '0')).toBe(0);
    expect(multiply('abc', 2)).toBe(0);
    expect(multiply(2, 'abc')).toBe(0);
    const a = 2.5;
    const b = 3.5;
    const expectedResult = new Decimal(a).mul(b).valueOf();
    expect(multiply(a, b)).toBe(expectedResult);
  });

  test('test useIsMobile', () => {
    expect(useIsMobile()).toBe(true);
  });
});
