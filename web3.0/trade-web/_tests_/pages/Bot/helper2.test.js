/**
 * Owner: mike@kupotech.com
 */
import {
  RateToNumber,
  pureNumber,
  getNumberUnit,
  isNull,
  formatEffectiveDecimal,
  div100,
  times100,
  isDecimal,
  isZero,
  toNonExponential,
  testDecimalIsOk,
  toSplitCase,
  toCableCase,
  getLang,
  getAvailLang,
  decodeSymbol,
  getBase,
  getQuota,
  nuclearCaclRunTime,
  calcRunTime,
  formatDuration,
  formatSpanDuration,
  queryString,
  floatToPercent,
  localDateTimeFormat,
  isFutureSymbol,
  isSpotSymbol,
  jump,
  dividerNumberParts,
  floatText,
  calcChangeRateAll,
  convertBool,
  createMarks,
  getFormErr,
} from 'Bot/helper';
import { isRTLLanguage } from 'src/utils/langTools';

jest.mock('react-intl-universal', () => ({
  options: {
    currentLocale: 'en_US',
  },
}));

jest.mock('src/utils/langTools', () => ({
  isRTLLanguage: jest.fn(),
}));
describe('getLang', () => {
  it('should return current locale', () => {
    const locale = getLang();

    expect(locale).toEqual('en_US');
  });
});
describe('getAvailLang', () => {
  it('should return current locale', () => {
    const locale = getAvailLang();

    expect(locale).toEqual('en_US');
  });
});
describe('DateTimeFormat functions', () => {
  test('localDateTimeFormat should correctly format date', () => {
    const date = new Date('2021-09-01 05:00:00');
    expect(localDateTimeFormat(date)).toBe('09/01/2021 05:00:00');
  });
});
describe('floatToPercent 函数', () => {
  test('没有value', () => {
    expect(floatToPercent()).toBe();
  });

  test('value = 非数字', () => {
    expect(floatToPercent('a')).toBe('a');
  });

  test('转换成百分比', () => {
    expect(floatToPercent('0.1')).toBe('10%');
  });
});
describe('isNull', () => {
  it('should return true if str is null or undefined', () => {
    expect(isNull('')).toBe(true);
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(true);
    expect(isNull('null')).toBe(true);
    expect(isNull('undefined')).toBe(true);
  });

  it('should return false if str is not null or undefined', () => {
    expect(isNull('test')).toBe(false);
  });
});
describe('decodeSymbol', () => {
  it('should return an empty array if symbol is not provided', () => {
    const result = decodeSymbol();

    // Expect the result to be an empty array
    expect(result).toEqual([]);
  });

  it('should split the symbol by "/" or "-"', () => {
    const result = decodeSymbol('BTC/USD');

    // Expect the result to be ['BTC', 'USD']
    expect(result).toEqual(['BTC', 'USD']);
  });

  it('should split the symbol by "-" when "/" is not present', () => {
    const result = decodeSymbol('BTC-USD');

    // Expect the result to be ['BTC', 'USD']
    expect(result).toEqual(['BTC', 'USD']);
  });
});
describe('isFutureSymbol', () => {
  it('should return true for future symbols', () => {
    expect(isFutureSymbol('XBT')).toBe(true);

    expect(isFutureSymbol('USDTM')).toBe(true);

    expect(isFutureSymbol('USDCM')).toBe(true);

    expect(isFutureSymbol('USDM')).toBe(true);
  });

  it('should return false for non-future symbols', () => {
    expect(isFutureSymbol('ABC')).toBe(false);

    expect(isFutureSymbol('')).toBe(false);

    expect(isFutureSymbol(null)).toBe(false);
  });
});

describe('isSpotSymbol', () => {
  it('should return true for spot symbols', () => {
    expect(isSpotSymbol('ABC-DEF')).toBe(true);

    expect(isSpotSymbol('GHI-JKL')).toBe(true);
  });

  it('should return false for non-spot symbols', () => {
    expect(isSpotSymbol('ABC')).toBe(false);

    expect(isSpotSymbol('')).toBe(false);

    expect(isSpotSymbol(null)).toBe(false);
  });
});
describe('jump', () => {
  it('should call window.open with the provided url and target', () => {
    const mockOpen = jest.fn();

    global.window.open = mockOpen;

    const url = 'http://example.com';

    jump(url);

    expect(mockOpen).toHaveBeenCalledWith(url, '_blank');
  });
});
describe('dividerNumberParts', () => {
  it('should divide number parts correctly', () => {
    expect(dividerNumberParts('-9999.99%')).toEqual(['-', '9999.99', '%']);

    expect(dividerNumberParts('+9999.99%')).toEqual(['+', '9999.99', '%']);

    expect(dividerNumberParts('9999.99%')).toEqual(['', '9999.99', '%']);

    expect(dividerNumberParts('-9999.99')).toEqual(['-', '9999.99', '']);

    expect(dividerNumberParts('+9999.99')).toEqual(['+', '9999.99', '']);

    expect(dividerNumberParts('9999.99')).toEqual(['', '9999.99', '']);
  });

  it('should return original value for non-matching strings', () => {
    expect(dividerNumberParts('ABC')).toBe('ABC');

    expect(dividerNumberParts('')).toBe('');

    expect(dividerNumberParts(null)).toBe('null');
  });
});

