/**
 * Owner: willen@kupotech.com
 */

import moment from 'moment';
import {
  add,
  blockScroll,
  captureException,
  checkUrlIsSafe,
  contrastTime,
  cryptoPwd,
  divide,
  dropZeroNew,
  Event,
  filterChainInfo,
  fixWithZero,
  floadToPercent,
  formatCountdown,
  formatNumberByStep,
  formatStr,
  generateUuid,
  genWalletTxUrl,
  getArrayPage,
  getDomVisible,
  getFileType,
  getFirstBrowserLanguage,
  getFormatCode,
  getFullURL,
  getNetworkType,
  getPathAuth,
  getPrecisionFromIncrement,
  getRandomItem,
  getReplaceCode,
  getScrollTop,
  getTimeData,
  getURL,
  getUserAgentInfo,
  isArrEqual,
  isOpenInWechat,
  jsonToUrlParams,
  mapToArray,
  min,
  mvArrayValue,
  normalizeNumber,
  orderSort,
  padString,
  readableNumber,
  removeSeparator,
  removeSpaceSE,
  replaceSearch,
  reportCoinLost,
  scrollToAnchor,
  showDateTimeByZone,
  sleep,
  sub,
  timestamp,
  toPercent,
  toUTC8,
  transformParam,
  transStepToPrecision,
  underlinedNumberVal,
  underlinedVal,
  viewPortMeta,
} from 'src/helper';

const now = moment();
const nowTs = now.valueOf();

