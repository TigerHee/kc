/**
 * Owner: willen@kupotech.com
 */
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import _ from 'lodash';
import moment from 'moment';
import { createContext } from 'react';
import Index from 'src/components/VoiceCode';
import {
  checkBackUrlIsSafe,
  compareVersion,
  concatPath,
  createDecimals,
  dateToChartTimeMinute,
  dropZero,
  evtEmitter,
  formatNumber,
  formlize,
  getCurrentTime,
  isIOS,
  isOutOfTimeRange,
  judgeChrome,
  multiply,
  multiplyFloor,
  numberFixed,
  searchToJson,
  showDatetime,
} from 'src/helper';
import { customRender } from 'src/test/setup';
import { loadAdaScript, removeAda, setAdaMetaFields } from 'src/utils/ada';
import formatImageSizeUrl from 'src/utils/formatImageSizeUrl';
import formatUrlWithLang, { updateQueryStringParameter } from 'src/utils/formatUrlWithLang';
import {
  addSpmIntoQuery,
  compose,
  ga,
  gaClickNew,
  getAnonymousID,
  getGaElement,
  getPageId,
  saTrackForBiz,
  trackClick,
  useExpose,
} from 'src/utils/ga';
import { getUtm, getUtmLink } from 'src/utils/getUtm';
import { getBgUrl } from 'src/utils/loginUtils';
import precision, { all } from 'src/utils/precision';
import { isOnCache, pullWrapper, setOnCache } from 'src/utils/pullCache';
import storage from 'src/utils/storage';
import {
  replaceHelpCenterUrl,
  replaceOldOrigin,
  replacezhHans2zhHant,
  resolveArticalLinks,
} from 'src/utils/tool';

describe('test ada', () => {
  test('test loadAdaScript', () => {
    expect(loadAdaScript()).resolves.toBe({});
  });
  test('test setAdaMetaFields', () => {
    expect(setAdaMetaFields()).toBe();
    expect(setAdaMetaFields(null)).toBe();
  });
  test('test removeAda', () => {
    expect(removeAda()).resolves.toBe({});
  });
});

test('test checkBackUrlIsSafe', () => {
  expect(checkBackUrlIsSafe('')).toBe(false);
  expect(checkBackUrlIsSafe('https://www.kucoin.net')).toBe(false);
  expect(checkBackUrlIsSafe('https://www.kucoin.com')).toBe(true);
  expect(checkBackUrlIsSafe('https://www.kucoin.plus')).toBe(false);
  expect(checkBackUrlIsSafe('https://www.KUCOIN.com')).toBe(true);
  expect(checkBackUrlIsSafe('https://kucoin.zendesk.com')).toBe(true);

  // FIXME
  // expect(checkBackUrlIsSafe('https://hack-kucoin.net')).toBe(false);
  // expect(checkBackUrlIsSafe('https://hacker-taken-kucoin.zendesk.com')).toBe(false);
  expect(checkBackUrlIsSafe('https://www.zendesk.com')).toBe(false);
  expect(checkBackUrlIsSafe('https://www.kucoin.hack.com')).toBe(false);
  expect(checkBackUrlIsSafe('https://hack-kucoin.net')).toBe(false);
  expect(checkBackUrlIsSafe('https://kucoin.net.hack')).toBe(false);
  expect(checkBackUrlIsSafe('https://www.kucoin.com-hack.com')).toBe(false);
  expect(checkBackUrlIsSafe('https://hacker-taken-kucoin.zendesk.com')).toBe(false);
  expect(checkBackUrlIsSafe('javscript:alert(1);\nhttps://www.kucoin.com')).toBe(false);
});

