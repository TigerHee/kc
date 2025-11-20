/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import moment from 'moment';
import {
  compareVersion,
  concatPath,
  createDecimals,
  dateToChartTimeMinute,
  dropZero,
  evtEmitter,
  formatNumber,
  formlize,
  isIOS,
  isOutOfTimeRange,
  judgeChrome,
  multiply,
  multiplyFloor,
  numberFixed,
  searchToJson,
  showDatetime,
} from 'src/helper';
import formatUrlWithLang, { updateQueryStringParameter } from 'src/utils/formatUrlWithLang';
import {
  addSpmIntoQuery,
  composeSpmAndSave,
  ga,
  gaClickNew,
  getGaElement,
  getPageId,
  saTrackForBiz,
  trackClick,
} from 'src/utils/ga';
import { getUtm, getUtmLink } from 'src/utils/getUtm';
import { getBgUrl } from 'src/utils/loginUtils';
import precision, { all } from 'src/utils/precision';
import { isOnCache, pullWrapper, setOnCache } from 'src/utils/pullCache';
import saveAs from 'src/utils/saveAs';
import storage from 'src/utils/storage';
import { validatePwd } from 'src/utils/validate';

test('test compareVersion', () => {
  expect(compareVersion('1.1.1', '1.1.0')).toBe(1);
  expect(compareVersion('3.2.0', '1.1.1')).toBe(2);
});

test('test concatPath', () => {
  expect(concatPath('https://www.kucoin.com', 'convert')).toBe('https://www.kucoin.com/convert');
  expect(concatPath('https://www.kucoin.com', '/convert')).toBe('https://www.kucoin.com/convert');
});

test('test createDecimals', () => {
  expect(createDecimals(4)).toEqual([
    { group: 1000000, length: 4 },
    { group: 10000000, length: 3 },
    { group: 100000000, length: 2 },
    { group: 1000000000, length: 1 },
  ]);
});

test('test dateToChartTimeMinute', () => {
  expect(dateToChartTimeMinute(new Date('2023/09/13 15:00:00'))).toEqual(1694617200);
});

test('test dropZero', () => {
  expect(dropZero()).toBe('-');
  expect(dropZero('123.456000')).toBe('123.456');
});

test('test evtEmitter', () => {
  const { getEvt, removeEvt } = evtEmitter;
  expect(getEvt()).toEqual({});
  expect(removeEvt('event')).toBe(undefined);
});

test('test formatNumber', () => {
  expect(formatNumber()).toBe();
  expect(formatNumber(123.456, 2)).toBe('123.45');
});

test('test formatUrlWithLang', () => {
  expect(formatUrlWithLang('https://www.kucoin.com', 'en_US')).toBe(
    'https://www.kucoin.com?lang=en_US',
  );
  expect(formatUrlWithLang('https://www.kucoin.com')).toBe('https://www.kucoin.com?lang=en_US');
  expect(formatUrlWithLang()).toBe();
  expect(formatUrlWithLang('https://www.kucoin.com?a=123', 'en_US')).toBe(
    'https://www.kucoin.com?a=123&lang=en_US',
  );
  expect(updateQueryStringParameter('https://www.kucoin.com?a=123', 'a', 321)).toBe(
    'https://www.kucoin.com?a=321',
  );
});

test('test formlize', () => {
  const form = document.createElement('form');
  const data = new FormData(form);
  expect(formlize(data)).toEqual(data);
  expect(formlize({ a: 123 })).not.toEqual();
});

describe('test ga', () => {
  beforeAll(() => {
    delete window._hmt;
    window._hmt = { push: jest.fn() };

    window.requestIdleCallback = jest.fn();
  });
  test('test ga', () => {
    expect(ga()).resolves.toEqual();
    expect(ga('asd')).resolves.toEqual();
  });

  test('test getGaElement', () => {
    const node = document.createElement('div');
    node.title = 'asdasd';
    expect(getGaElement()).toEqual();
    expect(getGaElement(node)).toEqual();
    expect(getGaElement(node, 'title')).toEqual('asdasd');
  });

  test('test gaClickNew', async () => {
    const res1 = await gaClickNew();
    expect(res1).toBe();
  });

  test('test gaClickNew', async () => {
    const res2 = await gaClickNew('asd');
    expect(res2).toBe();
  });

  test('test trackClick', () => {
    expect(trackClick()).toBe();
  });

  test('test saTrackForBiz', () => {
    expect(saTrackForBiz({})).toBe();
  });

  test('test addSpmIntoQuery', () => {
    expect(addSpmIntoQuery()).toBe();
    expect(addSpmIntoQuery('/url', 'aaa')).toBe('/url?spm=aaa');
  });

  test('test getPageId', () => {
    expect(getPageId()).toBe('page');
  });

  test('test composeSpmAndSave', () => {
    expect(composeSpmAndSave('/url', '')).toBe(undefined);
  });
});

