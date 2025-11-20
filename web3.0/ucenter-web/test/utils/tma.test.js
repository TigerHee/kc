/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { getBridge, isTMA } from 'utils/tma/bridge';

function setBridge(value) {
  jest.spyOn(window, 'parent', 'get').mockImplementation(() => ({
    bridge: value,
  }));
}

describe('tma 相关的工具函数', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test getBridge', () => {
    setBridge({
      isTMA: true,
    });

    const result = getBridge();

    expect(result).toEqual({
      isTMA: true,
    });
  });

  test('test isTMA true', () => {
    setBridge({
      isTMA: true,
    });

    const result = isTMA();

    expect(result).toBe(true);
  });

  test('test bridge is null', () => {
    setBridge(null);

    const result = isTMA();

    expect(result).toBe(false);
  });

  test('test isTMA false', () => {
    setBridge({
      isTMA: false,
    });

    const result = isTMA();

    expect(result).toBe(false);
  });
});
