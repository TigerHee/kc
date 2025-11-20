/**
 * Owner: garuda@kupotech.com
 */

import {
  _legacyStorageCleanup,
  _isQuotaExceeded,
  _batchDelete,
  _retryOperation,
  _handleQuotaExceeded,
} from '../storageClean';

import { brandPrefix } from '../constant';

const mockStorage = (type, items) => {
  const mapItems =  new Map(items || []);  
  const storage = {
    data: mapItems,
    key: (index) => Array.from(mapItems.keys())[index],
    getItem: (key) => mapItems.get(key),
    setItem: (key, value) => mapItems.set(key, value),
    removeItem: (key) => mapItems.delete(key),
    length: mapItems.size,
  };
  // mock window 
  Object.defineProperty(window, type, {
    writable: true,
    value: storage,
  });
  return storage;
};

describe('_legacyStorageCleanup', () => {
  beforeEach(() => {
    mockStorage('localStorage', [
      [`${brandPrefix}old1`, 'value'],
      ['otherKey', 'value'],
      [`${brandPrefix}new`, 'value'],
    ]);
  });

  test('应正确收集遗留 key', () => {
    const result = _legacyStorageCleanup('localStorage', `${brandPrefix}new`);
    expect(result).toEqual([`${brandPrefix}old1`]);
  });

  test('空存储返回空数组', () => {
    mockStorage('localStorage');
    const result = _legacyStorageCleanup('localStorage', 'prefix');
    expect(result).toEqual([]);
  });
});

describe('_isQuotaExceeded', () => {
  const mobileUA = 'Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) Mobile/8J2 Safari/6533.18.5';
  const desktopUA = 'MSIE/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

  test('移动端配额错误检测', () => {
    Object.defineProperty(navigator, 'userAgent', { value: mobileUA, configurable: true });
    const error1 = { message: '超出存储限制' };
    const error2 = { message: 'storage limit' };
    expect(_isQuotaExceeded(error1)).toBe(true);
    expect(_isQuotaExceeded(error2)).toBe(true);
  });

  test('标准浏览器错误检测', () => {
    Object.defineProperty(navigator, 'userAgent', { value: desktopUA, configurable: true });

    const chromeError = new DOMException('', 'QuotaExceededError');
    const firefoxError = new DOMException('', 'NS_ERROR_DOM_QUOTA_REACHED');
    const safariError = new DOMException('QuotaExceeded Error', '');
    const ieError =new DOMException('Storage quota exceeded', '');

    expect(_isQuotaExceeded(chromeError)).toBe(true);
    expect(_isQuotaExceeded(firefoxError)).toBe(true);
    // expect(_isQuotaExceeded({ code: 22 })).toBe(true);
    // expect(_isQuotaExceeded({ code: 1014 })).toBe(true);
    expect(_isQuotaExceeded(safariError)).toBe(true);
    expect(_isQuotaExceeded(ieError)).toBe(true);
  });

  test('非配额错误返回 false', () => {
    expect(_isQuotaExceeded(new Error('普通错误'))).toBe(false);
  });
});

describe('_batchDelete', () => {
  let reporter;
  beforeEach(() => {
    mockStorage(
      'localStorage',
      Array.from({ length: 100 }, (_, i) => [`key${i}`, 'value']),
    );
    reporter = jest.fn();
  });

  test('分批次删除 keys', async () => {
    const keys = Array.from({ length: 100 }, (_, i) => `key${i}`);
    const callback = jest.fn();

    _batchDelete('localStorage', keys, callback, reporter);

    expect(window.localStorage.length).toBe(100);

    await Promise.resolve();
    expect(callback).toHaveBeenCalled();
  });

  test('处理删除异常', () => {
    const error = new Error('删除失败');
    jest.spyOn(window.localStorage, 'removeItem').mockImplementationOnce(() => {
      throw error;
    });

    _batchDelete('localStorage', ['key1'], () => {}, reporter);
    expect(reporter).toHaveBeenCalledWith(
      'localStorage retry _batchDelete error for unknown',
      error,
    );
  });
});

describe('_retryOperation', () => {
  let reporter;
  beforeEach(() => {
    mockStorage('localStorage');
    reporter = jest.fn();
  });

  test('成功重试操作', () => {
    _retryOperation({
      type: 'localStorage',
      key: 'testKey',
      saveValue: 'value',
      reporter,
    });
    expect(window.localStorage.getItem('testKey')).toBe('value');
  });

  test('处理配额错误', () => {
    const quotaError = new DOMException('', 'QuotaExceededError');
    jest.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
      throw quotaError;
    });

    _retryOperation({
      type: 'localStorage',
      key: 'testKey',
      saveValue: 'value',
      reporter,
    });

    expect(reporter).toHaveBeenCalledWith(
      'localStorage retry setItem error for quotaExceeded',
      quotaError,
    );
  });
});

describe('_handleQuotaExceeded', () => {
  let reporter;
  beforeEach(() => {
    mockStorage('localStorage', [
      [`${brandPrefix}old`, 'value'],
      [`${brandPrefix}current`, 'value'],
    ]);
    reporter = jest.fn();
  });

  test('处理配额超出流程', async () => {
    _handleQuotaExceeded({
      type: 'localStorage',
      prefix: `${brandPrefix}current`,
      key: 'newKey',
      saveValue: 'value',
      reporter,
    });

    await Promise.resolve(); // 处理微任务
    expect(window.localStorage.getItem(`${brandPrefix}old`)).toBeUndefined()
  });
});
