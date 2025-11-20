// 引入必要的模块

import { getABtestResultBySensorKey } from 'src/utils/abTest.js'; // 替换为实际文件路径

import sensors from '@kucoin-base/sensors';

// Mock sensors.fastFetchABTest 方法
jest.mock('@kucoin-base/sensors', () => ({
  fastFetchABTest: jest.fn(),
}));

describe('getABtestResultBySensorKey', () => {
  afterEach(() => {
    jest.clearAllMocks(); // 清除所有 mock 调用
  });

  it('should return the AB test result when sensors API succeeds', async () => {
    // Mock sensors.fastFetchABTest 返回值
    sensors.fastFetchABTest.mockResolvedValue('testValue');
    const result = await getABtestResultBySensorKey('testKey', {
      defaultValue: 'defaultValue',
      valueType: 'String',
    });

    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: 'testKey',
      value_type: 'String',
      default_value: 'defaultValue',
    });

    expect(result).toBe('testValue');
  });

  it('should return the default value when sensors API fails', async () => {
    // Mock sensors.fastFetchABTest 抛出错误
    sensors.fastFetchABTest.mockRejectedValue(new Error('API Error'));
    const result = await getABtestResultBySensorKey('testKey', {
      defaultValue: 'defaultValue',

      valueType: 'String',
    });
    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: 'testKey',

      value_type: 'String',

      default_value: 'defaultValue',
    });

    expect(result).toBe('defaultValue');
  });

  it('should infer valueType if not provided', async () => {
    // Mock sensors.fastFetchABTest 返回值

    sensors.fastFetchABTest.mockResolvedValue(42);

    const result = await getABtestResultBySensorKey('testKey', {
      defaultValue: 0,
    });

    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: 'testKey',

      value_type: 'Number', // 推断类型为 Number

      default_value: 0,
    });

    expect(result).toBe(42);
  });

  it('should return undefined if sensorKey is not provided', async () => {
    const result = await getABtestResultBySensorKey(null, {
      defaultValue: 'defaultValue',

      valueType: 'String',
    });

    expect(result).toBeUndefined();

    expect(sensors.fastFetchABTest).not.toHaveBeenCalled();
  });

  it('should handle null or undefined defaultValue gracefully', async () => {
    sensors.fastFetchABTest.mockResolvedValue(null);

    const result = await getABtestResultBySensorKey('testKey', {
      defaultValue: null,

      valueType: 'String',
    });

    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: 'testKey',

      value_type: 'String',

      default_value: null,
    });

    expect(result).toBe(null);
  });
});
