/**
 * Owner: garuda@kupotech.com
 */

import SyncStorage from '../index';

import sentryReport from '../sentryReport';
import isStorageValid from '../isStorageValid';
import { _isQuotaExceeded, _handleQuotaExceeded } from '../storageClean';
import { getBrandSite } from '../constant';

jest.mock('../sentryReport', () => jest.fn());
jest.mock('../isStorageValid', () => jest.fn());
jest.mock('../storageClean', () => ({
  _isQuotaExceeded: jest.fn(),
  _handleQuotaExceeded: jest.fn(),
}));

jest.mock('../constant', () => {
  const originalModule = jest.requireActual('../constant');
  return {
    ...originalModule,
    getBrandSite: jest.fn(),
  };
});

describe('SyncStorage', () => {
  let syncStorage;

  let mockStorage;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: mockStorage,
    });

    Object.defineProperty(window, 'sessionStorage', {
      writable: true,
      value: mockStorage,
    });

    // Mock external dependencies
    getBrandSite.mockReturnValue('KC');
    isStorageValid.mockReturnValue(true);
    sentryReport.mockImplementation(() => {});

    syncStorage = new SyncStorage({
      namespace: 'testNamespace',
      reporter: sentryReport,
      storageType: 'localStorage',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('_checkSetTwiceKeys', () => {
    it('should return true for keys in NEED_SET_TWICE', () => {
      expect(syncStorage._checkSetTwiceKeys('lang')).toBe(true);
    });

    it('should return false for keys not in NEED_SET_TWICE', () => {
      expect(syncStorage._checkSetTwiceKeys('unknownKey')).toBe(false);
    });
  });

  describe('_checkFallback', () => {
    it('should return true if the current site is in NEED_CALLBACK', () => {
      expect(syncStorage._checkFallback()).toBe(true);
    });

    it('should return false if the current site is not in NEED_CALLBACK', () => {
      getBrandSite.mockReturnValue('UNKNOWN');

      expect(syncStorage._checkFallback()).toBe(false);
    });
  });

  describe('_getBasePrefix', () => {
    it('should return the correct base prefix', () => {
      const key = 'testKey';

      expect(syncStorage._getBasePrefix(key)).toBe('testNamespacetestKey');
    });
  });

  describe('_addPrefix', () => {
    it('should add the public prefix correctly', () => {
      const key = 'testKey';

      expect(syncStorage._addPrefix(key, { isPublic: true })).toBe('testNamespacetestKey');
    });

    it('should add the site prefix correctly', () => {
      const key = 'testKey';

      expect(syncStorage._addPrefix(key, { isPublic: false })).toBe(
        `!_${getBrandSite()}_testNamespacetestKey`,
      );
    });
  });

  describe('_getItem', () => {
    it('should return parsed data if storage is valid and data exists', () => {
      const key = 'testKey';

      const value = JSON.stringify({ data: 'testData' });

      mockStorage.getItem.mockReturnValue(value);

      const result = syncStorage._getItem('localStorage', key, { isPublic: true });

      expect(result).toEqual({ data: 'testData' });

      expect(mockStorage.getItem).toHaveBeenCalledWith('testNamespacetestKey');
    });

    it('should return null if storage is invalid', () => {
      isStorageValid.mockReturnValue(false);

      const result = syncStorage._getItem('localStorage', 'testKey', { isPublic: true });

      expect(result).toBeNull();
    });

    it('should return null and report error if JSON parsing fails', () => {
      const key = 'testKey';

      mockStorage.getItem.mockReturnValue('invalidJSON');

      const result = syncStorage._getItem('localStorage', key, { isPublic: true });

      expect(result).toBeNull();

      expect(sentryReport).toHaveBeenCalled();
    });

    it('should fallback to base prefix if data is missing and fallback is enabled', () => {
      const key = 'testKey';

      const fallbackValue = JSON.stringify({ data: 'fallbackData' });

      mockStorage.getItem.mockImplementation((key) => {
        if (key === 'testNamespacetestKey') return fallbackValue;

        return null;
      });

      const result = syncStorage._getItem('localStorage', key, { isPublic: false });

      expect(result).toEqual({ data: 'fallbackData' });
    });
  });

  describe('_setItem', () => {
    it('should set item correctly', () => {
      const key = 'testKey';

      const value = { data: 'testData' };

      syncStorage._setItem('localStorage', key, value, { isPublic: true });

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'testNamespacetestKey',

        JSON.stringify(value),
      );
    });

    it('should handle quota exceeded error', () => {
      const key = 'testKey';

      const value = { data: 'testData' };

      mockStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      _isQuotaExceeded.mockReturnValue(true);

      syncStorage._setItem('localStorage', key, value, { isPublic: true });

      expect(_handleQuotaExceeded).toHaveBeenCalled();
    });

    it('should set fallback key if key is in NEED_SET_TWICE', () => {
      const key = 'lang';

      const value = { data: 'testData' };

      syncStorage._setItem('localStorage', key, value, { isPublic: true });

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'testNamespacelang',

        JSON.stringify(value),
      );
    });
  });

  describe('_removeItem', () => {
    it('should remove item correctly', () => {
      const key = 'testKey';

      syncStorage._removeItem('localStorage', key, { isPublic: true });

      expect(mockStorage.removeItem).toHaveBeenCalledWith('testNamespacetestKey');
    });

    it('should return null if storage is invalid', () => {
      isStorageValid.mockReturnValue(false);

      const result = syncStorage._removeItem('localStorage', 'testKey', { isPublic: true });

      expect(result).toBeNull();
    });
  });
});
