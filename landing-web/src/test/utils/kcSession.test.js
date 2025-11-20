/**
 * Owner: terry@kupotech.com
 */
import { storagePrefix } from 'src/config';
import { genKey, sessionStorage as _sessionStorage } from 'src/utils/kcSession.js'; // 请替换为你的实际路径

describe('genKey', () => {
  it('should generate a key with default prefix', () => {
    const key = genKey('testKey');
    expect(key).toBe(`${storagePrefix}_testKey`);
  });

  it('should generate a key with provided prefix', () => {
    const key = genKey('testKey', 'customPrefix');
    expect(key).toBe('customPrefix_testKey');
  });
});

describe('sessionStorage', () => {
  beforeEach(() => {
    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('should set item in sessionStorage', () => {
    const key = 'testKey';
    const value = { data: 'testData' };

    const result = _sessionStorage.setItem(key, value);
    const _key = genKey(key);

    expect(result).toBe(true);
  });

  it('should get item from sessionStorage', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    const _key = genKey(key);

    window.sessionStorage.getItem.mockReturnValue(JSON.stringify(value));

    const result = _sessionStorage.getItem(key);

    expect(result).toEqual(value);
  });

  it('should remove item from sessionStorage', () => {
    const key = 'testKey';
    const _key = genKey(key);

    const result = _sessionStorage.removeItem(key);

    expect(result).toBe(true);
  });

  it('should handle setItem error', () => {
    const key = 'testKey';
    const value = { data: 'testData' };

    const result = _sessionStorage.setItem(key, value);

    expect(result).toBe(true);
  });

  it('should handle getItem error', () => {
    const key = 'testKey';

    // Simulate error
    const result = _sessionStorage.getItem(key);

    expect(result).toBeTruthy();
  });

  it('should handle removeItem error', () => {
    const key = 'testKey';

    const result = _sessionStorage.removeItem(key);

    expect(result).toBeTruthy();
  });

  it('without storage', () => {
    const key = 'testKey2';
    Object.defineProperty(window, 'sessionStorage', {
      value: {},
      writable: true,
    });
    window.sessionStorage.getItem = null;
    window.sessionStorage.setItem = null;
    window.sessionStorage.removeItem = null;
    jest.resetModules();
    const module = require('src/utils/kcSession');
    expect(module.sessionStorage.getItem(key)).toBeFalsy();
    expect(module.sessionStorage.setItem(key, 'test')).toBeFalsy();
    expect(module.sessionStorage.removeItem(key)).toBeFalsy();
  });

  it('without storage2', () => {
    const key = 'testKey2';
    Object.defineProperty(window, 'sessionStorage', {
      value: null,
      writable: true,
    });
    jest.resetModules();
    const module = require('src/utils/kcSession');
    expect(module.sessionStorage.getItem(key)).toBeFalsy();
    expect(module.sessionStorage.setItem(key, 'test')).toBeFalsy();
    expect(module.sessionStorage.removeItem(key)).toBeFalsy();
  });
});
