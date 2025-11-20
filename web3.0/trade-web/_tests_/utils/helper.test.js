import _ from 'lodash';
import moment from 'moment';
import {
  captureException,
  Decimal,
  add,
  addAndFixed,
  divide,
  divideAndFixed,
  dropZero,
  fixWithZero,
  displayNumber,
  formatNumber,
  formatNumberByStep,
  multiplyAndFixed,
  numberFixed,
  readableNumber,
  separateNumber,
  subAndFixed,
  transStepToPrecision,
  createDecimals,
  getPrecisionFromIncrement,
  getFileType,
  showDatetime,
  showDateTimeByZone,
  zoneTime2LocalTime,
  toDateTs,
  timestamp,
  mapToArray,
  multiplyFloor,
  getTimezone,
  getTimeData,
  orderSort,
  padString,
  getPathAuth,
  genWalletTxUrl,
  toUTC8,
  formatCountdown,
  concatPath,
  floadToPercent,
  removeSpaceSE,
  removeSeparator,
  getTimeStampOnHour,
  numberResolve,
  replaceSearch,
  sleep,
  isOutOfTimeRange,
  mvArrayValue,
  getArrayPage,
  getJWTPath,
  reportCoinLost,
  getFirstBrowserLanguage,
  getURL,
  getRandomItem,
  isOpenInWechat,
  scrollToAnchor,
  viewPortMeta,
  searchToJson,
  getFullURL,
  getCmsCdnHost,
  getCurrentTime,
  convertMaintenanceJSON,
  transferNumDisplayByLang,
  getBase64,
  cryptoPwd,
  blockScroll,
  transformParam,
  toNonExponential,
  getDigit,
  toPercent,
  roundDownByStep,
  roundUpByStep,
  formatDateTime,
  guid,
  filterAndCheckSymbolArray,
  setNumToPrecision,
  dropZeroSafe,
  moment2Intl,
  formlize,
  Event,
  launchFullScreen,
  exitFullscreen,
} from 'src/helper';
import { isRTL } from '@/hooks/common/useLang';

jest.mock('@/hooks/common/useLang', () => {
  return {
    isRTL: jest.fn(),
  };
});

// Jest.js error: "Received: serializes to the same string" need toString to fix it
const toStrings = (fn, ...args) => fn(...args).toString();

describe('captureException 函数', () => {
  test('captureException promise', async () => {
    expect.assertions(1);
    const data = await captureException();
    expect(data).toBeUndefined();
  });
});