test('test getUtmLink', () => {
  try {
    getUtmLink(123);
  } catch (error) {
    expect(error.message).toBe('Expected argument to be a string.');
  }

  expect(getUtmLink('')).toBe('');
  expect(getUtmLink('asd')).toBe('asd');

  expect(getUtm()).toEqual({});
});

// test('test compress', async () => {
//   expect(compress()).resolves.toEqual({});
// });

// test('test compress', async () => {
//   var Images = [].slice.call(document.querySelectorAll('img.lazy'));
//   Images.forEach(function (lazyImage) {
//     // lazyImageObserver.observe(lazyImage);
//     expect(lazyImageObserver.observe({ lazyImage })).toBe();
//   });
// });

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

test('test  isOutOfTimeRange', () => {
  const now = Date.now();
  expect(isOutOfTimeRange(0)).toBe(true);
  expect(isOutOfTimeRange(now)).toBe(true);
  expect(isOutOfTimeRange(now, [now - 1000, now - 1000])).toBe(true);
  expect(isOutOfTimeRange(now, null)).toBe(true);
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

test('test  getBgUrl', () => {
  expect(
    getBgUrl([
      { isDefault: true, type: 0, url: 'a.com', platform: 20 },
      { isDefault: true, type: 0, url: 'a.com', platform: 40 },
      { isDefault: true, type: 1, url: 'a.com', platform: 20 },
      { isDefault: true, type: 1, url: 'a.com', platform: 40 },
      { isDefault: false, type: 0, url: 'a.com', platform: 20 },
      { isDefault: false, type: 0, url: 'a.com', platform: 40 },
      { isDefault: false, type: 1, url: 'a.com', platform: 20 },
      { isDefault: false, type: 1, url: 'a.com', platform: 40 },
    ]),
  ).toEqual({
    loginBG_h5: 'a.com',
    loginBG_h5_default: 'a.com',
    loginBG_pc: 'a.com',
    loginBG_pc_default: 'a.com',
    signUpBG_h5: 'a.com',
    signUpBG_h5_default: 'a.com',
    signUpBG_pc: 'a.com',
    signUpBG_pc_default: 'a.com',
  });
});

test('test multiply', () => {
  expect(multiply()).toBe(0);
  expect(multiply(123, '0')).toBe(0);
  expect(multiply(1234, 0.1)).toBe('123.40000000');
});

test('test precision', () => {
  expect(all()).toEqual({});
  expect(precision('BTC')).toBe();
  expect(precision('BTC', 4)).toBe(4);
  expect(all()).toEqual({ BTC: 4 });
});

test('test multiply', () => {
  expect(multiplyFloor()).toBe(0);
  expect(multiplyFloor(123, '0')).toBe(0);
  expect(multiplyFloor(1234, 0.01)).toBe('12.34000000');
  expect(multiplyFloor(1234, 0.01, 1)).toBe('12.3');
});

test('test multiply', () => {
  expect(numberFixed()).toBe();
  expect(numberFixed('0')).toBe('0');
});

test('test pullCache', () => {
  const pull = (...a) => a;
  expect(pullWrapper(pull)('/a.get', 1, 2, 3)).toEqual(['/a.get', 1, 2, 3]);
  expect(isOnCache()).toBe(false);
  expect(setOnCache(true)).toBe();
  expect(isOnCache()).toBe(true);
  expect(pullWrapper(pull)('/a.get', 1, 2, 3)).toEqual(['/kcscache/a.get', 1, 2, 3]);
});

test('test saveAs', () => {
  expect(saveAs('/a.down', 'a.txt')).toBe();
});

test('test searchToJson', () => {
  expect(searchToJson()).toEqual({});
  expect(searchToJson('a=123&b=321')).toEqual({ a: '123', b: '321' });
});

test('test showDatetime', () => {
  const now = moment();
  const nowTs = now.valueOf();
  expect(showDatetime(nowTs)).toEqual(now.format('YYYY/MM/DD HH:mm:ss'));
});

describe('test storage', () => {
  describe('test storage', () => {
    test('test storage', () => {
      expect(storage.getItem('test')).toBe(null);
      expect(storage.setItem('test', 123)).toBe();
      expect(storage.getItem('test')).toBe(123);
      expect(storage.removeItem('test')).toBe();
      expect(storage.getItem('test')).toBe(null);
    });
  });
});

test('test validatePwd', () => {
  expect(validatePwd('123456')).toEqual({ check: false, strength: 'L' });
  expect(validatePwd('asdasd asdasdasfasdasdasdasdasdasdasd')).toEqual({
    check: false,
    strength: 'L',
  });
  expect(validatePwd('ASDasd123')).toEqual({
    check: true,
    strength: 'H',
  });
  expect(validatePwd('ASDasdasd')).toEqual({
    check: false,
    strength: 'M',
  });
});