describe('floatText', () => {
  it('should append text correctly for RTL languages', () => {
    isRTLLanguage.mockReturnValue(true);

    const value = '123';

    const append = '%';

    expect(floatText(value, append)).toBe(`${append}${value}`);
  });

  it('should append text correctly for non-RTL languages', () => {
    isRTLLanguage.mockReturnValue(false);

    const value = '123';

    const append = '%';

    expect(floatText(value, append)).toBe(`${value}${append}`);
  });
});

test('dividerNumberParts 函数', () => {
  isRTLLanguage.mockReturnValue(true);
  expect(dividerNumberParts('-1,000.00%')).toEqual(['-', '1,000.00', '%']);
  expect(dividerNumberParts('+200')).toEqual(['+', '200', '']);
  expect(dividerNumberParts('300.50')).toEqual(['', '300.50', '']);
  expect(dividerNumberParts('%')).toEqual('%');
  expect(dividerNumberParts('not a number')).toEqual('not a number');
});
it('函数calcChangeRateAll', () => {
  expect(calcChangeRateAll(0, 0)).toBe(0);

  expect(calcChangeRateAll(100, 50)).toBe('1.0000');

  expect(calcChangeRateAll(150, 100)).toBe('0.5000');

  expect(calcChangeRateAll('100', '50')).toBe('1.0000');

  expect(calcChangeRateAll('150', '100')).toBe('0.5000');

  expect(calcChangeRateAll('abc', 50)).toBe('NaN');

  expect(calcChangeRateAll(100, 'xyz')).toBe('NaN');
});
it('函数convertBool', () => {
  expect(convertBool('true')).toBe(true);

  expect(convertBool('false')).toBe(false);

  expect(convertBool('abc')).toBe(true);

  expect(convertBool('')).toBe(false);
  expect(convertBool(true)).toBe(true);

  expect(convertBool(false)).toBe(false);
  expect(convertBool(1)).toBe(1);

  expect(convertBool(0)).toBe(0);
  expect(convertBool(null)).toBe(null);

  expect(convertBool(undefined)).toBe(undefined);
});
describe('getFormErr', () => {
  it('should return true if any element has errors', () => {
    const arr = [{ errors: ['error1'] }, { errors: [] }, { errors: ['error2'] }];

    expect(getFormErr(arr)).toBe(true);
  });

  it('should return false if no elements have errors', () => {
    const arr = [{ errors: [] }, { errors: [] }, { errors: [] }];

    expect(getFormErr(arr)).toBe(false);
  });

  it('should return false if array is empty', () => {
    expect(getFormErr([])).toBe(false);
  });

  it('should return false if array is not provided', () => {
    expect(getFormErr()).toBe(false);
  });
});

