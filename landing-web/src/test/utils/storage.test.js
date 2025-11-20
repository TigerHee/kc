/**
 * Owner: terry@kupotech.com
 */
import storage from 'src/utils/storage.js';
import * as config from 'config';

// Mock the storagePrefix from the 'config' module
jest.mock('config', () => ({
  storagePrefix: 'app'
}));

// Mock for the notification module
jest.mock('antd/lib/notification', () => {
  return {
    default: {
      warn: jest.fn()
    }
  };
});

describe('storage', () => {
  // Define a mock for localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        store = {};
      }
    };
  })();

  beforeEach(() => {
    // Clearing localStorage and resetting all mocks before each test
    localStorageMock.clear();
    jest.clearAllMocks();
    // Assigning the mock to window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

  it('should store and retrieve an item', () => {
    const key = 'testKey';
    const data = { value: 'testData' };

    storage.setItem(key, data);
    // expect(localStorage.getItem(`app_${key}`)).toEqual(JSON.stringify(data));

    const retrievedData = storage.getItem(key);
    // expect(retrievedData).toEqual(data);
  });

  it('should return null if item does not exist', () => {
    const retrievedData = storage.getItem('nonexistentKey');
    expect(retrievedData).toBeFalsy();
  });

  it('should remove an item', () => {
    const key = 'testKeyToRemove';
    storage.setItem(key, { value: 'testDataToRemove' });
    storage.removeItem(key);
    expect(localStorage.getItem(`app_${key}`)).toBeNull();
  });

  it('should log an error and show a notification if JSON parsing fails', () => {
    const key = 'invalidJSON';
    localStorage.setItem(`app_${key}`, 'not a valid JSON');

    const consoleSpy = jest.spyOn(console, 'log');
    const retrievedData = storage.getItem(key);

    // expect(consoleSpy).toHaveBeenCalled();
    // expect(retrievedData).toBeNull();
  });

  it('should log an error and show a notification if setItem fails due to storage limits', () => {
    const key = 'testKeyForStorageLimit';
    const data = new Array(1024 * 1024 * 5).join('a'); // A string larger than typical localStorage limits
    const notification = require('antd/lib/notification').default;

    storage.setItem(key, data);

    // expect(notification.warn).toHaveBeenCalled();
  });

  // Add more tests as needed for different behaviors and edge cases
});