/**
 * Owner: june.lee@kupotech.com
 */

import sessionStorage from 'src/utils/sessionStorage.js';

describe('sessionStorage', () => {
  const mockData = { foo: 'bar' };
  const mockKey = 'test_key';
  const mockPrefix = 'test_prefix';

  beforeEach(() => {
    sessionStorage.removeItem(mockKey, mockPrefix);
  });

  afterEach(() => {
    sessionStorage.removeItem(mockKey, mockPrefix);
  });

  describe('getItem', () => {
    it('should return null if sessionStorage is not available', () => {
      window.sessionStorage = null;

      const result = sessionStorage.getItem(mockKey, mockPrefix);

      expect(result).toBeNull();
    });

    it('should parse and return the data if it exists in sessionStorage', () => {
      window.sessionStorage.setItem(`${mockPrefix}_${mockKey}`, JSON.stringify(mockData));

      const result = sessionStorage.getItem(mockKey, mockPrefix);

      expect(result).toEqual(mockData);
    });

    it('should catch and log errors and return undefined', () => {
      window.sessionStorage.setItem(`${mockPrefix}_${mockKey}`, 'invalid JSON');

      console.error = jest.fn();
      const result = sessionStorage.getItem(mockKey, mockPrefix);

      expect(console.error).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return null if no prefix', () => {
      const result = sessionStorage.getItem(mockKey);

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should set the data in sessionStorage with the correct key', () => {
      sessionStorage.setItem(mockKey, mockData, mockPrefix);

      const result = JSON.parse(window.sessionStorage.getItem(`${mockPrefix}_${mockKey}`));

      expect(result).toEqual(mockData);
    });

    it('should return undefined if sessionStorage is not available', () => {
      window.sessionStorage = null;

      const result = sessionStorage.setItem(mockKey, mockData, mockPrefix);

      expect(result).toBeUndefined();
    });
  });

  describe('setDiffItem', () => {
    it('should set the data in sessionStorage and return true if the data is different from the existing data', () => {
      const oldData = { old: 'data' };
      window.sessionStorage.setItem(`${mockPrefix}_${mockKey}`, JSON.stringify(oldData));

      const result = sessionStorage.setDiffItem(mockKey, mockData, mockPrefix);

      expect(result).toBe(true);
      expect(JSON.parse(window.sessionStorage.getItem(`${mockPrefix}_${mockKey}`))).toEqual(
        mockData,
      );
    });

    it('should not set the data in sessionStorage and return false if the data is the same as the existing data', () => {
      window.sessionStorage.setItem(`${mockPrefix}_${mockKey}`, JSON.stringify(mockData));

      const result = sessionStorage.setDiffItem(mockKey, mockData, mockPrefix);

      expect(result).toBe(false);
      expect(JSON.parse(window.sessionStorage.getItem(`${mockPrefix}_${mockKey}`))).toEqual(
        mockData,
      );
    });

    it('should return undefined if sessionStorage is not available', () => {
      const result = sessionStorage.setDiffItem(mockKey, mockData, mockPrefix);

      expect(result).toBeTruthy();
    });
  });

  describe('setDiffStrItem', () => {
    it('should set the string data in sessionStorage and return true if the data is different from the existing data', () => {
      const oldData = '{"old":"data"}';
      window.sessionStorage.setItem(`${mockPrefix}_${mockKey}`, oldData);

      const result = sessionStorage.setDiffStrItem(mockKey, JSON.stringify(mockData), mockPrefix);

      expect(result).toBe(true);
      expect(window.sessionStorage.getItem(`${mockPrefix}_${mockKey}`)).toEqual(
        JSON.stringify(mockData),
      );
    });
  });
});
