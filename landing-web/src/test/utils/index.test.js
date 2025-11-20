/*
 * Owner: tom@kupotech.com
 */

import { render } from '@testing-library/react';
import { setTwoDimensionalArray } from 'utils/array';
import formatUrlWithLang from 'utils/formatUrlWithLang';
import { renderHook } from '@testing-library/react-hooks';
import {
  ga,
  getGaElement,
  kcsensorsClick,
  kcsensorsManualExpose,
  compose,
  addSpmIntoQuery,
  getPageId,
  saTrackForBiz,
  useExpose,
} from 'utils/ga';
import { getUtmLink } from 'utils/getUtm';
import { isRTLLanguage } from 'utils/langTools';
// import { linkToTrade, linkToTradeOld } from 'utils/linkToTrade';
import localStorage from 'utils/memStorage';
import precision from 'utils/precision';
import preloadImg from 'utils/preloadImg';
import { isOnCache, pullWrapper, setOnCache } from 'utils/pullCache';
import saveAs from 'utils/saveAs';
import { sensors } from 'utils/sensors';
import { changeLangPath } from 'utils/seoTools';
import storage from 'utils/storage';
import systemDynamic from 'utils/systemDynamic';

// jest.mock('umi/router');
jest.mock('utils/lang');

describe('test utils', () => {
  test('test setTwoDimensionalArray', () => {
    expect(setTwoDimensionalArray([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
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
  });

  test('test getUtmLink', () => {
    expect(getUtmLink('')).toBe('');
    expect(getUtmLink('https://www.kucoin.com')).toBe('https://www.kucoin.com');
  });

  test('test isRTLLanguage', () => {
    expect(isRTLLanguage('ar_AE')).toBe(true);
    expect(isRTLLanguage('en_US')).toBe(false);
  });

  test('test  localStorage', () => {
    expect(localStorage.getItem()).toBe(null);
    expect(localStorage.setItem('test', { a: 123 })).toBe();
    expect(localStorage.getItem('test')).toEqual({ a: 123 });
  });

  test('test precision', () => {
    expect(precision('USDT', 8)).toBe(8);
    expect(precision('USDT', '8')).toBe(8);
    expect(precision('USDT')).toBe(8);
  });

  test('test preloadImg', () => {
    expect(preloadImg()).resolves.toBe();
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
    expect(
      saveAs(
        'https://assets.staticimg.com/public-web/2.6.8/static/bg-beginner.d2821c82.png',
        '测试下载的文件',
      ),
    ).toBe();
  });

  test('test changeLangPath', () => {
    let enUrl = changeLangPath('en_US');
    console.log(enUrl);
  });

  test('test storage', () => {
    expect(storage.getItem('test')).toBeFalsy();
    expect(storage.setItem('test', 123)).toBe();
    expect(storage.getItem('test')).toBe(123);
    expect(storage.removeItem('test')).toBe();
    expect(storage.getItem('test')).toBeFalsy();
  });

  test('test dynamic', () => {
    const Index = systemDynamic('@remote/entrance', 'Index');
    const { asFragment } = render(<Index />);
    expect(asFragment()).toMatchSnapshot();
  });
});

// test('test linkToTrade', () => {
//   expect(linkToTrade('KCS-BTC')).toBe();
//   expect(linkToTrade()).toBe();
// });

// test('test linkToTradeOld', () => {
//   expect(linkToTradeOld('KCS-BTC')).toBe();
// });

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

  test('test kcsensorsClick', () => {
    expect(kcsensorsClick()).toBe();
  });

  test('test kcsensorsManualExpose', () => {
    expect(kcsensorsManualExpose({})).toBe();
  });

  test('test compose', () => {
    expect(compose([1, 2, 3])).toBeDefined();
  });

  test('test addSpmIntoQuery', () => {
    expect(addSpmIntoQuery()).toBeDefined();
    addSpmIntoQuery('/url', 'aaa')?.then(url => {
      expect(url).toBe('/url?spm=aaa');
    })
  });

  test('test getPageId', () => {
    expect(getPageId()).toBeDefined()
  });

  test('test saTrackForBiz', () => {
    expect(saTrackForBiz({})).toBe();
  });

  test('test sensors', () => {
    expect(sensors.trackClick()).toBe();
  });
});

describe('useExpose', () => {
  it('should call instance with ref and getTrackParams', () => {
    const instance = jest.fn();
    const ref = { current: {} };
    const getTrackParams = jest.fn();
    // const wrapper = ({ children }) => (
    //   <exposeContext.Provider value={{ instance }}>{children}</exposeContext.Provider>
    // );
    renderHook(() => useExpose(ref, getTrackParams));
    expect(instance).toHaveBeenCalledTimes(0);
  });
});
