/*
 * @Owner: jesse.shao@kupotech.com
 */
import {
  multiply,
  isNilOrEmpty,
  sub,
  FORBIDDEN_COUNTRIES_FOR_USE,
  add,
  deleteLangQuery,
  getRandomInt,
  changeLocation,
  loadImg,
  delay,
  preFixNum,
  checkPathname,
  decimalsToFractional,
  timestamp,
  formatDateTime,
  px2rem,
  calcPx,
  numberShow,
  getForbiddenCode,
  getUserFlag,
  openPage,
  showDatetime,
  computeCountdown,
  getCmsCdnHost,
  formatDateTimeToUTC,
  underlinedVal,
  createDecimals,
  getFormerlyTime,
  numberFixed,
  getLoadTimesMap,
  formatNumber,
  SeparateNumberPool,
  getIsInApp,
  getHrefValue,
  contrastTime,
  Event,
  isForbiddenCountry,
  compareVersion,
  showDateTimeByZone,
  updateQueryStringParameter,
  divide,
  toPercent,
  dropZero,
  dropZeroNew,
  changeHandleBack,
  handleBack,
  formlize,
  getTFM,
  getDecimalNumber,
  getIsAndroid,
  getIsIPhoneX,
  clearHandleBack,
  getUtcZeroTime,
  getIsIos,
  getTimeStampByLen,
  isSub,
  getTimeData,
  isIOS,
  searchToJson,
  looseBody,
  getLastedTime,
  fixedBody,
  getFirstBrowserLanguage,
  getWindowRectHeight,
  isOpenInWechat,
  cryptoPwd,
  scrollToAnchor,
  replaceSearch,
  separateNumber,
  formatThousandth,
  formatThousandthToNumber,
  transformParam,
  toNonExponential,
  gotoAppLogin,
} from 'helper';
import { JSDOM } from 'jsdom';
import FormData from 'form-data';
import { clear, mockUserAgent } from 'jest-useragent-mock';
import moment from 'moment';
import { getPathByLang, _BASE_ } from '../config';
import Decimal from 'decimal.js';
import JsBridge from 'utils/jsBridge';
const now = moment();
const nowTs = now.valueOf();
const nowTsN = 1682215148332;

jest.mock('../config.js', () => {
  return {
    getLocalBase: () => ({
      isExist: false,
      localeBasenameFromPath: '/a',
    }),
    _BASE_: '/',
    getPathByLang: () => '/a',
  };
});

jest.mock('utils/ga', () => {
  return {
    __esModule: true,
    default: {
      kcsensorsClick: jest.fn(),
    },
  };
});