test('test compareVersion', () => {
  expect(compareVersion('1.1.1', '1.1.0')).toBe(1);
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

test('test dynamic', () => {
  customRender(<Index />);
  expect(document.querySelector('div')).toBeInTheDocument();
});

test('test evtEmitter', () => {
  const { getEvt, removeEvt } = evtEmitter;
  expect(getEvt()).toEqual({});
  expect(removeEvt('event')).toBe(undefined);
});

describe('test formatImageSizeUrl', () => {
  beforeAll(() => {
    // global.IS_TEST_ENV = true;
  });
  test('test formatImageSizeUrl', () => {
    expect(formatImageSizeUrl('/xxx')).toBe('/xxx');
    expect(formatImageSizeUrl('', '123x123')).toBe('');
    expect(formatImageSizeUrl('https://assets.staticimg.com/cms/media/xxx', '123x123')).toBe(
      'https://assets.staticimg.com/cms/media/xxx?d=123x123',
    );
  });
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

  test('test getAnonymousID', () => {
    expect(getAnonymousID()).toBe(123);
  });

  test('test compose', () => {
    expect(compose([1, 2, 3])).toBe('');
  });

  test('test addSpmIntoQuery', () => {
    expect(addSpmIntoQuery()).toBe();
    expect(addSpmIntoQuery('/url', 'aaa')).toBe('/url');
  });

  test('test getPageId', () => {
    expect(getPageId()).toBe('page');
  });
});

test('test getCurrentTime', () => {
  const now = Date.now();
  expect(getCurrentTime()).toBeCloseTo(now, -4);
  expect(getCurrentTime({ serverTime: now - 10000, requestedLocalTime: now })).toBeCloseTo(now, -3);
  expect(getCurrentTime({ serverTime: now - 100000, requestedLocalTime: now })).toBeCloseTo(
    now - 100000,
    -2,
  );
});

test('test getUtmLink', () => {
  try {
    getUtmLink(123);
  } catch (error) {
    expect(error.message).toBe('Expected argument to be a string.');
  }

  expect(getUtmLink('')).toBe('');
  expect(getUtmLink('asd')).toBe('asd');

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
      expect(storage.getItem('test')).toBeFalsy();
      expect(storage.setItem('test', 123)).toBe();
      expect(storage.getItem('test')).toBe(123);
      expect(storage.removeItem('test')).toBe();
      expect(storage.getItem('test')).toBeFalsy();
    });
  });
  // describe('test storage', () => {
  //   beforeAll(() => {
  //     window.localStorage = null;
  //   });
  //   test('test storage', () => {
  //     expect(storage.getItem('test')).toBe();
  //     expect(storage.setItem('test', 123)).toBe();
  //     expect(storage.removeItem('test')).toBe();
  //   });
  // });
});

describe('test tool', () => {
  test('test tool', () => {
    const data = '<a href="https://www.kucoin.com">text</a>';
    expect(replaceHelpCenterUrl()).toBe();
    expect(replaceHelpCenterUrl(`href="https://support.kucoin.plus/hc/en-us/articles/123"`)).toBe(
      'href="undefined/support/123"',
    );
    expect(replaceHelpCenterUrl(`href="https://support.kucoin.plus/hc/zh-hk/sections/123"`)).toBe(
      'href="undefined/support/sections/123"',
    );

    // 测试运行环境的 location.origin 是 localhost
    expect(resolveArticalLinks(data)).toBe('<a href="http://localhost">text</a>');

    expect(replaceOldOrigin()).toBe();

    expect(replaceOldOrigin(data)).toBe('<a href="https://www.kucoin.com">text</a>');

    expect(replaceOldOrigin('<a href="https://express.kucoin.com">text</a>')).toBe(
      '<a href="https://www.kucoin.com/express">text</a>',
    );

    expect(replacezhHans2zhHant('href="https://www.kucoin.com/zh-hans"')).toBe(
      'href="http://localhost/zh-hant"',
    );
  });
});

// Mock the exposeContext
const exposeContext = createContext();
const mockInstance = jest.fn();

describe('useExpose', () => {
  it('should not call instance if instance is not provided', () => {
    const ref = { current: 'testRef' };

    const getTrackParams = jest.fn().mockReturnValue('testParams');
    const mockContextValueWithoutInstance = { instance: null };

    const wrapperWithoutInstance = ({ children }) => (
      <exposeContext.Provider value={mockContextValueWithoutInstance}>
        {children}
      </exposeContext.Provider>
    );

    renderHook(() => useExpose(ref, getTrackParams), { wrapper: wrapperWithoutInstance });
    expect(mockInstance).not.toHaveBeenCalled();
  });
});