describe('add 高精度加法 函数', () => {
  test('参数都为正整数', () => {
    expect(toStrings(add, 1, 3)).toBe('4');
  });

  test('参数为一正一负', () => {
    expect(toStrings(add, 1, -13)).toBe('-12');
  });

  test('参数都为浮点数', () => {
    expect(toStrings(add, 1.33333, 3.444567)).toBe('4.777897');
  });

  test('参数都为字符串类型的数', () => {
    expect(toStrings(add, '1.33333', '3.444567')).toBe('4.777897');
  });

  test('参数为一个字符串类型的数和一个正整数', () => {
    expect(toStrings(add, '1.33333', 4)).toBe('5.33333');
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => add('a', 'b');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('addAndFixed 高精度加法，并转换成字符串显示（默认超出精度截断） 函数', () => {
  test('参数都为正整数 默认 decimal', () => {
    expect(addAndFixed(1, 2)).toBe('3.00000000');
  });
  test('参数都为正整数 decimal = 0', () => {
    expect(addAndFixed(1, 2, 0)).toBe('3');
  });

  test('参数都为正整数 decimal = 1', () => {
    expect(addAndFixed(1, 2, 1)).toBe('3.0');
  });

  test('参数都为浮点数', () => {
    expect(addAndFixed(100000.98765432, 20000.09876541234)).toBe('120001.08641973');
  });

  test('参数都为浮点数 decimal = 5 ', () => {
    expect(addAndFixed(100000.98765432, 20000.09876541234, 5)).toBe('120001.08641');
  });

  test('参数都为浮点数 decimal = 5 round = Decimal.ROUND_UP ', () => {
    expect(addAndFixed(100000.98765432, 20000.09876541234, 5, Decimal.ROUND_UP)).toBe(
      '120001.08642',
    );
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => addAndFixed('a');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('divide 高精度除法 函数', () => {
  test('参数都为正整数', () => {
    expect(toStrings(divide, 1, 3)).toBe('0.33333333333333333333');
  });

  test('参数为一正一负', () => {
    expect(toStrings(divide, 10, -3)).toBe('-3.3333333333333333333');
  });

  test('参数都为浮点数', () => {
    expect(toStrings(divide, 1.33333, 3.444567)).toBe('0.38708203382311913225');
  });

  test('参数都为字符串类型的数', () => {
    expect(toStrings(divide, '2', '1')).toBe('2');
  });

  test('参数为一个字符串类型的数和一个正整数', () => {
    expect(toStrings(divide, '10', 4)).toBe('2.5');
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => divide('a', 'b');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('divideAndFixed 高精度除法，并转换成字符串显示（默认超出精度截断） 函数', () => {
  test('参数都为正整数 默认 decimal', () => {
    expect(divideAndFixed(1, 2)).toBe('0.50000000');
  });
  test('参数都为正整数 decimal = 0', () => {
    expect(divideAndFixed(1, 2, 0)).toBe('0');
  });

  test('参数都为正整数 decimal = 1', () => {
    expect(divideAndFixed(1, 2, 1)).toBe('0.5');
  });

  test('参数都为浮点数', () => {
    expect(divideAndFixed(100000.98765432, 20000.09876541234)).toBe('5.00002469');
  });

  test('参数都为浮点数 decimal = 5 ', () => {
    expect(divideAndFixed(100000.98765432, 20000.09876541234, 5)).toBe('5.00002');
  });

  test('参数都为浮点数 decimal = 5 round = Decimal.ROUND_UP ', () => {
    expect(divideAndFixed(100000.98765432, 20000.09876541234, 5, Decimal.ROUND_UP)).toBe('5.00003');
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => divideAndFixed('a');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('dropZero 舍弃小数位0 函数', () => {
  test('没有参数', () => {
    expect(dropZero()).toBe('-');
  });

  test('参数 = 0', () => {
    expect(dropZero(0)).toBe('-');
  });

  test('参数为整数', () => {
    expect(dropZero(10)).toBe('10');
  });

  test('参数浮点数', () => {
    expect(dropZero(10.0002)).toBe('10.0002');
  });

  test('参数字符串浮点数', () => {
    expect(dropZero('10.000200000')).toBe('10.0002');
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => dropZero('a');

    expect(dropZero('a')).toBe('a');
  });
});

describe('fixWithZero 补全小数位0 函数', () => {
  test('整数', () => {
    expect(fixWithZero(2, 2)).toBe('NaN');
  });
});

describe('displayNumber 数据展示（小于精度的，展示<xxxx） 函数', () => {
  test('整数', () => {
    expect(displayNumber(2, 2)).toBe('2');
  });

  test('浮点数 decimal = 3', () => {
    expect(displayNumber('0.00000000002', 3)).toBe('< 0.001');
  });

  test('浮点数 decimal = 6', () => {
    expect(displayNumber('0.00000000002', 6)).toBe('< 0.000001');
  });

  test('decimal 为非数字', () => {
    expect(displayNumber(3, 'a')).toBe(3);
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => displayNumber('a', 3);

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('formatNumber 格式化数据（截断超出精度位数，舍弃小数位0，增加千位分隔符） 函数', () => {
  test('整数 < 1000 ', () => {
    expect(formatNumber(999)).toBe('999');
  });

  test('整数 > 1000 ', () => {
    expect(formatNumber(999999999)).toBe('999,999,999');
  });

  test('浮点数 > 1000 decimal = 5', () => {
    expect(formatNumber(0.222222222, 5)).toBe('0.22222');
  });

  test('浮点数 > 1000 decimal = 12', () => {
    expect(formatNumber('0.222222222000', 12)).toBe('0.222222222');
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => formatNumber('a', 3);

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('formatNumberByStep 根据步长格式化数据, 默认向下取整 函数', () => {
  test('如果 num 不是数字', () => {
    expect(formatNumberByStep('a')).toBe('a');
  });

  test('如果 step < 1', () => {
    expect(formatNumberByStep(1, 0)).toBe(1);
  });

  test('step 为 1', () => {
    expect(formatNumberByStep(3, 1)).toBe('3');
  });

  test('round 为 UP', () => {
    expect(formatNumberByStep(3, 2, 'UP').toString()).toBe('4');
  });
});

describe('multiplyAndFixed 高精度乘法，并转换成字符串显示（默认超出精度截断） 函数', () => {
  test('参数都为正整数 默认 decimal', () => {
    expect(multiplyAndFixed(1, 2)).toBe('2.00000000');
  });
  test('参数都为正整数 decimal = 0', () => {
    expect(multiplyAndFixed(1, 2, 0)).toBe('2');
  });

  test('参数都为正整数 decimal = 1', () => {
    expect(multiplyAndFixed(1, 2, 1)).toBe('2.0');
  });

  test('参数都为浮点数', () => {
    expect(multiplyAndFixed(100000.98765432, 20000.09876541234)).toBe('2000029629.72518008');
  });

  test('参数都为浮点数 decimal = 5 ', () => {
    expect(multiplyAndFixed(100000.98765432, 20000.09876541234, 5)).toBe('2000029629.72518');
  });

  test('参数都为浮点数 decimal = 5 round = Decimal.ROUND_UP ', () => {
    expect(multiplyAndFixed(100000.98765432, 20000.09876541234, 5, Decimal.ROUND_UP)).toBe(
      '2000029629.72519',
    );
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => multiplyAndFixed('a');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('numberFixed 高精度指定位数（默认超出精度截断）函数', () => {
  test('参数为 非数字 ', () => {
    expect(numberFixed()).toBe(undefined);
  });

  test('参数 = 0 ', () => {
    expect(numberFixed(0)).toBe('0');
  });

  test('参数为整数 ', () => {
    expect(numberFixed(100001)).toBe('100001');
  });

  test('参数为浮点数 ', () => {
    expect(numberFixed('0.100001')).toBe('0.100001');
  });

  test('参数为浮点数 decimal = 5', () => {
    expect(numberFixed('0.100001', 5)).toBe('0.10000');
  });

  test('参数为浮点数 decimal = 5, round=UP', () => {
    expect(numberFixed('0.100001', 5, Decimal.ROUND_UP)).toBe('0.10001');
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => numberFixed('a');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('readableNumber 精简大位数，并增加千分位分隔符 (超出百万的数字，小数位只显示2位) 函数', () => {
  test('非数字', () => {
    expect(readableNumber('a')).toBe('a');
  });
  test('如果 < 1000000', () => {
    expect(readableNumber(100000)).toBe('100,000');
  });

  test('如果 > 1000000', () => {
    expect(readableNumber(1000000000)).toBe('1,000,000,000.00');
  });

  test('如果是浮点数 < 1000000', () => {
    expect(readableNumber('100000.123456789')).toBe('100,000.123456789');
  });

  test('如果是浮点数 > 1000000', () => {
    expect(readableNumber('1000000000.123456789')).toBe('1,000,000,000.12');
  });
});

describe('separateNumber 增加千分位分隔符 函数', () => {
  test('非数字', () => {
    expect(separateNumber('a')).toBe('a');
  });

  test('非正确数字', () => {
    expect(separateNumber('123.33.34')).toBe('123.33');
  });

  test('正确数字', () => {
    expect(separateNumber('123')).toBe('123');
  });
});

describe('subAndFixed 高精度减法，并转换成字符串显示（默认超出精度截断）函数', () => {
  test('都为 0', () => {
    expect(subAndFixed(0, 0)).toBe('0.00000000');
  });

  test('都为 整数', () => {
    expect(subAndFixed(10, 100)).toBe('-90.00000000');
  });

  test('都为 浮点数数', () => {
    expect(subAndFixed('10.233423423', '1000.234324234')).toBe('-990.00090081');
  });

  test('都为 浮点数数 decimal = 2', () => {
    expect(subAndFixed('10.233423423', '1000.234324234', 2)).toBe('-990.00');
  });

  test('都为 浮点数数 decimal = 2 round = UP', () => {
    expect(subAndFixed('10.233423423', '1000.234324234', 2, Decimal.ROUND_UP)).toBe('-990.01');
  });
  test('异常情况参数为非数字类型', () => {
    const t = () => subAndFixed('a');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

describe('transStepToPrecision 通过步长获取精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等） 函数', () => {
  test('num 为 0', () => {
    expect(transStepToPrecision(0)).toBe(0);
  });

  test('num > 1', () => {
    expect(transStepToPrecision(10)).toBe(0);
  });

  test('num < 1', () => {
    expect(transStepToPrecision('0.12345')).toBe(5);
  });
});

describe('createDecimals 函数', () => {
  test('decimalPrecision 等于 0', () => {
    expect(createDecimals(0)).toEqual([]);
  });

  test('decimalPrecision 等于 1', () => {
    expect(createDecimals(1)).toEqual([{ length: 1, group: 1000000000 }]);
  });

  test('decimalPrecision 等于 2', () => {
    expect(createDecimals(2)).toEqual([
      { length: 2, group: 100000000 },
      { length: 1, group: 1000000000 },
    ]);
  });
});

describe('getPrecisionFromIncrement 从步长获取精度 函数', () => {
  test('没有 increment 入参', () => {
    expect(getPrecisionFromIncrement()).toBe(0);
  });

  test('increment 为 浮点数', () => {
    expect(getPrecisionFromIncrement(10.123456)).toBe(6);
  });

  test('increment 为 整数', () => {
    expect(getPrecisionFromIncrement(10)).toBe(0);
  });

  test('increment < 1', () => {
    expect(getPrecisionFromIncrement('0.123456')).toBe(6);
  });

  test('increment > 1', () => {
    expect(getPrecisionFromIncrement('10.123456')).toBe(6);
  });
});

describe('getFileType 从URL获取文件类型 函数', () => {
  test('没参数', () => {
    expect(getFileType()).toBe('');
  });
});

// describe("showDatetime 时间戳格式化 函数", () => {
//   test("没有参数", () => {
//     expect(showDatetime()).toBe("Invalid date");
//   });

//   test("时间戳", () => {
//     expect(showDatetime(1673419900690)).toBe("2023/01/11 14:51:40");
//   });

//   test("时间戳 格式化", () => {
//     expect(showDatetime(1673419900690, "YYYY-MM-DD")).toBe("2023-01-11");
//   });
// });

// describe("showDateTimeByZone 按固定时区格式化 函数", () => {
//   test("时间戳 zone = 8", () => {
//     expect(showDateTimeByZone(1673419900690, "YYYY/MM/DD HH:mm:ss")).toBe(
//       "2023/01/11 14:51:40"
//     );
//   });

//   test("时间戳 zone = 120", () => {
//     expect(showDateTimeByZone(1673419900690, "YYYY/MM/DD HH:mm:ss", 120)).toBe(
//       "2023/01/11 08:51:40"
//     );
//   });

//   test("时间戳 format = 'YYYY-MM-DD' zone = 120", () => {
//     expect(showDateTimeByZone(1673419900690, "YYYY-MM-DD", 120)).toBe(
//       "2023-01-11"
//     );
//   });
// });

// describe("zoneTime2LocalTime 将某时区的时间转化成用户本地时间 函数", () => {
//   test("时间戳 zone = 8", () => {
//     expect(zoneTime2LocalTime(1673419900690, "YYYY/MM/DD HH:mm:ss")).toBe(
//       "2023/01/11 14:51:40"
//     );
//   });

//   test("时间戳 zone = 120", () => {
//     expect(zoneTime2LocalTime(1673419900690, "YYYY/MM/DD HH:mm:ss", 120)).toBe(
//       "2023/01/06 16:51:40"
//     );
//   });

//   test("时间戳 format = 'YYYY-MM-DD' zone = 120", () => {
//     expect(zoneTime2LocalTime(1673419900690, "YYYY-MM-DD", 120)).toBe(
//       "2023-01-06"
//     );
//   });
// });

// describe("toDateTs 获取时间戳的日期部分 函数", () => {
//   test("时间戳", () => {
//     expect(toDateTs(1673419900690)).toBe(1673366400000);
//   });
// });

// describe("timestamp 字符串转时间戳 函数", () => {
//   test("Invalid date", () => {
//     expect(timestamp("abc")).toBeNull();
//   });

//   test("日期 2023/01/06 16:51:40", () => {
//     expect(timestamp("2023/01/06 16:51:40")).toBe(1672995100000);
//   });
// });

describe('mapToArray 键值对转为值数组 函数', () => {
  test('没有参数', () => {
    expect(mapToArray()).toEqual([]);
  });

  test('参数 object', () => {
    expect(mapToArray({ a: 1, b: 2 })).toEqual([1, 2]);
  });
});

describe('multiplyFloor 高精度乘法并取给定位数向下取整 函数', () => {
  test('参数都为正整数 默认 decimal', () => {
    expect(multiplyFloor(1, 2)).toBe('2.00000000');
  });
  test('参数都为正整数 decimal = 0', () => {
    expect(multiplyFloor(1, 2, 0)).toBe('2');
  });

  test('参数都为正整数 decimal = 1', () => {
    expect(multiplyFloor(1, 2, 1)).toBe('2.0');
  });

  test('参数都为浮点数', () => {
    expect(multiplyFloor(100000.98765432, 20000.09876541234)).toBe('2000029629.72518008');
  });

  test('参数都为浮点数 decimal = 5 ', () => {
    expect(multiplyFloor(100000.98765432, 20000.09876541234, 5)).toBe('2000029629.72518');
  });

  test('参数都为浮点数 decimal = 5 round = Decimal.ROUND_UP ', () => {
    expect(multiplyFloor(100000.98765432, 20000.09876541234, 5, Decimal.ROUND_UP)).toBe(
      '2000029629.72519',
    );
  });

  test('异常情况参数为非数字类型', () => {
    const t = () => multiplyFloor('a');

    expect(t).toThrow('[DecimalError] Invalid argument: a');
  });
});

// describe("getTimezone 获取时区 函数", () => {
//   test("时区", () => {
//     expect(getTimezone()).toBe("Asia/Shanghai");
//   });
// });

describe('getTimeData 将秒转化为 日、时、分、秒 四个部分 函数', () => {
  test('无参数', () => {
    expect(getTimeData()).toEqual([0, 0, 0, 0]);
  });

  test('时间戳', () => {
    expect(getTimeData(16551430)).toEqual([191, '13', '37', '10']);
  });
});

describe('orderSort 函数', () => {
  test('无参数', () => {
    expect(orderSort()).toBeUndefined();
  });

  test('空数组', () => {
    expect(orderSort([])).toEqual([]);
  });

  test('无 sorter', () => {
    expect(orderSort([1, 2])).toEqual([1, 2]);
  });

  test('从小到大排序', () => {
    expect(orderSort([1, 2], (a, b) => a - b)).toEqual([1, 2]);
  });

  test('从大到小排序', () => {
    expect(orderSort([1, 2], (a, b) => b - a)).toEqual([2, 1]);
  });

  test('无排序', () => {
    expect(orderSort([1, 2], (a, b) => 0)).toEqual([1, 2]);
  });
});

describe('padString 字符串全部转同一个字符 函数', () => {
  test('无参数', () => {
    expect(padString()).toBe('');
  });

  test('字符串', () => {
    expect(padString('abc')).toBe('***');
  });

  test('字符串 pad=#', () => {
    expect(padString('abc', '#')).toBe('###');
  });
});

describe('getPathAuth 根据路径检查是否需要检测用户是否登录 函数 ', () => {
  test('异常情况参数为非 string 类型', () => {
    const t = () => getPathAuth();

    expect(t).toThrow('Expected argument 1 to be a string.');
  });

  test('/user/', () => {
    expect(getPathAuth('/abc/user/login')).toBe('LOGIN');
  });

  test('/unbind-g2fa/', () => {
    expect(getPathAuth('/abc/unbind-g2fa/login')).toBe('LOGIN');
  });

  test('/abc/', () => {
    expect(getPathAuth('/abc/abc/login')).toBeNull();
  });
});

describe('genWalletTxUrl 生成钱包地址 函数', () => {
  test('没有 url ', () => {
    expect(genWalletTxUrl('NEO')).toBeNull();
  });

  test('没有 ID ', () => {
    expect(genWalletTxUrl('NEO')).toBeNull();
  });

  test('ID 包含 0x', () => {
    expect(genWalletTxUrl('NEO', '{txId}asdfsdfsdfsdfsdfwerr', '0xasdfsdfasou12341234')).toBe(
      'asdfsdfasou12341234asdfsdfsdfsdfsdfwerr',
    );
  });
});

describe('toUTC8 时间戳转UTC+8时间 函数', () => {
  test(' 时间戳 ', () => {
    expect(toUTC8(1673855277762)).toBe('2023-01-16 15:47:57');
  });
});

describe('formatCountdown 倒计时格式化 函数', () => {
  test(' 毫秒 ', () => {
    expect(formatCountdown(1673855508483000)).toBe('15:28:03');
  });
});

describe('concatPath 处理路径连接 函数', () => {
  test(' path 有 / 路径链接 ', () => {
    expect(concatPath('abc/', '/detail')).toBe('abc/detail');
  });

  test(' path 没有 / 路径链接 ', () => {
    expect(concatPath('abc', 'detail')).toBe('abc/detail');
  });
});

describe('floadToPercent 转换成百分比 函数', () => {
  test('非 number ', () => {
    expect(floadToPercent('abc')).toBe('abc');
  });

  test('number ', () => {
    expect(floadToPercent('0.23')).toBe('23%');
  });
});

describe('removeSpaceSE 去除左右空格 函数', () => {
  test('无空格 ', () => {
    expect(removeSpaceSE('adfasdf')).toBe('adfasdf');
  });

  test('中间空格 ', () => {
    expect(removeSpaceSE('adf asdf')).toBe('adf asdf');
  });

  test('左空格 ', () => {
    expect(removeSpaceSE('  adfasdf')).toBe('adfasdf');
  });

  test('又空格 ', () => {
    expect(removeSpaceSE('adfasdf   ')).toBe('adfasdf');
  });

  test('左又空格 ', () => {
    expect(removeSpaceSE('  adfasdf   ')).toBe('adfasdf');
  });
});

describe('removeSeparator 去除分隔符 函数', () => {
  test('没有参数', () => {
    expect(removeSeparator()).toBe(undefined);
  });

  test('有参数', () => {
    expect(removeSeparator('KCS/BTC')).toBe('KCSBTC');
  });
});

describe('getTimeStampOnHour 获取时间戳的一定长度值，主要用于缓存使用 函数', () => {
  test('长度为1', () => {
    expect(getTimeStampOnHour(1).length).toBe(1);
  });

  test('长度为5', () => {
    expect(getTimeStampOnHour(5).length).toBe(5);
  });
});

describe('numberResolve 处理数字过大的展示 函数', () => {
  test('小于 1000', () => {
    expect(numberResolve(999)).toBe('999.00000000');
  });

  test('大于 10000 && 小于 1000000', () => {
    expect(numberResolve(999999)).toBe('999.9K');
  });

  test('大于 1000000', () => {
    expect(numberResolve(99999999)).toBe('99.99M');
  });

  test('大于 1000000000', () => {
    expect(numberResolve(99999999999)).toBe('99.99B');
  });

  test('大于 1000000000000', () => {
    expect(numberResolve(99999999999999)).toBe('99.99T');
  });
});

describe('replaceSearch 函数', () => {
  test('正常URL', () => {
    expect(replaceSearch('https://www.baidu.com?a=1&b=2', 'a', 'cccc')).toBe(
      'https://www.baidu.com?a=cccc&b=2',
    );
  });

  test('正常URL 无 key', () => {
    expect(replaceSearch('https://www.baidu.com?a=1&b=2', 'd', 'cccc')).toBe(
      'https://www.baidu.com?a=1&b=2',
    );
  });
});

describe('sleep 函数', () => {
  test('sleep ', async () => {
    expect.assertions(1);
    const data = await sleep();
    expect(data).toBeUndefined();
  });
});

describe('isOutOfTimeRange 函数', () => {
  test('time < 1', () => {
    expect(isOutOfTimeRange(0, [])).toBeTruthy();
  });

  test('time > 1 没有 rangeList', () => {
    expect(isOutOfTimeRange(2, [])).toBeTruthy();
  });

  test('time > 1 没有 rangeList', () => {
    expect(isOutOfTimeRange(2, [3, 4])).toBeTruthy();
  });
});

describe('mvArrayValue 函数', () => {
  test('mvArrayValue toFront=true', () => {
    expect(mvArrayValue([1, 2, 3, 4], 2, true)).toEqual([2, 1, 3, 4]);
  });

  test('mvArrayValue toFront=false', () => {
    expect(mvArrayValue([1, 2, 3, 4], 2, false)).toEqual([1, 3, 4, 2]);
  });
});

describe('getArrayPage 函数', () => {
  test('getArrayPage offset > arr.length', () => {
    expect(getArrayPage(1, 10, [1, 2])).toEqual([1, 2]);
  });

  test('getArrayPage  offset < arr.length', () => {
    expect(getArrayPage(1, 1, [1, 2, 3])).toEqual([1]);
  });
});

describe('getJWTPath 函数', () => {
  test('platform!=zendesk', () => {
    expect(getJWTPath()).toBeNull();
  });
  test('getJWTPath returnTo=false', () => {
    expect(getJWTPath('zendesk', 'jwt')).toBe('https://support.kucoin.plus/access/jwt?jwt=jwt');
  });

  test('getJWTPath returnTo=true', () => {
    expect(getJWTPath('zendesk', 'jwt', 'abc')).toBe(
      'https://support.kucoin.plus/access/jwt?jwt=jwt&return_to=abc',
    );
  });
});

describe('reportCoinLost 函数', () => {
  test('reportCoinLost', () => {
    expect(reportCoinLost('BTC')).toBeUndefined();
  });
});

describe('getFirstBrowserLanguage 函数', () => {
  test('getFirstBrowserLanguage', () => {
    expect(getFirstBrowserLanguage()).toBe('en-US');
  });
});

describe('getURL 函数', () => {
  test('getURL', () => {
    expect(getURL()).toBe('/');
  });
});

describe('getRandomItem 函数', () => {
  test('getRandomItem 无参数', () => {
    expect(getRandomItem()).toBeNull();
  });

  test('getRandomItem 有参数', () => {
    expect(getRandomItem(['1', '2', '3'])).toMatch(/1|2|3/);
  });
});

describe('isOpenInWechat 函数', () => {
  test('isOpenInWechat 无参数', () => {
    expect(isOpenInWechat()).toBeNull();
  });

  test('isOpenInWechat 有参数', () => {
    expect(isOpenInWechat('MicroMessenger')).toBeFalsy();
  });
});

describe('scrollToAnchor 函数', () => {
  test('scrollToAnchor 没有anchorName', () => {
    expect(scrollToAnchor()).toBeUndefined();
  });

  test('scrollToAnchor 有anchorName', () => {
    expect(scrollToAnchor('abc')).toBeUndefined();
  });
});

describe('viewPortMeta 函数', () => {
  test('viewPortMeta isMobile=true', () => {
    expect(viewPortMeta(true)).toBeUndefined();
  });
  test('viewPortMeta isMobile=false', () => {
    expect(viewPortMeta(false)).toBeUndefined();
  });
});

describe('searchToJson 函数', () => {
  test('searchToJson 无参数', () => {
    expect(searchToJson()).toEqual({});
  });

  test('searchToJson 有参数', () => {
    expect(searchToJson('abc')).toEqual({ '': 'abc' });
  });
});

describe('getFullURL 函数', () => {
  test('getFullURL ', () => {
    expect(getFullURL()).toBe('http://localhost/');
  });
});

// describe("getCmsCdnHost 函数", () => {
//   test("getCmsCdnHost ", () => {
//     expect(getCmsCdnHost()).toBe("https://assets.staticimg.com/cms-static");
//   });
// });

describe('getCmsCdnHost', () => {
  let originalWindow;

  beforeAll(() => {
    originalWindow = global.window;
  });

  afterAll(() => {
    global.window = originalWindow;
  });

  it('should return the test environment URL when running in a dev or QA environment', () => {
    global.window = {
      location: {
        origin: 'http://localhost:3000',
      },
    };
    expect(getCmsCdnHost()).toEqual('https://assets.staticimg.com/cms-static');

    global.window = {
      location: {
        origin: 'https://example.net',
      },
    };
    expect(getCmsCdnHost()).toEqual('https://assets.staticimg.com/cms-static');
  });

  it('should return the production environment URL when running in a production environment or not in a window context', () => {
    global.window = undefined;
    expect(getCmsCdnHost()).toEqual('https://assets.staticimg.com/cms-static');

    global.window = {
      location: {
        origin: 'https://www.kucoin.com',
      },
    };
    expect(getCmsCdnHost()).toEqual('https://assets.staticimg.com/cms-static');
  });
});

describe('getCurrentTime 函数', () => {
  test('getCurrentTime', () => {
    const time = moment().valueOf();

    expect(
      getCurrentTime({
        serverTime: time,
        requestedLocalTime: time,
      }),
    ).toBeLessThan(time + 1000);
  });
});

describe('convertMaintenanceJSON 函数', () => {
  test('convertMaintenanceJSON 无参数', () => {
    expect(convertMaintenanceJSON()).toEqual({});
  });

  test('convertMaintenanceJSON zh_CN ', () => {
    expect(
      convertMaintenanceJSON({
        titleList: { zh_CN: 'abc' },
        linkUrlList: { zh_CN: 'edf' },
        linkTextList: { zh_CN: 'asdf' },
      }),
    ).toEqual({ title: 'abc', link: 'edf', redirectContent: 'asdf' });
  });
});

describe('transferNumDisplayByLang', () => {
  it('should return undefined if the input number is invalid', () => {
    expect(transferNumDisplayByLang('zh_CN', 'test')).toBeUndefined();
    expect(transferNumDisplayByLang('zh_CN', -1)).toBeUndefined();
    expect(transferNumDisplayByLang('zh_CN', 1.5)).toBeUndefined();
  });

  it('should return correct display type for different languages and numbers', () => {
    // Arabic
    expect(transferNumDisplayByLang('ar_AE', 0)).toEqual('firstType');
    expect(transferNumDisplayByLang('ar_AE', 1)).toEqual('firstType');
    expect(transferNumDisplayByLang('ar_AE', 2)).toEqual('secondType');
    expect(transferNumDisplayByLang('ar_AE', 3)).toEqual('thirdType');
    expect(transferNumDisplayByLang('ar_AE', 10)).toEqual('thirdType');

    // Russian
    expect(transferNumDisplayByLang('ru_RU', 0)).toEqual('thirdType');
    expect(transferNumDisplayByLang('ru_RU', 1)).toEqual('firstType');
    expect(transferNumDisplayByLang('ru_RU', 2)).toEqual('secondType');
    expect(transferNumDisplayByLang('ru_RU', 3)).toEqual('secondType');
    expect(transferNumDisplayByLang('ru_RU', 4)).toEqual('secondType');
    expect(transferNumDisplayByLang('ru_RU', 5)).toEqual('thirdType');
    expect(transferNumDisplayByLang('ru_RU', 10)).toEqual('thirdType');

    // Polish
    expect(transferNumDisplayByLang('pl_PL', 0)).toEqual('thirdType');
    expect(transferNumDisplayByLang('pl_PL', 1)).toEqual('firstType');
    expect(transferNumDisplayByLang('pl_PL', 2)).toEqual('secondType');
    expect(transferNumDisplayByLang('pl_PL', 3)).toEqual('secondType');
    expect(transferNumDisplayByLang('pl_PL', 4)).toEqual('secondType');
    expect(transferNumDisplayByLang('pl_PL', 5)).toEqual('thirdType');
    expect(transferNumDisplayByLang('pl_PL', 10)).toEqual('thirdType');

    // Chinese
    expect(transferNumDisplayByLang('zh_CN', 0)).toEqual('other');
    expect(transferNumDisplayByLang('zh_CN', 1)).toEqual('other');
    expect(transferNumDisplayByLang('zh_CN', 2)).toEqual('other');
    expect(transferNumDisplayByLang('zh_CN', 10)).toEqual('other');

    // Japanese
    expect(transferNumDisplayByLang('ja_JP', 0)).toEqual('other');
    expect(transferNumDisplayByLang('ja_JP', 1)).toEqual('other');
  });
});

// global.FormData = class FormData {
//   constructor() {
//     this.data = {}
//   }
//   append(key, value) {
//     this.data[key] = value
//   }
//   on() {}
// }

// describe("formlize", () => {
//   test("returns the FormData object if passed as argument", () => {
//     const formData = new FormData();
//     expect(formlize(formData)).toBeInstanceOf(FormData);
//   });

//   test("returns a new FormData object with key-value pairs from the passed object", () => {
//     const obj = {
//       name: "John",
//       age: 30,
//       file: new File([], "test.txt"),
//     };
//     const form = formlize(obj);
//     expect(form.get("name")).toBe("John");
//     expect(form.get("age")).toBe("30");
//     expect(form.get("file")).toBeInstanceOf(File);
//   });

//   test("does not append undefined or null values", () => {
//     const obj = {
//       name: "John",
//       age: null,
//       email: undefined,
//     };
//     const form = formlize(obj);
//     expect(form.has("age")).toBe(false);
//     expect(form.has("email")).toBe(false);
//     expect(form.has("name")).toBe(true);
//   });

//   test("returns an empty FormData object if passed an empty object", () => {
//     const obj = {};
//     const form = formlize(obj);
//     expect(form).toEqual(new FormData());
//   });
// });

describe('getBase64', () => {
  const testFile = new File(['Hello, World!'], 'test.txt', {
    type: 'text/plain',
  });

  it('should resolve with base64 string', async () => {
    const base64Str = await getBase64(testFile);
    expect(base64Str.startsWith('data:text/plain;base64,')).toBe(true);
  });
});

describe('cryptoPwd', () => {
  it('should encrypt the password correctly', () => {
    const result = cryptoPwd('password123');
    expect(result).toEqual('66e08e35fe307883d36bc981373f5f72');
  });

  it('should handle empty string', () => {
    const result = cryptoPwd('');
    expect(result).toEqual('7cb743c21177f100d0bc24bc1f5bddf9');
  });
});

describe('blockScroll', () => {
  it('should prevent scrolling when scrolling to top of container', () => {
    const target = {
      scrollTop: 0,
      scrollHeight: 500,
      clientHeight: 300,
    };
    const event = {
      nativeEvent: {
        wheelDelta: 120,
      },
      preventDefault: jest.fn(),
    };
    blockScroll(target, event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prevent scrolling when scrolling to bottom of container', () => {
    const target = {
      scrollTop: 200,
      scrollHeight: 500,
      clientHeight: 300,
    };
    const event = {
      nativeEvent: {
        wheelDelta: -120,
      },
      preventDefault: jest.fn(),
    };
    blockScroll(target, event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent scrolling when scrolling inside container', () => {
    const target = {
      scrollTop: 200,
      scrollHeight: 500,
      clientHeight: 300,
    };
    const event = {
      nativeEvent: {
        wheelDelta: 120,
      },
      preventDefault: jest.fn(),
    };
    blockScroll(target, event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should handle scrolling when delta is undefined', () => {
    const target = {
      scrollTop: 0,
      scrollHeight: 500,
      clientHeight: 300,
    };
    const event = {
      nativeEvent: {
        detail: 120,
      },
      preventDefault: jest.fn(),
    };
    blockScroll(target, event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});

describe('transformParam function', () => {
  test('should return 0 when input is null', () => {
    const input = null;
    const output = transformParam(input);
    expect(output.toString()).toBe(new Decimal(0).toString());
  });

  test('should return 0 when input is undefined', () => {
    const input = undefined;
    const output = transformParam(input);
    expect(output.toString()).toBe(new Decimal(0).toString());
  });

  test('should return same Decimal when input is a Decimal', () => {
    const input = new Decimal(5);
    const output = transformParam(input);
    expect(output.toString()).toBe(input.toString());
  });

  test('should return Decimal when input is a number', () => {
    const input = 10;
    const output = transformParam(input);
    expect(output.toString()).toBe(new Decimal(input).toString());
  });

  test('should return NaN when input is a non-numeric string', () => {
    const input = 'abc';
    const output = transformParam(input);
    expect(output.isNaN()).toBeTruthy();
  });
});

describe('toNonExponential function', () => {
  test('should return same value when input is a non-exponential number', () => {
    const input = new Decimal(5);
    const output = toNonExponential(input);
    expect(output).toBe(input.toString());
  });

  test('should return non-exponential value when input is an exponential number', () => {
    const input = new Decimal(1e20);
    const output = toNonExponential(input);
    expect(output).toBe(input.toFixed());
  });

  test('should return same value when input is a non-exponential string', () => {
    const input = 'abc';
    const output = toNonExponential(input);
    expect(output).toBe(input);
  });

  test('should return non-exponential value when input is an exponential string', () => {
    const input = '1e+20';
    const output = toNonExponential(input);
    expect(output).toBe(transformParam(input).toFixed());
  });
});

describe('test helper other function', () => {
  it.each([
    {
      value: '1e-6',
      expected: 6,
    },
    {
      value: 1e-6,
      expected: 6,
    },
    {
      value: '1232,345.22',
      expected: undefined,
    },
    {
      value: -0.01,
      expected: 2,
    },
    {
      value: '0.24s',
      expected: undefined,
    },
    {
      value: '100',
      isMultiplier: true,
      expected: 0,
    },
  ])('测试 getDigit 方法，参数为 %j', ({ value, isMultiplier, expected }) => {
    expect(getDigit(value, isMultiplier)).toBe(expected);
  });
  it.each([
    {
      point: 0.1224,
      precision: 1,
      dropZero: false,
      expected: '12.2%',
    },
    {
      point: 0.1225,
      precision: 1,
      dropZero: true,
      expected: '12.3%',
    },
    {
      point: 0,
      precision: 3,
      dropZero: false,
      expected: '0%',
    },
    {
      point: 0.12,
      precision: 3,
      dropZero: false,
      isShowPlusDir: true,
      expected: '+12%',
    },
    {
      point: -0.12,
      precision: 3,
      dropZero: false,
      isShowPlusDir: true,
      expected: '-12%',
    },
    {
      point: 0,
      precision: 3,
      dropZero: false,
      isShowPlusDir: true,
      expected: '0%',
    },
    {
      point: -0.12,
      precision: 3,
      dropZero: false,
      isShowPlusDir: true,
      expected: '-%12',
      mockDir: true,
    },
    {
      point: 0.12,
      precision: 3,
      dropZero: false,
      isShowPlusDir: true,
      notRtl: true,
      expected: '+12%',
    },
  ])(
    '测试 toPercent 方法，参数为 %j',
    ({ point, precision, dropZero, round, isShowPlusDir, notRtl, mockDir, expected }) => {
      if (mockDir) {
        isRTL.mockReturnValueOnce(true);
      }
      const result = toPercent(point, precision, dropZero, round, isShowPlusDir, notRtl);
      expect(result).toBe(expected);
    },
  );
  it.each([
    {
      value: 12.04,
      step: 0.1,
      expected: 12,
    },
    {
      value: '12.99',
      step: 0.1,
      expected: 12.9,
    },
    {
      value: '12.99',
      step: 1,
      expected: 12,
    },
    {
      value: '12.99',
      step: 0,
      expected: NaN,
    },
  ])('测试 roundDownByStep 方法参数为 %j', ({ value, step, expected }) => {
    const result = roundDownByStep(value, step);
    expect(Number(result)).toBe(expected);
  });
  it.each([
    {
      value: 12.04,
      step: 0.1,
      expected: 12.1,
    },
    {
      value: '12.99',
      step: 0.1,
      expected: 13,
    },
    {
      value: '12.02',
      step: 1,
      expected: 13,
    },
    {
      value: '12.99',
      step: 0,
      expected: NaN,
    },
  ])('测试 roundUpByStep 方法参数为 %j', ({ value, step, expected }) => {
    const result = roundUpByStep(value, step);
    expect(Number(result)).toBe(expected);
  });
  it.each([
    {
      timestamp: 1671179109466,
      format: 'YYYY/MM/DD HH:mm:ss',
      expected: '2022/12/16 16:25:09',
    },
    {
      timestamp: 1671180,
      format: 'YYYY/MM/DD',
      isNs: true,
      expected: '1970/01/01',
    },
    {
      timestamp: '1671179109466000000',
      format: 'YYYY/MM/DD',
      isNs: true,
      expected: '2022/12/16',
    },
  ])('测试 formatDateTime 方法，传参为 %j', ({ timestamp, format, isNs }) => {
    const handleTimestamp = isNs ? Decimal(timestamp).mul(1e-6).toFixed(0) : timestamp;
    const expectedValue = moment(_.toNumber(handleTimestamp)).format(format);
    const result = formatDateTime(timestamp, format, isNs);
    expect(result).toBe(expectedValue);
  });
  it.each([
    {
      len: 3,
      radix: 1,
      expected: 3,
    },
    {
      len: 2,
      radix: 1,
      expected: 2,
    },
    {
      len: 0,
      radix: 1,
      expected: 36,
    },
  ])('测试 guid 方法, 参数为 %j', ({ len, radix, expected }) => {
    expect(guid(len, radix).length).toBe(expected);
  });

  const mockSymbolArr = [
    { symbolCode: 'BTC-USDT', enableTrading: false, isAuctionEnabled: true },
    { symbolCode: 'ETH-USDT', enableTrading: false, isAuctionEnabled: true },
  ];

  it('filterAndCheckSymbolArray', () => {
    const { filteredArray, symbolExists } = filterAndCheckSymbolArray(mockSymbolArr, 'BTC-USDT');
    expect(filteredArray.length).toBe(2);
    expect(symbolExists).toBe(true);
  });

  it.each([
    {
      num: 3,
      pre: undefined,
      opts: { fixZero: true, fixLength: 4 },
      expected: '3.0000',
    },
    {
      num: undefined,
      pre: undefined,
      opts: { fixZero: true, fixLength: 2 },
      expected: undefined,
    },
    {
      num: 2,
      pre: undefined,
      opts: undefined,
      expected: '2.00',
    },
    {
      num: 0,
      pre: undefined,
      opts: undefined,
      expected: '0.00',
    },
    {
      num: 2,
      pre: undefined,
      opts: undefined,
      expected: '2.00',
    },
  ])('测试 setNumToPrecision %j', ({ num, pre, opts, expected }) => {
    expect(setNumToPrecision(num, pre, opts)).toBe(expected);
  });

  it.each([
    {
      str: 'kkk',
      expected: 'kkk',
    },
    {
      str: '2.000',
      expected: '2',
    },
  ])('测试 dropZeroSafe %j', ({ str, expected }) => {
    expect(dropZeroSafe(str)).toBe(expected);
  });

  it.each([
    {
      date: 1707186886896,
      format: 'YYYY-MM-DD HH:mm:ss',
      timeZone: '-8',
      expected: '02/05/2024 18:34:46',
    },
  ])('测试 moment2Intl %j', ({ date, format, timeZone, expected }) => {
    expect(moment2Intl({ date, format, timeZone })).toBe(expected);
  });

  it.each([
    {
      timestamp: 1707186886896,
      expected: '02/06/2024 10:34:46',
    },
  ])('测试 showDatetime %j', ({ timestamp, expected }) => {
    expect(typeof showDatetime(timestamp)).toBe('string');
  });

  it.each(new Array(25).fill().map((__, index) => {
    const zone = index - 12;
    const prefix = `${zone}`.length < 2 ? '0' : '';
    return {
      zone,
      ts: 1712016000000, // 2024/04/02 00:00:00(UTC)
      format: 'YYYY/MM/DD HH:mm:ss',
      expected: zone >= 0 ? `04/02/2024 ${prefix}${zone}:00:00` : `04/01/2024 ${24 + zone}:00:00`,
    };
  }))('测试 showDateTimeByZone %j', ({ ts, format, zone, expected }) => {
    expect(showDateTimeByZone(ts, format, zone)).toBe(expected);
  });

  it.each([
    {
      ts: 1707186886896,
      format: 'YYYY-MM-DD HH:mm:ss',
      zone: -8,
      expected: '02/06/2024 00:00:00',
      type: 'string',
    },
  ])('测试 zoneTime2LocalTime %j', ({ ts, format, zone, type }) => {
    expect(typeof zoneTime2LocalTime({ ts, format, zone })).toBe(type);
  });

  const DateNow = Date.now();
  it.each([
    {
      date: DateNow,
      expected: DateNow,
    },
    {
      date: 'asd',
      expected: null,
    },
  ])('测试 timestamp %j', ({ date, expected }) => {
    expect(timestamp(date)).toBe(expected);
  });

  test('toDateTs', () => {
    expect(typeof toDateTs(1707188611802)).toBe('number');
  });

  test('formlize', () => {
    const form = formlize({ a: 1 });
    // 简单写了下，带优化
    expect(form._valueLength).toBe(1);
  });

  test('getTimezone', () => {
    expect(typeof getTimezone()).toBe('string');
  });
});

describe('event no window event', () => {
  const eMap = {};
  const target = {
    removeEventListener: jest.fn(),
    attachEvent: jest.fn(),
    detachEvent: jest.fn(),
    dispatchEvent: jest.fn(),
    fireEvent: jest.fn(),
    addEventListener: jest.fn(),
  };
  const handle = jest.fn();
  test('Event', () => {
    Event.addHandler(target, 'click', handle);
    expect(target.addEventListener).toBeCalled();
    Event.triggerEvent(target, 'click');
    expect(target.dispatchEvent).toBeCalled();
    Event.removeHandler(target, 'click', handle);
    expect(target.removeEventListener).toBeCalled();
  });
});

describe('test launchFullScreen function', ()=>{
  const spyFunc = jest.fn();
  const testFunc = { msRequestFullscreen: spyFunc };
  launchFullScreen(testFunc);
})

describe('test exitFullscreen function', ()=>{
  const spyFunc = jest.fn();
  Object.defineProperty(document, 'msExitFullscreen', { value: spyFunc });
  exitFullscreen();
})