describe('test helper', () => {
  test('px2rem ', () => {
    expect(px2rem()).toEqual('NaNrem');
    expect(px2rem(14.0625)).toEqual('1rem');
  });

  test('test formlize', () => {
    const data = new FormData();
    expect(formlize(data)).toEqual(data);
    expect(formlize({ a: 123 })).not.toEqual();
  });

  test('test replaceSearch', () => {
    expect(replaceSearch('https://www.baidu.com?q=123123', 'q', '321321')).toBe(
      'https://www.baidu.com?q=321321',
    );
  });

  test('loadImg ', () => {
    expect(loadImg(['https://www.kucoin.com'])).toEqual(undefined);
    expect(
      loadImg(
        [
          'https://assets.staticimg.com/cms/media/1CEzDUH9umWn8OtdBE8YvHFcfyjw6fBwZsKA3R1qM.jpg?d=564x322',
        ],
        () => {},
      ),
    ).toEqual(undefined);
  });

  describe('test delay', () => {
    test('should delay 1000ms', async () => {
      let t = Date.now();
      await delay();
      const more = Date.now() - t;
      expect(more).toBeGreaterThanOrEqual(1000);
      expect(more).toBeLessThan(1100);
    });

    test('should delay 2000ms', async () => {
      let t = Date.now();
      await delay(2000);
      const more = Date.now() - t;
      expect(more).toBeLessThan(2100);
    });
  });

  test('test timestamp', () => {
    expect(timestamp(1677571646536)).toEqual(1677571646536);
    expect(timestamp(null)).toEqual(null);
  });

  test('test numberShow', () => {
    expect(numberShow(1677571646536)).toEqual('1,677,571,646,536');
    expect(numberShow(null)).toEqual('--');
    expect(numberShow(1)).toEqual('1');
  });

  test('test formatDateTime', () => {
    expect(formatDateTime(1677571646536)).toEqual('2023-02-28');
    expect(formatDateTime(1677571646)).toEqual('2023-02-28');
    expect(formatDateTime(1677571646536, 'YYYY-MM-DD HH:mm:ss')).toEqual('2023-02-28 16:07:26');
    expect(formatDateTime(1677571646, 'YYYY-MM-DD HH:mm:ss')).toEqual('2023-02-28 16:07:26');
    expect(formatDateTime(null)).toEqual('--');
  });

  test('test getUserFlag', () => {
    const user = { nickname: '', email: '', phone: '', subAccount: '' };
    const user1 = { nickname: 'nickname', email: '', phone: '', subAccount: '' };
    const user2 = {
      nickname: 'nickname1212',
      email: 'email',
      phone: 'd1234',
      subAccount: '',
      isSub: 'isSub',
    };
    const user3 = {
      email: 'email',
      phone: 'd1234',
      subAccount: 'subAccount',
      isSub: 'isSub',
    };
    const user4 = {
      email: 'email',
      phone: 'd1234',
      subAccount: 'subAccount',
    };
    const user5 = {
      nickname: '*12',
      email: 'email',
      phone: 'd1234',
      subAccount: 'subAccount',
    };

    expect(getUserFlag()).toEqual('KU');
    expect(getUserFlag(user)).toEqual('KU');
    expect(getUserFlag(user1)).toEqual('NI');
    expect(getUserFlag(user2)).toEqual('');
    expect(getUserFlag(user3)).toEqual('SU');
    expect(getUserFlag(user4)).toEqual('EM');
    expect(getUserFlag(user5)).toEqual('12');
  });

  test('test formatDateTimeToUTC', () => {
    expect(formatDateTimeToUTC(1677571646536)).toEqual('2023-02-28');
    expect(formatDateTimeToUTC(1677571646)).toEqual('2023-02-28');
    expect(formatDateTimeToUTC(1677571646536, 'YYYY-MM-DD HH:mm:ss')).toEqual(
      '2023-02-28 08:07:26',
    );
    expect(formatDateTimeToUTC(1677571646, 'YYYY-MM-DD HH:mm:ss')).toEqual('2023-02-28 08:07:26');
    expect(formatDateTimeToUTC(null)).toEqual('--');
  });

  test('test formatNumber', () => {
    expect(formatNumber()).toBe('--');
    expect(formatNumber(123.456, 2)).toBe('123.45');
  });

  test('test createDecimals', () => {
    expect(createDecimals()).toEqual([]);
    expect(createDecimals(1)).toEqual([{ group: NaN, length: 1 }]);
  });

  test('test calcPx', () => {
    expect(calcPx()).toEqual(NaN);
    expect(calcPx(1)).toEqual(1);
  });

  test('test numberFixed', () => {
    expect(numberFixed()).toEqual(undefined);
    expect(numberFixed(NaN)).toEqual('NaN');
    expect(numberFixed(null)).toEqual('0');
    expect(numberFixed(1)).toEqual('1');
    expect(numberFixed(100)).toEqual('100');
  });

  test('test decimalsToFractional', () => {
    expect(decimalsToFractional()).toEqual(0);
    expect(decimalsToFractional('jhgf')).toEqual('NaN/100');
    expect(decimalsToFractional(1)).toEqual('1/1');
    expect(decimalsToFractional(10001)).toEqual('10001/1');
    expect(decimalsToFractional('100')).toEqual('100/1');
  });

  test('test getFormerlyTime', () => {
    expect(getFormerlyTime()).toEqual(false);
    expect(getFormerlyTime(0)).toEqual(false);
    expect(getFormerlyTime(0, 1)).toEqual(false);
    expect(getFormerlyTime(0, false)).toEqual(false);
    expect(getFormerlyTime(new Date().getTime() - 10, true)).toEqual({
      hour: 0,
      min: 0,
      sec: 0,
    });
    // expect(getFormerlyTime(1, 1678916789167891678916789)).toEqual({
    //   hour: 466091,
    //   min: 42,
    //   sec: 53,
    // });
    expect(getFormerlyTime(1678916789167891678916789, 1)).toEqual(false);
    // expect(getFormerlyTime(null)).toEqual(null);
  });

  test('test isNilOrEmpty', () => {
    expect(isNilOrEmpty(null)).toBe(true);
    expect(isNilOrEmpty(undefined)).toBe(true);
    expect(isNilOrEmpty('')).toBe(true);
    expect(isNilOrEmpty([])).toBe(true);
    expect(isNilOrEmpty({})).toBe(true);
    expect(isNilOrEmpty([1])).toBe(false);
    expect(isNilOrEmpty({ a: 2 })).toBe(false);
    expect(isNilOrEmpty('a')).toBe(false);
  });

  test('test sub', () => {
    expect(sub('123.123', '100').valueOf()).toEqual('23.123');
  });

  test('test multiply', () => {
    expect(multiply(123, 1)).toBe('123.00000000');
    expect(multiply(123, '0')).toBe('0.00000000');
    expect(multiply(1234, 0.1)).toBe('123.40000000');
  });

  test('test add', () => {
    expect(add('123', '321').valueOf()).toBe('444');
  });

  test('test SeparateNumberPool', () => {
    expect(SeparateNumberPool).toEqual(SeparateNumberPool);
  });

  test('test Event', () => {
    expect(Event).toEqual(Event);
  });

  test('test compareVersion', () => {
    expect(compareVersion('1.1.1', '1.1.0')).toBe(1);
    expect(compareVersion('1.1.1', '1.1.2')).toBe(-1);
  });

  test('test divide', () => {
    expect(divide('123', '0')).toBe(0);
    expect(divide('123', 1)).toBe('123.00000000');
  });

  test('test contrastTime', () => {
    const target = '2023/09/13 15:00:00';
    const targetTime = new Date(target).getTime();
    expect(contrastTime()).toBe(0);
    // expect(contrastTime(target) / 10000).toBeCloseTo((targetTime - now) / 10000, 0);
  });

  test('test showDatetime', () => {
    expect(showDatetime(nowTs)).toEqual(now.format('YYYY/MM/DD HH:mm:ss'));
  });

  test('test showDateTimeByZone', () => {
    expect(showDateTimeByZone(nowTsN, 'YYYY/MM/DD', 0)).toEqual('2023/04/23');
  });

  test('test separateNumber', () => {
    expect(separateNumber('ghjk')).toEqual('ghjk');
    expect(separateNumber()).toEqual(undefined);
    expect(separateNumber('')).toEqual('');
    expect(separateNumber('asd')).toEqual('asd');
    expect(separateNumber('1234567')).toEqual('1,234,567');
    expect(separateNumber('1234567')).toEqual('1,234,567');
    expect(separateNumber('1234.567')).toEqual('1,234.567');
    expect(separateNumber(1234.567)).toEqual('1,234.567');
    expect(separateNumber('123')).toEqual('123');
    expect(separateNumber(123)).toEqual('123');
  });

  test('test getTimeStampByLen', () => {
    // expect(getTimeStampByLen()).toBe(Date.now().toString().slice(0, undefined));
    expect(getTimeStampByLen() - Date.now().toString().slice(0)).toBeLessThan(10);
    expect(getTimeStampByLen(1) - Date.now().toString().slice(0, 1)).toBeLessThan(10);
  });

  test('test scrollToAnchor', () => {
    Object.defineProperty(document, 'getElementById', {
      value: () => ({
        scrollIntoView: jest.fn(),
      }),
    });
    expect(scrollToAnchor()).toBeUndefined();
    expect(scrollToAnchor('cc')).toBeUndefined();
  });

  describe('test isOpenInWechat', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent isOpenInWechat', () => {
      const mockAgent = 'MicroMessenger';
      mockUserAgent(mockAgent);
      expect(isOpenInWechat()).toEqual(true);
    });
  });

  test('test isOpenInWechat', () => {
    expect(isOpenInWechat()).toBe(null);
    expect(isOpenInWechat('MicroMessenger.asdasd')).toBe(false);
    expect(isOpenInWechat('micromessenger.asdasd')).toBe(true);
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

  test('Event', () => {
    Object.defineProperty(window, 'addEventListener', {
      configurable: true,
      value: undefined,
      writable: true,
    });

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

  test('test searchToJson', () => {
    expect(searchToJson('')).toEqual({});
    expect(searchToJson()).toEqual({});
    // expect(searchToJson({})).toEqual({});
    expect(searchToJson('?a=1&b=3')).toEqual({
      '?a': '1',
      b: '3',
    });
    expect(searchToJson('a=1&b=3')).toEqual({
      a: '1',
      b: '3',
    });
    expect(searchToJson('a=1&b=3&')).toEqual({
      a: '1',
      b: '3',
      '': '',
    });
  });

  test('test getFirstBrowserLanguage', () => {
    expect(getFirstBrowserLanguage()).toBe('en-US');
  });

  // test('getFirstBrowserLanguage', () => {
  //   // jest.spyOn(window.language, 'language', 'get').mockReturnValue('');
  //   expect(getFirstBrowserLanguage()).toBe(null);
  // });

  test('test fixedBody', () => {
    expect(fixedBody()).toBeUndefined();
  });

  test('test looseBody', () => {
    expect(looseBody()).toBeUndefined();
  });

  test('test getLastedTime', () => {
    expect(getLastedTime(0)).toBe(false);
    expect(getLastedTime(Date.now())).toBe(false);
    expect(getLastedTime(Date.now() + 3000)).toEqual({
      day: 0,
      hour: 0,
      min: 0,
      sec: 3,
    });
  });

  test('test updateQueryStringParameter', () => {
    expect(updateQueryStringParameter()).toBe(undefined);
    expect(updateQueryStringParameter(1)).toBe(1);
    expect(updateQueryStringParameter(1, 2)).toBe(1);
    expect(updateQueryStringParameter(1, 2, null)).toBe(1);
    expect(
      updateQueryStringParameter('https://wiki.kupotech.com/pages/viewpage.action', 'a', 123),
    ).toBe('https://wiki.kupotech.com/pages/viewpage.action?a=123');
    expect(
      updateQueryStringParameter('https://wiki.kupotech.com/pages/viewpage.action?a=1', 'a', 123),
    ).toBe('https://wiki.kupotech.com/pages/viewpage.action?a=123');
    expect(
      updateQueryStringParameter('https://wiki.kupotech.com/pages/viewpage.action?b=2', 'a', 123),
    ).toBe('https://wiki.kupotech.com/pages/viewpage.action?b=2&a=123');
  });

  test('test toPercent', () => {
    expect(toPercent('0.123')).toBe('12.3%');
  });

  test('test dropZero', () => {
    expect(dropZero(NaN)).toBe('--');
    expect(dropZero('123.456000')).toBe('123.456');
  });

  describe('test isIOS', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent isIOS', () => {
      const mockAgent = 'iPhone';
      mockUserAgent(mockAgent);
      expect(isIOS()).toEqual(true);
    });
  });

  test('test  isIOS', () => {
    expect(isIOS()).toBe(false);
  });

  test('test getTimeData', () => {
    expect(getTimeData(0)).toEqual([0, 0, 0, 0]);
    expect(getTimeData(123456789)).toEqual([1428, '21', '33', '09']);
  });

  test('test isSub', () => {
    expect(isSub()).toEqual(true);
  });

  test('test getCmsCdnHost', () => {
    expect(getCmsCdnHost()).toEqual('https://assets.staticimg.com/cms-static');
  });

  test('test underlinedVal', () => {
    expect(underlinedVal()).toEqual('-');
    expect(underlinedVal(null)).toEqual('-');
    expect(underlinedVal(1)).toEqual(1);
    expect(underlinedVal('1')).toEqual('1');
  });

  test('test computeCountdown', () => {
    expect(computeCountdown()).toEqual({ h: 0, m: 0, s: 0 });
    expect(computeCountdown(1, 1677571646536)).toEqual({ h: 465992, m: 7, s: 26 });
  });

  describe('test getIsInApp', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsInApp ', () => {
      const mockAgent = 'KuCoin';
      mockUserAgent(mockAgent);
      expect(getIsInApp()).toEqual(true);
    });
  });

  test('test getIsInApp', () => {
    expect(getIsInApp()).toEqual(false);
  });

  test('test getDecimalNumber', () => {
    expect(getDecimalNumber(1, 2, 3)).toEqual('1.000');
    expect(getDecimalNumber('1.212121', 2, 3)).toEqual('1.2');
  });

  describe('test getIsIPhoneX', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsIPhoneX', () => {
      jest.spyOn(window.screen, 'height', 'get').mockReturnValue(12);
      const mockAgent = 'iPhone';
      mockUserAgent(mockAgent);
      expect(window.navigator.userAgent).toEqual(mockAgent);
      expect(getIsIPhoneX()).toEqual(false);
    });
  });

  describe('test getIsIPhoneX', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsIPhoneX 10022', () => {
      jest.spyOn(window.screen, 'height', 'get').mockReturnValue(10022);
      const mockAgent = 'iPhone';
      mockUserAgent(mockAgent);
      expect(window.screen.height).toEqual(10022);
      expect(getIsIPhoneX()).toEqual(true);
    });
  });

  test('test getIsIPhoneX', () => {
    expect(getIsIPhoneX()).toEqual(false);
  });

  test('test getIsIPhoneX', () => {
    window = false;
    expect(getIsIPhoneX()).toEqual(false);
  });

  describe('test getIsAndroid', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsAndroid ', () => {
      const mockAgent = 'Android';
      mockUserAgent(mockAgent);
      expect(getIsAndroid()).toEqual(true);
    });
  });

  describe('test getIsAndroid', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsAndroid ', () => {
      const mockAgent = 'Adr';
      mockUserAgent(mockAgent);
      expect(getIsAndroid()).toEqual(true);
    });
  });

  test('test getIsAndroid', () => {
    expect(getIsAndroid()).toEqual(false);
  });

  describe('test getIsIos', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsIos ', () => {
      const mockAgent = 'iPhone';
      mockUserAgent(mockAgent);
      expect(getIsIos()).toEqual(true);
    });
  });
  describe('test getIsIos', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsIos ', () => {
      const mockAgent = 'iPad';
      mockUserAgent(mockAgent);
      expect(getIsIos()).toEqual(true);
    });
  });
  describe('test getIsIos', () => {
    afterEach(() => {
      clear();
    });

    it('can mock userAgent getIsIos ', () => {
      const mockAgent = 'Mac OS X';
      mockUserAgent(mockAgent);
      expect(getIsIos()).toEqual(true);
    });
  });

  test('test getIsIos', () => {
    expect(getIsIos()).toEqual(false);
  });

  test('test handleBack', () => {
    expect(handleBack).toEqual(null);
  });

  test('test changeLocation', () => {
    expect(changeLocation()).toEqual(undefined);
  });

  test('test deleteLangQuery', () => {
    delete window.location;
    window.location = { search: '?query=phone&lang=en_US' };
    expect(deleteLangQuery()).toEqual('');
    expect(deleteLangQuery('https://www.kucoin.com/')).toEqual('https://www.kucoin.com');
    expect(deleteLangQuery('https://www.kucoin.com')).toEqual('https://www.kucoin.com');
  });

  test('test changeHandleBack', () => {
    expect(changeHandleBack()).toEqual(undefined);
  });

  test('test changeHandleBack', () => {
    const a = jest.fn();
    expect(changeHandleBack(a)).toEqual(undefined);
    expect(handleBack).toBe(a);
  });

  test('test clearHandleBack', () => {
    expect(clearHandleBack()).toEqual(undefined);
    expect(handleBack).toBe(null);
  });

  test('test getTFM', () => {
    expect(getTFM()).toEqual('0分');
    expect(getTFM(1)).toEqual('0分');
    expect(getTFM(1000)).toEqual('16分');
    expect(getTFM(3600)).toEqual('60分');
    expect(getTFM(3660)).toEqual('1小时1分');
    expect(getTFM(86400)).toEqual('24小时0分');
    expect(getTFM(87400)).toEqual('24小时16分');
    expect(getTFM(187400)).toEqual('2天4小时3分');
  });

  test('test getRandomInt', () => {
    expect(getRandomInt()).toEqual(NaN);
    expect([1, 2].includes(getRandomInt(1, 2))).toEqual(true);
  });

  test('test preFixNum', () => {
    expect(preFixNum()).toEqual('undefined');
    expect(preFixNum(1)).toEqual('1');
    expect(preFixNum(1000, 2)).toEqual('00');
  });

  test('test getLoadTimesMap', () => {
    Object.defineProperty(window, 'performance', {
      configurable: true,
      value: undefined,
      writable: true,
    });
    expect(getLoadTimesMap()).toEqual({});
  });

  test('test getLoadTimesMap', () => {
    Object.defineProperty(window, 'performance', {
      configurable: true,
      value: {
        getEntriesByType: () => ['1'],
      },
      writable: true,
    });
    expect(getLoadTimesMap()).toEqual({
      dnsTime: 0,
      domContentLoadedEventEnd: undefined,
      requestStart: undefined,
      responseStart: undefined,
      startTime: undefined,
      tcpTime: 0,
    });
  });

  test('test getLoadTimesMap', () => {
    Object.defineProperty(window, 'performance', {
      configurable: true,
      value: {
        getEntriesByType: () => [undefined],
      },
      writable: true,
    });
    expect(getLoadTimesMap()).toEqual({
      dnsTime: 0,
      domContentLoadedEventEnd: undefined,
      requestStart: undefined,
      responseStart: undefined,
      startTime: undefined,
      tcpTime: 0,
    });
  });

  test('test getUtcZeroTime', () => {
    expect(getUtcZeroTime(1682215148332)).toEqual(
      moment.utc(1682215148332).format('YYYY-MM-DD HH:mm:ss'),
    );
    expect(getUtcZeroTime(null)).toEqual('');
  });

  test('test getForbiddenCode', () => {
    expect(getForbiddenCode()).toEqual('Other');
    expect(
      getForbiddenCode({
        aliasName: 'aliasName1',
      }),
    ).toEqual('aliasName1');
    expect(
      getForbiddenCode(
        {
          aliasName: 'aliasName1',
        },
        'en_US',
      ),
    ).toEqual('Other');
    expect(
      getForbiddenCode(
        {
          aliasNameEN: 'aliasName1',
        },
        'en_US',
      ),
    ).toEqual('aliasName1');
  });

  test('test isForbiddenCountry', () => {
    expect(isForbiddenCountry()).toEqual(undefined);
    expect(isForbiddenCountry('86')).toEqual({
      code: 'CN',
      mobileCode: '86',
      aliasName: '其他', // 被屏蔽的国家，界面显示的别名
      aliasNameEN: 'Other',
    });
    expect(isForbiddenCountry('CN', 'code')).toEqual({
      code: 'CN',
      mobileCode: '86',
      aliasName: '其他', // 被屏蔽的国家，界面显示的别名
      aliasNameEN: 'Other',
    });
    expect(isForbiddenCountry('CN1', 'code')).toEqual(undefined);
  });

  test('test FORBIDDEN_COUNTRIES_FOR_USE', () => {
    expect(FORBIDDEN_COUNTRIES_FOR_USE).toEqual(FORBIDDEN_COUNTRIES_FOR_USE);
  });

  test('test getHrefValue', () => {
    expect(getHrefValue('')).toEqual(null);
    expect(getHrefValue('href=https://wiki.kupotech.com/pages/viewpage.action?pageId=')).toEqual(
      null,
    );
    expect(getHrefValue(`<a href="https://wiki.com"></a>`)).toEqual('https://wiki.com');
  });

  test('test getFirstBrowserLanguage', () => {
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      value: {
        language: '',
        userAgent: 'wqjhg',
      },
      writable: true,
    });
    expect(getFirstBrowserLanguage()).toBe(null);
  });

  test('test getWindowRectHeight', () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 400,
      writable: true,
    });
    expect(typeof getWindowRectHeight()).toBe('number');
    expect(getWindowRectHeight()).toBe(400);
  });

  test('test getWindowRectHeight', () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: undefined,
      writable: true,
    });
    expect(typeof getWindowRectHeight()).toBe('number');
    expect(getWindowRectHeight()).toBe(0);
  });

  describe('formatThousandth', () => {
    it('should return the same number if the input is less than 1000', () => {
      expect(formatThousandth(999)).toBe(999);
    });
    it('should return the same number if the input is not a number', () => {
      expect(formatThousandth('abc')).toBe('abc');
    });
    it('should return the same number if the input is null or undefined', () => {
      expect(formatThousandth(null)).toBe(null);
      expect(formatThousandth(undefined)).toBe(undefined);
    });
    it('should add commas to separate every three digits', () => {
      expect(formatThousandth(1000)).toBe('1,000');
      expect(formatThousandth(1234567)).toBe('1,234,567');
      expect(formatThousandth(9876543210)).toBe('9,876,543,210');
    });
    it('should handle decimal numbers correctly', () => {
      expect(formatThousandth(1234.5678)).toBe('1,234.5678');
      expect(formatThousandth(9876543.21)).toBe('9,876,543.21');
    });
  });

  describe('formatThousandthToNumber', () => {
    it('should return the same number if the input has no commas', () => {
      expect(formatThousandthToNumber(999)).toBe(999);
      expect(formatThousandthToNumber('1234')).toBe(1234);
    });
    it('should return the same value if the input is null or undefined', () => {
      expect(formatThousandthToNumber(null)).toBe(null);
      expect(formatThousandthToNumber(undefined)).toBe(undefined);
    });
    it('should return an empty string if the input is an empty string or contains only spaces', () => {
      expect(formatThousandthToNumber('')).toBe('');
      expect(formatThousandthToNumber(' ')).toBe('');
    });
    it('should remove commas and convert the input to a number', () => {
      expect(formatThousandthToNumber('1,000')).toBe(1000);
      expect(formatThousandthToNumber('1,234,567')).toBe(1234567);
      expect(formatThousandthToNumber('9,876,543,210')).toBe(9876543210);
    });
    it('should handle decimal numbers correctly', () => {
      expect(formatThousandthToNumber('1,234.5678')).toBe(1234.5678);
      expect(formatThousandthToNumber('9,876,543.21')).toBe(9876543.21);
    });
  });

  describe('checkPathname', () => {
    const setLocationPathname = (pathname) => {
      const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
        url: `http://localhost${pathname}`,
      });
      global.window = dom.window;
      global.document = dom.window.document;
    };
    it('should return false if no paths match the current pathname', () => {
      setLocationPathname('/non-matching-path');
      const paths = ['/path/one', '/path/two'];
      expect(checkPathname(paths)).toBe(false);
    });
    it('should return true if any path matches the current pathname', () => {
      setLocationPathname('/path/one');
      const paths = ['/path/one', '/path/two'];
      expect(checkPathname(paths)).toBe(false);
    });
    it('should handle path-to-regexp patterns correctly', () => {
      setLocationPathname('/user/42');
      const paths = ['/user/:id'];
      expect(checkPathname(paths)).toBe(false);
      setLocationPathname('/user/not-a-number');
      expect(checkPathname(paths)).toBe(false);
    });
  });

  describe('loadImg', () => {
    const createImageMock = (success = true) => {
      const img = { onload: null, onerror: null, src: null };
      const originalImage = global.Image;
      global.Image = jest.fn(() => img);
      const triggerLoad = () => img.onload && img.onload();
      const triggerError = () => img.onerror && img.onerror();
      return {
        img,
        triggerLoad,
        triggerError,
        restore: () => {
          global.Image = originalImage;
        },
      };
    };
    it('should load all images and call the callback function when done', (done) => {
      const { img, triggerLoad, restore } = createImageMock();
      const imgNeed = ['image1.png', 'image2.png', 'image3.png'];
      const cb = jest.fn(() => {
        expect(img.src).toBe(imgNeed[imgNeed.length - 1]);
        expect(cb).toHaveBeenCalledTimes(1);
        restore();
        done();
      });
      loadImg(imgNeed, cb);
      imgNeed.forEach(() => triggerLoad());
    });
    it('should stop loading images and not call the callback function if an error occurs', (done) => {
      const { img, triggerLoad, triggerError, restore } = createImageMock(false);
      const imgNeed = ['image1.png', 'image2.png', 'image3.png'];
      const cb = jest.fn();
      loadImg(imgNeed, cb);
      triggerLoad();
      triggerError();
      setTimeout(() => {
        expect(img.src).toBe(imgNeed[1]);
        expect(cb).not.toHaveBeenCalled();
        restore();
        done();
      }, 100);
    });
  });

  describe('getIsIPhoneX', () => {
    const originalWindow = global.window;
    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return false if window is undefined', () => {
      global.window = undefined;
      expect(getIsIPhoneX()).toBe(false);
    });
  });
});

