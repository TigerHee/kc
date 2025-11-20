import localStorage from 'src/utils/storage.js';

describe('localStorage', () => {
  const mockData = { foo: 'bar' };
  const mockKey = 'test_key';
  const mockPrefix = 'test_prefix';

  beforeEach(() => {
    localStorage.removeItem(mockKey, mockPrefix);
  });

  afterEach(() => {
    localStorage.removeItem(mockKey, mockPrefix);
  });

  describe('getItem', () => {
    it('should return null if localStorage is not available', () => {
      window.localStorage = null;

      const result = localStorage.getItem(mockKey, mockPrefix);

      expect(result).toBeNull();
    });

    it('should parse and return the data if it exists in localStorage', () => {
      window.localStorage.setItem(`${mockPrefix}_${mockKey}`, JSON.stringify(mockData));

      const result = localStorage.getItem(mockKey, mockPrefix);

      expect(result).toEqual(mockData);
    });

    it('should catch and log errors and return undefined', () => {
      window.localStorage.setItem(`${mockPrefix}_${mockKey}`, 'invalid JSON');

      console.error = jest.fn();
      const result = localStorage.getItem(mockKey, mockPrefix);

      expect(console.error).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return null if no prefix', () => {
      const result = localStorage.getItem(mockKey);

      expect(result).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should set the data in localStorage with the correct key', () => {
      localStorage.setItem(mockKey, mockData, mockPrefix);

      const result = JSON.parse(window.localStorage.getItem(`${mockPrefix}_${mockKey}`));

      expect(result).toEqual(mockData);
    });

    it('should return undefined if localStorage is not available', () => {
      window.localStorage = null;

      const result = localStorage.setItem(mockKey, mockData, mockPrefix);

      expect(result).toBeUndefined();
    });
  });

  describe('setDiffItem', () => {
    it('should set the data in localStorage and return true if the data is different from the existing data', () => {
      const oldData = { old: 'data' };
      window.localStorage.setItem(`${mockPrefix}_${mockKey}`, JSON.stringify(oldData));

      const result = localStorage.setDiffItem(mockKey, mockData, mockPrefix);

      expect(result).toBe(true);
      expect(JSON.parse(window.localStorage.getItem(`${mockPrefix}_${mockKey}`))).toEqual(mockData);
    });

    it('should not set the data in localStorage and return false if the data is the same as the existing data', () => {
      window.localStorage.setItem(`${mockPrefix}_${mockKey}`, JSON.stringify(mockData));

      const result = localStorage.setDiffItem(mockKey, mockData, mockPrefix);

      expect(result).toBe(false);
      expect(JSON.parse(window.localStorage.getItem(`${mockPrefix}_${mockKey}`))).toEqual(mockData);
    });

    it('should return undefined if localStorage is not available', () => {
      const result = localStorage.setDiffItem(mockKey, mockData, mockPrefix);

      expect(result).toBeTruthy();
    });
  });

  describe('setDiffStrItem', () => {
    it('should set the string data in localStorage and return true if the data is different from the existing data', () => {
      const oldData = '{"old":"data"}';
      window.localStorage.setItem(`${mockPrefix}_${mockKey}`, oldData);

      const result = localStorage.setDiffStrItem(mockKey, JSON.stringify(mockData), mockPrefix);

      expect(result).toBe(true);
      expect(window.localStorage.getItem(`${mockPrefix}_${mockKey}`)).toEqual(
        JSON.stringify(mockData),
      );
    });
  });
});

it('测试 sessionGetItem, sessionSetItem, sessionRemoveItem 取,存,删逻辑', () => {
  const storage = localStorage;
  storage.sessionSetItem('testLocal', 123);
  expect(storage.sessionGetItem('testLocal')).toBe(123);
  storage.sessionSetItem('testLocal', 123, true);
  expect(storage.sessionGetItem('testLocal', true)).toBe(123);
  storage.sessionRemoveItem('testLocal');
  expect(storage.sessionGetItem('testLocal')).toBe(null);
  storage.sessionRemoveItem('testLocal', true);
  expect(storage.sessionGetItem('testLocal', true)).toBe(null);
  storage.sessionSetItem('testLocal', 123);
  sessionStorage.clear();
  expect(storage.sessionGetItem('testLocal')).toBe(null);
  expect(sessionStorage.length).toBe(0);
});
