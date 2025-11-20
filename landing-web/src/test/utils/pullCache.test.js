/**
 * Owner: terry@kupotech.com
 */
import {
  pullWrapper,
  isOnCache,
  setOnCache,
} from 'src/utils/pullCache.js';

// Mocking console.log to suppress logs during tests
jest.spyOn(console, 'log').mockImplementation(() => { });

describe('pullWrapper', () => {
  const mockPull = jest.fn();

  beforeEach(() => {
    mockPull.mockReset();
  });

  it('should use cache when onCache is true and URL is default host', () => {
    setOnCache(true);
    const wrappedPull = pullWrapper(mockPull);
    wrappedPull('/my-api-endpoint');
    expect(mockPull).toHaveBeenCalledWith('/kcscache/my-api-endpoint');
  });

  it('should not use cache when onCache is false', () => {
    setOnCache(false);
    const wrappedPull = pullWrapper(mockPull);
    const url = '/my-api-endpoint';
    wrappedPull(url);
    expect(mockPull).toHaveBeenCalledWith(url);
  });

  it('should not use cache for non-default host URLs', () => {
    setOnCache(true);
    const wrappedPull = pullWrapper(mockPull);
    const url = 'http://example.com/my-api-endpoint';
    wrappedPull(url);
    expect(mockPull).toHaveBeenCalledWith(url);
  });
});

describe('setOnCache and isOnCache', () => {
  it('should set and get the cache status', () => {
    setOnCache(false);
    expect(isOnCache()).toBe(false);
    setOnCache(true);
    expect(isOnCache()).toBe(true);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});