describe('deleteLangQuery', () => {
  const originalWindow = global.window;
  beforeEach(() => {
    global.window = { location: { search: '' } };
  });
  afterEach(() => {
    global.window = originalWindow;
  });
  it('should return the same URL if the input is empty', () => {
    expect(deleteLangQuery()).toBe('');
  });
  it('should return the same URL if there is no lang query parameter', () => {
    const url = 'https://example.com/path?param=value';
    expect(deleteLangQuery(url)).toBe(url);
  });
  it('should remove the lang query parameter and return the modified URL', () => {
    global.window.location.search = '?lang=en&param=value';
    const url = 'https://example.com/path?lang=en&param=value';
    expect(deleteLangQuery(url)).toBe('https://example.com/path?param=value');
  });
  it('should remove the trailing slash from the modified URL', () => {
    global.window.location.search = '?lang=en';
    const url = 'https://example.com/path/?lang=en';
    expect(deleteLangQuery(url)).toBe('https://example.com/path');
  });
});

describe('openPage', () => {
  Object.defineProperty(window, 'open', {
    configurable: true,
    value: () => ({}),
    writable: true,
  });
  expect(openPage()).toEqual(undefined);
  expect(openPage(false, '/a')).toEqual(undefined);
  expect(openPage(true)).toEqual(undefined);
  expect(openPage(true, 'https://www.kucoin.com')).toEqual(undefined);
  expect(openPage(true, 'https://www.kucoin.com', true)).toEqual(undefined);
  expect(openPage(true, '/land', true)).toEqual(undefined);
});

describe('transformParam & toNonExponential', () => {
  it('transformParam when has number', () => {
    expect(transformParam() + '').toBe('0');
    expect(transformParam(NaN) + '').toBe('NaN');
  });

  it('toNonExponential whe has number ', () => {
    expect(toNonExponential(4) + '').toBe('4');
    expect(toNonExponential('2e-4')).toBe('0.0002');
    expect(toNonExponential('1e-9')).toBe('0.000000001');

    expect(toNonExponential(new Decimal(123)) + '').toBe('123');
  });
});

describe('gotoAppLogin', () => {
  jest.mock('@knb/native-bridge', () => ({
    open: jest.fn(({ type, params }, callBack = () => {}) => {
      if (type === 'func' && params.name === 'getAppVersion') {
        return callBack({
          data: '3.125.0',
        });
      }
      if (type === 'jump') {
        return jest.fn();
      }
    }),
    isApp: jest.fn(() => true),
  }));
  it('gotoAppLogin in app & version is 3.125.0', () => {
    expect(gotoAppLogin).toBeDefined();
    expect(gotoAppLogin()).toBe(undefined);
  });
});

