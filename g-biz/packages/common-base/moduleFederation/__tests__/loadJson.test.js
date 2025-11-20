/*
 * @Owner: elliott.su@kupotech.com
 */
import { FAILURE, LOADING, SUCCESS } from '../const';
import loadJson, { JsonLoader } from '../loadJson';

// Mock fetch

global.fetch = jest.fn();

describe('JsonLoader', () => {
  beforeEach(() => {
    JsonLoader.cache = {};
    fetch.mockClear();
  });

  test('should initialize with LOADING status', () => {
    const loader = new JsonLoader('http://example.com/data.json');
    expect(loader.status).toBe(LOADING);
  });

  test('should call fetch and update status to FAILURE on failed load', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    const loader = new JsonLoader('http://example.com/data.json');
    await loader.load();
    expect(loader.status).toBe(FAILURE);
  });

  test('should add and execute callbacks', async () => {
    const mockData = { key: 'value' };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });
    const loader = new JsonLoader('http://example.com/data.json');
    const callback = jest.fn();
    loader.add(callback);
    await loader.load();
    expect(callback).toHaveBeenCalled();
  });
});

describe('loadJson', () => {
  beforeEach(() => {
    JsonLoader.cache = {};
    fetch.mockClear();
  });

  test('should handle loading state correctly', async () => {
    fetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    loadJson('http://example.com/data.json', callback1);
    await loadJson('http://example.com/data.json', callback2);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();
  });
  test('should handle loading state correctly, success', async () => {
    JsonLoader.cache = {
      'http://example.com/data.json': {
        status: SUCCESS,
      },
    };
    const callback1 = jest.fn();
    await loadJson('http://example.com/data.json', callback1);
    expect(callback1).toHaveBeenCalled();
  });
  test('should handle loading state correctly, success', async () => {
    JsonLoader.cache = {
      'http://example.com/data.json': {
        status: FAILURE,
      },
    };
    const callback1 = jest.fn();
    await loadJson('http://example.com/data.json', callback1);
    expect(callback1).toHaveBeenCalled();
  });
});