describe('createMarks function', () => {
  it('should create marks array correctly', () => {
    const marks = createMarks({ min: 0, max: 100, step: 10, unit: '%' });

    // 期望生成的 mark 数组
    const expectedMarks = [
      { value: 0, label: '0%' },
      { value: 10, label: '10%' },
      { value: 20, label: '20%' },
      { value: 30, label: '30%' },
      { value: 40, label: '40%' },
      { value: 50, label: '50%' },
      { value: 60, label: '60%' },
      { value: 70, label: '70%' },
      { value: 80, label: '80%' },
      { value: 90, label: '90%' },
      { value: 100, label: '100%' },
    ];

    expect(marks).toEqual(expectedMarks);
  });
});
describe('helper模块单元测试', () => {
  test('queryString 函数应该正确地将对象转换为查询字符串', () => {
    const data = {
      name: 'John Doe',
      age: 30,
      city: 'New York',
    };
    const result = queryString(data);
    expect(result).toBe('name=John Doe&age=30&city=New York');
  });

  test('queryString 函数应该忽略值为 undefined 或 null 的属性', () => {
    const data = {
      name: 'John Doe',
      age: null,
      city: 'New York',
    };
    const result = queryString(data);
    expect(result).toBe('name=John Doe&city=New York');
  });
  it('开始结束时间格式化', () => {
    expect(formatDuration(1604980954572, 1674988954572)).toEqual('810d 6h 40m');
  });
  it('函数formatSpanDuration', () => {
    expect(formatSpanDuration()).toEqual('0d 0h');
    expect(formatSpanDuration(1674988954572)).toEqual('19386d 10h 42m');
  });
  it('函数calcRunTime', () => {
    expect(calcRunTime(1674988954572)).toEqual('19386d 10h 42m');
  });
  it('计算除以100', () => {
    expect(div100(100)).toEqual(1);
    expect(div100(9)).toEqual(0.09);
  });
  it('计算乘以100', () => {
    expect(times100(100)).toEqual(10000);
    expect(times100(0.01)).toEqual(1);
  });

  it('pureNumber', () => {
    expect(pureNumber(12345.456, 6)).toEqual('12345.456');
    expect(pureNumber(12345.45678, 2)).toEqual('12345.45');
  });
  it('应将百分比转换为数字RateToNumber', () => {
    expect(RateToNumber(-0.03, 2, true)).toEqual(-3);
    expect(RateToNumber(0.045, 2, true)).toEqual(4.5);
  });
  it('floatToPercent', () => {
    expect(floatToPercent(0.03, 2, 100, true)).toEqual('+3%');
    expect(floatToPercent(0.098, 2)).toEqual('9.8%');
    expect(floatToPercent(-0.12345)).toEqual('-12.345%');
    expect(floatToPercent(0.5, 2)).toEqual('50%');
    expect(floatToPercent(-0.5, 2, 100, true)).toEqual('-50%');
  });

  it('格式化有效位数的小数，可以传入理想精度', () => {
    expect(formatEffectiveDecimal('123.45300')).toEqual('123.453');
    expect(formatEffectiveDecimal('123.00')).toEqual('123');
    expect(formatEffectiveDecimal(0)).toEqual(0);
    expect(formatEffectiveDecimal(0.00000000153)).toEqual('0.00000000153');
    expect(formatEffectiveDecimal(0.1234567890123)).toEqual('0.12345678');
  });

  it('获取数字正负号', () => {
    expect(getNumberUnit('123.4560')).toEqual('+');
    expect(getNumberUnit('-123.4560')).toEqual('');
  });

  it('计算时间差，转换 天时分秒', () => {
    expect(nuclearCaclRunTime(1674988954572)).toMatchObject({
      day: 19386,
      hour: 10,
      minite: 42,
      sec: 34,
    });
  });
  it('函数isDecimal', () => {
    expect(isDecimal(0)).toBeFalsy();
    expect(isDecimal(9.9)).toBeTruthy();
  });
});
describe('isZero', () => {
  it('should return true if val is zero', () => {
    expect(isZero('0')).toBe(true);
    expect(isZero('0.0')).toBe(true);
    expect(isZero('0.00')).toBe(true);
  });

  it('should return false if val is not zero', () => {
    expect(isZero('1')).toBe(false);
    expect(isZero('0.1')).toBe(false);
  });
});
describe('toNonExponential', () => {
  test('should convert a number in scientific notation to a string', () => {
    expect(toNonExponential(5.123e-7)).toBe('0.0000005123');
  });

  test('should handle non-scientific notation numbers', () => {
    expect(toNonExponential(123.45)).toBe('123.45');
  });
});
describe('testDecimalIsOk', () => {
  test('should return true if the value matches the specified precision', () => {
    expect(testDecimalIsOk(2, 3.14)).toBe(true);
  });

  test('should return false if the value does not match the specified precision', () => {
    expect(testDecimalIsOk(2, 3.14159)).toBe(false);
  });

  test('should handle integer cases', () => {
    expect(testDecimalIsOk(0, 42)).toBe(true);
    expect(testDecimalIsOk(0, 42.5)).toBe(false);
  });
});

describe('toCableCase', () => {
  it('should return an empty string if symbol is not provided', () => {
    const result = toCableCase();

    // Expect the result to be an empty string
    expect(result).toBeUndefined();
  });

  it('should replace "/" with "-"', () => {
    const result = toCableCase('BTC/USD');

    // Expect the result to be 'BTC-USD'
    expect(result).toBe('BTC-USD');
  });
});

describe('toSplitCase', () => {
  it('should return an empty string if symbol is not provided', () => {
    const result = toSplitCase();

    // Expect the result to be an empty string
    expect(result).toBeUndefined();
  });

  it('should replace "-" with "/"', () => {
    const result = toSplitCase('BTC-USD');

    // Expect the result to be 'BTC/USD'
    expect(result).toBe('BTC/USD');
  });
});

describe('getBase', () => {
  it('should return undefined if symbol is not provided', () => {
    const result = getBase();

    // Expect the result to be undefined
    expect(result).toBeUndefined();
  });

  it('should return the base of the symbol', () => {
    const result = getBase('BTC/USD');

    // Expect the result to be 'BTC'
    expect(result).toBe('BTC');
  });
});

describe('getQuota', () => {
  it('should return undefined if symbol is not provided', () => {
    const result = getQuota();

    // Expect the result to be undefined
    expect(result).toBeUndefined();
  });

  it('should return the quota of the symbol', () => {
    const result = getQuota('BTC/USD');

    // Expect the result to be 'USD'
    expect(result).toBe('USD');
  });
});
