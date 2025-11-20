/**
 * Owner: willen@kupotech.com
 */

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
  getAuthPayload,
  getDomVisible,
  getFileType,
  getFirstBrowserLanguage,
  getFormatCode,
  getNetworkType,
  getPathAuth,
  getPrecisionFromIncrement,
  getRandomItem,
  getReplaceCode,
  getScrollTop,
  getTimeData,
  getURL,
  getUserAgentInfo,
  isOpenInWechat,
  mapToArray,
  min,
  mvArrayValue,
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
  showDatetime,
  showDateTimeByZoneZero,
  showDateTimeByZoneEight,
  formlize,
  separateNumber,
  dropZero,
  formatNumber,
  subAndFixed,
  normalizeNumber,
  multiply,
  multiplyFloor,
  max,
  concatPath,
  groupByEnableStatus,
  judgeChrome,
  isEmpty,
  setNumToPrecision,
  formatCoinCurrency,
  isIOS,
  getTransTimer,
  getQueryVariable,
  trimObjByKeys,
  compareVersion,
  isEmptyOrNil,
  isUndef,
  numSeparateDecimal,
  getPrecision,
} from 'helper';
import moment from 'moment';
import FormData from 'form-data';
import _ from 'lodash';

describe('test helper', () => {
  let now;
  let nowTs;
  beforeAll(() => {
    // Mock current time to a specific value
    now = moment('2024-05-30T12:00:00Z'); // Mock current time as May 30, 2024 12:00:00 UTC
    nowTs = now.valueOf();
    jest.spyOn(moment, 'now').mockImplementation(() => nowTs);
  });

  afterAll(() => {
    // Restore original implementation after all tests
    jest.restoreAllMocks();
  });
  // useless
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

  test('test showDatetime', () => {
    expect(showDatetime(nowTs)).toEqual(now.format('YYYY/MM/DD HH:mm:ss'));
  });

  test('test showDateTimeByZone', () => {
    expect(showDateTimeByZone(nowTs)).toEqual(now.utcOffset(8).format('YYYY/MM/DD HH:mm:ss'));
  });

  test('test showDateTimeByZoneZero', () => {
    expect(showDateTimeByZoneZero()).toEqual('--');
    expect(showDateTimeByZoneZero(nowTs)).toEqual(now.utcOffset(0).format('YYYY/MM/DD HH:mm:ss'));
  });

  test('test showDateTimeByZoneEight', () => {
    expect(showDateTimeByZoneEight()).toEqual('--');
    expect(showDateTimeByZoneEight(nowTs)).toEqual(now.utcOffset(8).format('YYYY/MM/DD HH:mm:ss'));
  });

  test('test timestamp', () => {
    expect(timestamp(nowTs)).toEqual(nowTs);
    expect(timestamp('asd')).toBe(null);
  });

  test('test formlize', () => {
    const data = new FormData();
    expect(formlize(data)).toEqual(data);
    expect(formlize({ a: 123 })).not.toEqual();
  });

  test('test separateNumber', () => {
    expect(separateNumber('asd')).toEqual('asd');
    expect(separateNumber('1234567')).toEqual('1,234,567');
    expect(separateNumber('1234567')).toEqual('1,234,567');
    expect(separateNumber('1234.567')).toEqual('1,234.567');
    expect(separateNumber('123')).toEqual('123');
  });

  test('test readableNumber', () => {
    expect(readableNumber(NaN)).toBe(NaN);
    expect(readableNumber(12345)).toBe('12,345');
    expect(readableNumber(12345678)).toBe('12,345,678.00');
  });

  test('test mapToArray', () => {
    expect(mapToArray({ 1: 123, 2: 345 })).toEqual([123, 345]);
  });

  test('test getPathAuth', () => {
    let err;
    try {
      getPathAuth(123);
    } catch (error) {
      err = error;
    }

    expect(err.message).toBe('Expected argument 1 to be a string.');
    expect(getPathAuth('/user/login')).toBe('LOGIN');
    expect(getPathAuth('/unbind-g2fa/login')).toBe('LOGIN');
    expect(getPathAuth('/convert')).toBe(null);
  });

  test('test getScrollTop', () => {
    expect(getScrollTop()).toBe(0);
  });

  test('test dropZero', () => {
    expect(dropZero(null)).toBe('-');
    expect(dropZero('123.456000')).toBe('123.456');
  });

  test('test dropZeroNew', () => {
    expect(dropZeroNew(null)).toBe(0);
    expect(dropZeroNew('123.456000')).toBe('123.456');
  });

  describe('genWalletTxUrl', () => {
    it('should return null if txId or txUrl is not provided', () => {
      expect(genWalletTxUrl({})).toBeNull();
      expect(genWalletTxUrl({ txId: '123' })).toBeNull();
      expect(genWalletTxUrl({ txUrl: 'http://example.com/{txId}' })).toBeNull();
    });
    it('should replace {txId} with address if isInvoiceChain is true', () => {
      const result = genWalletTxUrl({
        coinType: 'BTC',
        txUrl: 'http://example.com/{txId}',
        txId: '123',
        isInvoiceChain: true,
        address: 'abc',
      });
      expect(result).toBe('http://example.com/abc');
    });
    it('should replace {txId} with address if isInvoiceChain is true', () => {
      const result = genWalletTxUrl({
        coinType: 'NEO',
        txUrl: 'http://example1.com/{txId}',
        txId: '456',
        isInvoiceChain: true,
        address: 'abc',
      });
      expect(result).toBe('http://example1.com/abc');
    });
    it('should replace {txId} with txId for non-NEO, non-GAS, non-NEP coins', () => {
      const result = genWalletTxUrl({
        coinType: 'BTC',
        txUrl: 'http://example.com/{txId}',
        txId: '123',
      });
      expect(result).toBe('http://example.com/123');
    });
    it('should replace {txId} with txId without 0x for NEO, GAS, NEP coins', () => {
      const result = genWalletTxUrl({
        coinType: 'NEO',
        txUrl: 'http://example.com/{txId}',
        txId: '0x123',
      });
      expect(result).toBe('http://example.com/123');
    });
    it('should replace {txId} with txId without 0x for NEO, GAS, NEP coins', () => {
      const result = genWalletTxUrl({
        coinType: 'NEO',
        txUrl: 'http://example.com/{txId}',
        txId: '0x123',
        isInvoiceChain: true,
        address: 'abc',
      });
      expect(result).toBe('http://example.com/abc');
    });
  });

  test('test formatNumber', () => {
    expect(formatNumber()).toBe();
    expect(formatNumber(123.456, 2)).toBe('123.45');
  });

  test('test sub', () => {
    expect(sub('123.123', '100').valueOf()).toEqual('23.123');
  });

  test('test subAndFixed', () => {
    expect(subAndFixed('123.123', '100').valueOf()).toEqual('23.12300000');
  });

  test('test fixWithZero', () => {
    expect(fixWithZero('123', 2)).toBe('NaN');
  });

  test('test normalizeNumber', () => {
    expect(normalizeNumber('123.1234', 2)).toBe('123.12');
  });

  test('test multiply', () => {
    expect(multiply()).toBe(0);
    expect(multiply(123, '0')).toBe(0);
    expect(multiply(1234, 0.1)).toBe('123.40000000');
  });

  test('test multiplyFloor', () => {
    expect(multiplyFloor()).toBe(0);
    expect(multiplyFloor(123, '0')).toBe(0);
    expect(multiplyFloor(1234, 0.01)).toBe('12.34000000');
    expect(multiplyFloor(1234, 0.01, 1)).toBe('12.3');
  });

  test('test divide', () => {
    expect(divide('123')).toBe(0);
    expect(divide('123', '0')).toBe(0);
    expect(divide('123', 1)).toBe('123.00000000');
  });

  test('test add', () => {
    expect(add('123', '321').valueOf()).toBe('444');
  });

  test('test formatNumberByStep', () => {
    expect(formatNumberByStep('aaa')).toBe('aaa');
    expect(formatNumberByStep(1234567.123, 3)).toBe('1234566');
    expect(formatNumberByStep(1234567.123, 3, 'up')).toBe('1234569');
  });

  test('test toPercent', () => {
    expect(toPercent('0.123')).toBe('12.3%');
  });

  test('test formatStr', () => {
    expect(formatStr('12345678', 4)).toBe('123456...');
  });

  test('test transformParam', () => {
    expect(transformParam().valueOf()).toBe('0');
    expect(transformParam(123).valueOf()).toBe('123');
  });

  test('test min', () => {
    expect(min(1, 2, 3, 4, 5).valueOf()).toBe('1');
  });

  test('test min', () => {
    expect(max(1, 2, 3, 4, 5).valueOf()).toBe('5');
  });

  test('test getTimeData', () => {
    expect(getTimeData(0)).toEqual([0, 0, 0, 0]);
    expect(getTimeData(123456789)).toEqual([1428, '21', '33', '09']);
  });

  test('test orderSort', () => {
    const sorter = (a, b) => a - b;
    expect(orderSort([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
    expect(orderSort([6, 5, 4, 3, 2, 1], sorter)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(orderSort([4, 1, 2, 3, 4, 5, 6], sorter)).toEqual([1, 2, 3, 4, 4, 5, 6]);
  });

  test('test getFirstBrowserLanguage', () => {
    expect(getFirstBrowserLanguage()).toBe('en-US');
  });

  test('test getURL', () => {
    expect(getURL()).toBe('/');
  });

  test('test getRandomItem', () => {
    expect(getRandomItem()).toBe(null);
    expect(getRandomItem([1])).toBe(1);
  });

  test('test isOpenInWechat', () => {
    expect(isOpenInWechat()).toBe(null);
    expect(isOpenInWechat('MicroMessenger.asdasd')).toBe(false);
  });

  test('test mvArrayValue', () => {
    expect(mvArrayValue([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 4, 5, 3]);
    expect(mvArrayValue([1, 2, 3, 4, 5], 3, true)).toEqual([3, 1, 2, 4, 5]);
  });

  test('test getArrayPage', () => {
    expect(getArrayPage(1, 1, [1, 2, 3, 4, 5])).toEqual([1]);
    expect(getArrayPage(1, 10, [1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  test('test scrollToAnchor', () => {
    expect(scrollToAnchor('aaa')).toBe();
  });

  test('test viewPortMeta', () => {
    expect(viewPortMeta()).toBe();
    expect(viewPortMeta(1)).toBe();
  });

  test('test padString', () => {
    expect(padString()).toBe('');
    expect(padString('123456')).toBe('******');
  });

  test('test blockScroll', () => {
    const target = { scrollTop: 100, scrollHeight: 100, clientHeight: 0 };
    const returnEvent = (wheelDelta) => ({ nativeEvent: { wheelDelta }, preventDefault: () => {} });
    expect(blockScroll(target, returnEvent(200))).toBe();
    expect(blockScroll(target, returnEvent(-200))).toBe();
    expect(blockScroll(target, returnEvent())).toBe();
  });

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

  test('test toUTC8', () => {
    expect(toUTC8(1676268636571)).toBe('2023-02-13 14:10:36');
  });

  test('test formatCountdown', () => {
    expect(formatCountdown(12345)).toBe('00:00:12');
  });

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

  test('test concatPath', () => {
    expect(concatPath('https://www.kucoin.com', 'convert')).toBe('https://www.kucoin.com/convert');
    expect(concatPath('https://www.kucoin.com', '/convert')).toBe('https://www.kucoin.com/convert');
  });

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
    expect(floadToPercent('0.123')).toBe('12.3%');
  });

  test('test removeSpaceSE', () => {
    expect(removeSpaceSE()).toBe('');
    expect(removeSpaceSE('   asd  ')).toBe('asd');
  });

  test('test removeSeparator', () => {
    expect(removeSeparator('KCS/BTC')).toBe('KCSBTC');
    expect(removeSeparator()).toBe();
  });

  test('test checkUrlIsSafe', () => {
    expect(checkUrlIsSafe()).toBe(false);
    expect(checkUrlIsSafe('https://www.kucoin.com/')).toBe(true);
    expect(checkUrlIsSafe('javascript://www.kucoin.com/')).toBe(false);
  });

  test('test groupByEnableStatus', () => {
    const chainInfo = [
      { isChainEnabled: 'true', address: '0x123' },
      { isChainEnabled: 'false', address: '0x456' },
    ];
    expect(groupByEnableStatus()).toEqual([]);
    expect(groupByEnableStatus(chainInfo, 'isChainEnabled')).toEqual([
      { address: '0x123', isChainEnabled: 'true' },
      { address: '0x456', isChainEnabled: 'false' },
    ]);
  });

  test('test filterChainInfo', () => {
    const chainInfo = [
      { isChainEnabled: 'true', address: '0x123' },
      { isChainEnabled: 'false', address: '0x456' },
    ];
    expect(filterChainInfo(chainInfo)).toEqual([{ address: '0x123', isChainEnabled: 'true' }]);
  });

  test('test generateUuid', () => {
    expect(generateUuid()).not.toBe();
  });

  test('test getFormatCode', () => {
    expect(getFormatCode('das asd')).toBe('das&nbsp;asd');
  });

  test('test getReplaceCode', () => {
    expect(getReplaceCode('das asd', 'd')).toBe('das asd');
  });

  test('test getAuthPayload', () => {
    expect(getAuthPayload('app', 'asd')).toHaveProperty('appkey');
    expect(getAuthPayload('app', 'asd')).toHaveProperty('random_str');
    expect(getAuthPayload('app', 'asd')).toHaveProperty('signature');
    expect(getAuthPayload('app', 'asd')).toHaveProperty('timestamp');
  });

  test('test getDomVisible', () => {
    expect(getDomVisible()).toBe(false);
  });

  test('test underlinedVal', () => {
    expect(underlinedVal()).toBe('--');
    expect(underlinedVal(123)).toBe(123);
  });

  test('test underlinedNumberVal', () => {
    expect(underlinedNumberVal()).toBe('--');
    expect(underlinedNumberVal('asd')).toBe('asd');
    expect(underlinedNumberVal('123')).toBe('123.00');
  });

  describe('test judgeChrome', () => {
    describe('test judgeChrome', () => {
      test('test  judgeChrome', () => {
        //  Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/14.1.0
        expect(judgeChrome()).toBe(false);
      });
    });

    describe('test judgeChrome', () => {
      let tmp, mimeTypes;

      beforeAll(() => {
        tmp = navigator.userAgent;
        mimeTypes = _.cloneDeep(navigator.mimeTypes);
        navigator.__defineGetter__('userAgent', function () {
          return 'Mozilla/5.0 (iPhone) AppleWebKit/537.36 (KHTML, like Gecko) chrome/14.1.0 safari/14.1.0';
        });
        navigator.__defineGetter__('mimeTypes', function () {
          return [
            {
              type: 'application/sogou-native-widget-plugin',
            },
          ];
        });
      });

      test('test  judgeChrome', () => {
        expect(judgeChrome()).toBe(false);
      });

      afterAll(() => {
        navigator.__defineGetter__('userAgent', function () {
          return tmp;
        });

        navigator.__defineGetter__('mimeTypes', function () {
          return mimeTypes;
        });
      });
    });
  });

  test('test isEmpty', () => {
    expect(isEmpty('')).toBe(true);
  });

  test('test setNumToPrecision', () => {
    expect(setNumToPrecision()).toBe();
    expect(setNumToPrecision(1234.5678)).toBe('1234.5678');
    expect(setNumToPrecision(1234.5678, 2)).toBe('1234.56');
    expect(setNumToPrecision(1234.5678, 1)).toBe('1234.50');
    expect(setNumToPrecision(0)).toBe('0.00');
    expect(setNumToPrecision(1234.5678, 1, { fixZero: false })).toBe('1234.5');
    expect(setNumToPrecision(0, 'asd')).toBe(0);
  });

  test('test formatCoinCurrency', () => {
    expect(formatCoinCurrency('asd')).toBe('asd');
    expect(formatCoinCurrency('123')).toBe('123.00');
  });

  describe('test isIOS', () => {
    describe('test isIOS', () => {
      test('test  isIOS', () => {
        expect(isIOS()).toBe(false);
      });
    });

    describe('test isIOS', () => {
      let tmp;

      beforeAll(() => {
        tmp = navigator.userAgent;
        navigator.__defineGetter__('userAgent', function () {
          return 'Mozilla/5.0 (iPhone) AppleWebKit/537.36 (KHTML, like Gecko) chrome/14.1.0 safari/14.1.0';
        });
      });

      test('test  isIOS', () => {
        expect(isIOS()).toBe(true);
      });

      afterAll(() => {
        navigator.__defineGetter__('userAgent', function () {
          return tmp;
        });
      });
    });
  });

  test('test getTransTimer', () => {
    expect(getTransTimer()).toBe('--');
    expect(moment(getTransTimer('2022-05-05 08:00:00')).valueOf()).toBeGreaterThanOrEqual(
      moment('2022/05/05 00:00:00').valueOf(),
    );
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

  describe('test getQueryVariable', () => {
    test('test getQueryVariable', () => {
      expect(getQueryVariable()).toBe(false);
    });
  });

  describe('test getQueryVariable', () => {
    let tmp = window.location;
    beforeAll(() => {
      delete window.location;
      window.location = { search: '?filter=aaa' };
    });
    test('test getQueryVariable', () => {
      expect(getQueryVariable('filter')).toBe('aaa');
    });

    afterAll(() => {
      window.location = tmp;
    });
  });

  test('test compareVersion', () => {
    expect(compareVersion('1.1.1', '1.1.0')).toBe(1);
  });

  test('test trimObjByKeys', () => {
    expect(trimObjByKeys({ a: '  123   ' })).toEqual({ a: '123' });
  });

  test('test isEmptyOrNil', () => {
    expect(isEmptyOrNil(null)).toBe(true);
    expect(isEmptyOrNil()).toBe(true);
    expect(isEmptyOrNil(0)).toBe(false);
    expect(isEmptyOrNil('')).toBe(true);
    expect(isEmptyOrNil('0')).toBe(false);
  });

  test('test isUndef', () => {
    expect(isUndef('')).toBe(true);
    expect(isUndef(null)).toBe(true);
    expect(isUndef()).toBe(true);
    expect(isUndef(0)).toBe(false);
  });

  describe('getPrecision', () => {
    test('should return 0 for integer numbers', () => {
      expect(getPrecision(123)).toBe(0);
      expect(getPrecision(0)).toBe(0);
      expect(getPrecision(-500)).toBe(0);
    });

    test('should return correct precision for decimal numbers', () => {
      expect(getPrecision(123.456)).toBe(3);
      expect(getPrecision(0.001)).toBe(3);
      expect(getPrecision(-2.34)).toBe(2);
    });

    test('should handle strings that represent numbers', () => {
      expect(getPrecision('123.456')).toBe(3);
      expect(getPrecision('0.001')).toBe(3);
      expect(getPrecision('-2.34')).toBe(2);
    });

    test('should support a minimum precision', () => {
      expect(getPrecision(123, 2)).toBe(2);
      expect(getPrecision(1.2, 3)).toBe(3);
      expect(getPrecision(0.00001, 10)).toBe(10);
    });

    test('should return 0 precision for non-numeric inputs', () => {
      expect(getPrecision('abc')).toBe(0);
      expect(getPrecision(null)).toBe(0);
      expect(getPrecision(undefined)).toBe(0);
      expect(getPrecision({})).toBe(0);
      expect(getPrecision([])).toBe(0);
    });

    test('should handle corner cases', () => {
      expect(getPrecision(0.1)).toBe(1); // Leading decimal point
      expect(getPrecision(0)).toBe(0); // Trailing decimal point
      expect(getPrecision(NaN)).toBe(0); // NaN
      expect(getPrecision(Infinity)).toBe(0); // Infinity
    });
  });
});

describe('numSeparateDecimal', () => {
  it('should return 0 when input is null, NaN, or 0', () => {
    expect(numSeparateDecimal(null)).toBe(0);
    expect(numSeparateDecimal(NaN)).toBe(0);
    expect(numSeparateDecimal(0)).toBe(0);
  });
  it('should return the input number when it has no decimal part', () => {
    expect(numSeparateDecimal(123)).toBe(123);
  });
  it('should return the input number when its decimal part has less than or equal to interceptDigits digits', () => {
    expect(numSeparateDecimal(123.45)).toBe(123.45);
    expect(numSeparateDecimal(123.4)).toBe(123.4);
  });
  it('should return the number with its decimal part truncated to interceptDigits digits when its decimal part has more than interceptDigits digits', () => {
    expect(numSeparateDecimal(123.456)).toBe(123.45);
    expect(numSeparateDecimal(123.456, 1)).toBe(123.4);
  });
});