describe('test helper', () => {
  test('test captureException', () => {
    expect(captureException()).resolves.toBe();
  });

  // useless
  test('test reportCoinLost', () => {
    expect(reportCoinLost()).toBe();
  });

  test('test getPrecisionFromIncrement', () => {
    expect(getPrecisionFromIncrement()).toBe(8);
    expect(getPrecisionFromIncrement(1)).toBe(0);
    expect(getPrecisionFromIncrement('0.0001')).toBe(4);
  });

  // useless
  test('test getFileType', () => {
    expect(getFileType()).toBe('');
    expect(getFileType('asd.txt')).toBe('.txt');
  });

  // useless
  test('test showDateTimeByZone', () => {
    expect(showDateTimeByZone(nowTs)).toEqual(now.utcOffset(8).format('YYYY/MM/DD HH:mm:ss'));
  });

  // useless
  test('test timestamp', () => {
    expect(timestamp(nowTs)).toEqual(nowTs);
    expect(timestamp('asd')).toBe(null);
  });

  test('test readableNumber', () => {
    expect(readableNumber(NaN)).toBe(NaN);
    expect(readableNumber(12345)).toBe('12,345');
    expect(readableNumber(12345678)).toBe('12,345,678.00');
  });

  // useless
  test('test mapToArray', () => {
    expect(mapToArray({ 1: 123, 2: 345 })).toEqual([123, 345]);
  });

  // useless
  test('test getPathAuth', () => {
    let err;
    try {
      getPathAuth(123);
    } catch (error) {
      err = error;
    }
    expect(err instanceof TypeError).toBe(true);
    expect(getPathAuth('/user/login')).toBe('LOGIN');
    expect(getPathAuth('/unbind-g2fa/login')).toBe('LOGIN');
    expect(getPathAuth('/convert')).toBe(null);
  });

  // useless
  test('test getScrollTop', () => {
    expect(getScrollTop()).toBe(0);
  });

  // useless
  test('test genWalletTxUrl', () => {
    expect(genWalletTxUrl('NEO', undefined)).toBe(null);
    expect(genWalletTxUrl('NEO', '0x12345{txId}', '0xaaa')).toBe('0x12345aaa');
    expect(genWalletTxUrl('ETH', '0x12345{txId}', 'abc')).toBe('0x12345abc');
  });

  // useless
  test('test dropZeroNew', () => {
    expect(dropZeroNew(null)).toBe(0);
    expect(dropZeroNew('123.456000')).toBe('123.456');
  });

  // useless
  test('test sub', () => {
    expect(sub('123.123', '100').valueOf()).toEqual('23.123');
  });

  // useless
  test('test formatNumberByStep', () => {
    expect(formatNumberByStep('aaa')).toBe('aaa');
    expect(formatNumberByStep(1234567.123, 3)).toBe('1234566');
  });

  // useless
  test('test fixWithZero', () => {
    expect(fixWithZero('123', 2)).toBe('NaN');
  });

  test('test divide', () => {
    expect(divide('123')).toBe(0);
    expect(divide('123', '0')).toBe(0);
    expect(divide('123', 1)).toBe('123.00000000');
  });

  test('test divide', () => {
    expect(divide('123')).toBe(0);
    expect(divide('123', '0')).toBe(0);
    expect(divide('123', 1)).toBe('123.00000000');
  });

  test('test add', () => {
    expect(add('123', '321').valueOf()).toBe('444');
  });

  test('test toPercent', () => {
    expect(toPercent('0.123')).toBe('12.3%');
  });

  // useless
  test('test formatStr', () => {
    expect(formatStr('12345678', 4)).toBe('123456...');
  });

  // useless
  test('test transformParam', () => {
    expect(transformParam().valueOf()).toBe('0');
    expect(transformParam(123).valueOf()).toBe('123');
  });

  // useless
  test('test min', () => {
    expect(min(1, 2, 3, 4, 5).valueOf()).toBe('1');
  });

  // useless
  test('test getTimeData', () => {
    expect(getTimeData(0)).toEqual([0, 0, 0, 0]);
    expect(getTimeData(123456789)).toEqual([1428, '21', '33', '09']);
  });

  // useless
  test('test orderSort', () => {
    const sorter = (a, b) => a - b;
    expect(orderSort([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
    expect(orderSort([6, 5, 4, 3, 2, 1], sorter)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(orderSort([4, 1, 2, 3, 4, 5, 6], sorter)).toEqual([1, 2, 3, 4, 4, 5, 6]);
  });

  // useless
  test('test getFirstBrowserLanguage', () => {
    expect(getFirstBrowserLanguage()).toBe('en-US');
  });

  // useless
  test('test getURL', () => {
    expect(getURL()).toBe('/');
  });

  // useless
  test('test getRandomItem', () => {
    expect(getRandomItem()).toBe(null);
    expect(getRandomItem([1])).toBe(1);
  });

  test('test isOpenInWechat', () => {
    expect(isOpenInWechat()).toBe(null);
    expect(isOpenInWechat('MicroMessenger.asdasd')).toBe(false);
  });

  // useless
  test('test mvArrayValue', () => {
    expect(mvArrayValue([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 4, 5, 3]);
    expect(mvArrayValue([1, 2, 3, 4, 5], 3, true)).toEqual([3, 1, 2, 4, 5]);
  });

  // useless
  test('test getArrayPage', () => {
    expect(getArrayPage(1, 1, [1, 2, 3, 4, 5])).toEqual([1]);
    expect(getArrayPage(1, 10, [1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  test('test scrollToAnchor', () => {
    expect(scrollToAnchor('aaa')).toBe();
  });

  // useless
  test('test viewPortMeta', () => {
    expect(viewPortMeta()).toBe();
    expect(viewPortMeta(1)).toBe();
  });

  // useless
  test('test padString', () => {
    expect(padString()).toBe('');
    expect(padString('123456')).toBe('******');
  });

  // useless
  test('test blockScroll', () => {
    const target = { scrollTop: 100, scrollHeight: 100, clientHeight: 0 };
    const returnEvent = (wheelDelta) => ({ nativeEvent: { wheelDelta }, preventDefault: () => {} });
    expect(blockScroll(target, returnEvent(200))).toBe();
    expect(blockScroll(target, returnEvent(-200))).toBe();
    expect(blockScroll(target, returnEvent())).toBe();
  });

  // useless
  test('test replaceSearch', () => {
    expect(replaceSearch('https://www.baidu.com?q=123123', 'q', '321321')).toBe(
      'https://www.baidu.com?q=321321',
    );
  });

  test('Event', () => {
    const el = document.createElement('div');
    const handler = jest.fn();
    Event.addHandler(el, 'click', handler);
    Event.triggerEvent(el, 'click');
    expect(handler).toHaveBeenCalledTimes(1);
    Event.removeHandler(el, 'click', handler);
    Event.triggerEvent(el, 'click');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('test cryptoPwd', () => {
    expect(cryptoPwd('123456')).toBe('b5d58119105bf057f864f0485aa7ffd0');
  });

  // useless
  test('test toUTC8', () => {
    expect(toUTC8(1676268636571)).toBe('2023-02-13 14:10:36');
  });

  // useless
  test('test formatCountdown', () => {
    expect(formatCountdown(12345)).toBe('00:00:12');
  });

  // useless
  describe('contrastTime', () => {
    it('should return 0 if target time is before current time', () => {
      const target = '2020/09/13 15:00:00';
      const result = contrastTime(target);
      expect(result).toBe(0);
    });

    it('should return a positive number if target time is after current time', () => {
      const target = moment().add(1, 'hour').format('YYYY/MM/DD HH:mm:ss');
      const result = contrastTime(target);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  // test('test getBase64', () => {
  //   expect(getBase64()).resolves.toBe({});
  // });

  test('test transStepToPrecision', () => {
    expect(transStepToPrecision(123)).toBe(0);
    expect(transStepToPrecision(0.0001)).toBe(4);
    expect(transStepToPrecision(0)).toBe(0);
  });

  test('test sleep', async () => {
    const start = new Date().getTime();
    const res = await sleep();
    const end = new Date().getTime();
    expect(end - start >= 900).toEqual(true);
    expect(res).toBe();
  });

  test('test floadToPercent', () => {
    expect(floadToPercent('asd')).toBe('asd');
    expect(floadToPercent('0.123')).toBe('12.3 %');
  });

  test('test removeSpaceSE', () => {
    expect(removeSpaceSE()).toBe('');
    expect(removeSpaceSE('   asd  ')).toBe('asd');
  });

  test('test removeSeparator', () => {
    expect(removeSeparator('KCS/BTC')).toBe('KCSBTC');
    expect(removeSeparator()).toBe();
  });

  test('test getFullURL', () => {
    expect(getFullURL()).toBe('http://localhost/');
    expect(getFullURL('aaa')).toBe('http://localhostaaa');
  });

  test('test checkUrlIsSafe', () => {
    expect(checkUrlIsSafe()).toBe(false);
    expect(checkUrlIsSafe('https://www.kucoin.com/')).toBe(true);
    expect(checkUrlIsSafe('javascript://www.kucoin.com/')).toBe(false);
  });

  // useless
  test('test filterChainInfo', () => {
    const chainInfo = [
      { isChainEnabled: 'true', address: '0x123' },
      { isChainEnabled: 'false', address: '0x456' },
    ];
    expect(filterChainInfo(chainInfo)).toEqual([{ address: '0x123', isChainEnabled: 'true' }]);
  });

  // useless
  test('test generateUuid', () => {
    expect(generateUuid()).not.toBe();
  });

  // useless
  test('test getFormatCode', () => {
    expect(getFormatCode('das asd')).toBe('das&nbsp;asd');
  });

  // useless
  test('test getReplaceCode', () => {
    expect(getReplaceCode('das asd', 'd')).toBe('das asd');
  });

  // useless
  test('test getDomVisible', () => {
    expect(getDomVisible()).toBe(false);
  });

  // useless
  test('test underlinedVal', () => {
    expect(underlinedVal()).toBe('-');
    expect(underlinedVal(123)).toBe(123);
  });

  // useless
  test('test underlinedNumberVal', () => {
    expect(underlinedNumberVal()).toBe('-');
    expect(underlinedNumberVal('asd')).toBe('asd');
    expect(underlinedNumberVal('123')).toBe('123.00');
  });

  describe('test getNetworkType', () => {
    let tmp;
    beforeAll(() => {
      tmp = navigator.userAgent;
    });

    test('test getNetworkType', () => {
      expect(getNetworkType()).toBe('other');
    });

    describe.each([
      ['NetType/wifi', 'wifi'],
      ['NetType/5g', '5g'],
      ['NetType/4g', '4g'],
      ['NetType/3g', '3g'],
      ['NetType/3gnet', '3g'],
      ['NetType/2g', '2g'],
    ])('test getNetworkType', (a, expected) => {
      beforeEach(() => {
        navigator.__defineGetter__('userAgent', function () {
          return a;
        });
      });

      test('test getNetworkType', () => {
        expect(getNetworkType()).toBe(expected);
      });
    });

    afterAll(() => {
      navigator.__defineGetter__('userAgent', function () {
        return tmp;
      });
    });
  });

  describe('test getUserAgentInfo', () => {
    // Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0
    let tmp;
    beforeAll(() => {
      tmp = navigator.userAgent;
    });

    const wins = [
      [
        'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) chrome/14.1.0 safari/14.1.0',
        {
          browser: 'Chrome 14',
          browserType: 'Chrome',
          browserVersion: 14,
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Unknown',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 5.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) safari/14.1.0',
        {
          browser: 'Safari 14',
          browserType: 'Safari',
          browserVersion: 14,
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows 2000',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 5.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) firefox/14.1.0',
        {
          browser: 'Firefox 14',
          browserType: 'Firefox',
          browserVersion: 14,
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows XP',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) opera/14.1.0',
        {
          browser: 'Opera 14',
          browserType: 'Opera',
          browserVersion: 14,
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows Vista',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows 7',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) edge/14.1.0',
        {
          browser: 'Edge 14',
          browserType: 'Edge',
          browserVersion: 14,
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows 8',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) qqbrowser/14.1.0',
        {
          browser: 'QQBrowser 14',
          browserType: 'QQBrowser',
          browserVersion: 14,
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows 8.1',
        },
      ],
      [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Windows',
          systemVersion: 'Windows 10',
        },
      ],
    ];

    describe.each([
      ...wins,
      [
        'Mozilla/5.0 (iphone) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'iPhone',
          systemVersion: 'ios',
        },
      ],
      [
        'Mozilla/5.0 (Ipad) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'iPad',
          systemVersion: 'ios',
        },
      ],
      [
        'MacIntel',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Mac',
          systemVersion: 'macOS',
        },
      ],
      [
        'Mozilla/5.0 (bsd) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Unix',
          systemVersion: 'Unix',
        },
      ],
      [
        'Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Linux',
          systemVersion: 'Linux',
        },
      ],
      [
        'Mozilla/5.0 (linux; android) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Android',
          systemVersion: 'Android',
        },
      ],
      [
        '',
        {
          browser: 'Unknown Unknown',
          browserType: 'Unknown',
          browserVersion: 'Unknown',
          networkType: 'other',
          systemName: 'Unknown',
          systemVersion: 'Unknown',
        },
      ],
    ])('test getUserAgentInfo', (a, expected) => {
      beforeEach(() => {
        navigator.__defineGetter__('userAgent', function () {
          return a;
        });
      });

      test('test getUserAgentInfo', () => {
        expect(getUserAgentInfo()).toEqual(expected);
      });
    });

    afterAll(() => {
      navigator.__defineGetter__('userAgent', function () {
        return tmp;
      });
    });
  });

  test('test jsonToUrlParams', () => {
    expect(jsonToUrlParams({ a: 123, b: 123 })).toBe('a=123&b=123');
    expect(jsonToUrlParams({ a: 123, b: null })).toBe('a=123&b=');
  });

  test('test isArrEqual', () => {
    expect(isArrEqual([123], [123])).toBe(true);
  });

  test('test normalizeNumber', () => {
    expect(normalizeNumber(1, 1)).toBe('1');
  });
});
