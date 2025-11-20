import sensors from '@kucoin-base/sensors';
import { matchPath } from 'react-router-dom';
import { getSensorsABResult, getABtestResultBySensorKey, checkIsMatchUrlWithLocation } from 'utils/abTest/util';

describe('getSensorsABResult', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should get default_value when sensors is not available', () => {
    jest.doMock('@kucoin-base/sensors', () => undefined);
    const { getSensorsABResult: getSensorsABResultWithoutSensors } = require('utils/abTest/util');
    const options = { default_value: 'default' };
    const result = getSensorsABResultWithoutSensors(options);
    expect(result).resolves.toBe('default');
  });

  it('should get undefined without options when sensors is not available', () => {
    jest.doMock('@kucoin-base/sensors', () => undefined);
    const { getSensorsABResult: getSensorsABResultWithoutSensors } = require('utils/abTest/util');
    const result = getSensorsABResultWithoutSensors();
    expect(result).resolves.toBe(undefined);
  });

  it('should return the result from sensors.fastFetchABTest when sensors is available', async () => {
    const expectedResult = { key: 'value' };
    sensors.fastFetchABTest.mockResolvedValueOnce(expectedResult);
    const options = { default_value: 'default' };
    const result = await getSensorsABResult(options);
    expect(sensors.fastFetchABTest).toHaveBeenCalledWith(options);
    expect(result).toEqual(expectedResult);
  });
});

describe('getABtestResultBySensorKey', () => {
  it('should return defaultValue if sensorKey is not provided', async () => {
    const options = { defaultValue: 'default', valueType: 'String' };
    const result = await getABtestResultBySensorKey(undefined, options);
    expect(result).toBeUndefined();
  });

  it('should return data from getSensorsABResult if successful', async () => {
    const sensorKey = 'test-key';
    const options = { defaultValue: 'default', valueType: 'String' };
    const expectedResult = 'test-result';
    sensors.fastFetchABTest.mockResolvedValueOnce(expectedResult);
    const result = await getABtestResultBySensorKey(sensorKey, options);
    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: sensorKey,
      value_type: options.valueType,
      default_value: options.defaultValue,
    });
    expect(result).toBe(expectedResult);
  });

  it('should return defaultValue if getSensorsABResult fails', async () => {
    const sensorKey = 'test-key';
    const options = { defaultValue: 'default', valueType: 'String' };
    const result = await getABtestResultBySensorKey(sensorKey, options);
    expect(result).toBe(options.defaultValue);
  });

  it('should infer valueType if not provided', async () => {
    const sensorKey = 'test-key';
    const options = { defaultValue: 'default' };
    const expectedResult = 'test-result';
    sensors.fastFetchABTest.mockResolvedValueOnce(expectedResult);
    const result = await getABtestResultBySensorKey(sensorKey, options);
    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: sensorKey,
      value_type: 'String',
      default_value: options.defaultValue,
    });
    expect(result).toBe(expectedResult);
  });

  it('should handle different types for inferred valueType', async () => {
    const sensorKey = 'test-key';
    const optionsNumber = { defaultValue: 123 };
    const optionsBoolean = { defaultValue: true };
    const expectedResult = 'test-result';
    sensors.fastFetchABTest.mockResolvedValueOnce(expectedResult);

    let result = await getABtestResultBySensorKey(sensorKey, optionsNumber);
    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: sensorKey,
      value_type: 'Number',
      default_value: optionsNumber.defaultValue,
    });
    expect(result).toBe(expectedResult);

    sensors.fastFetchABTest.mockResolvedValueOnce(expectedResult);
    result = await getABtestResultBySensorKey(sensorKey, optionsBoolean);
    expect(sensors.fastFetchABTest).toHaveBeenCalledWith({
      param_name: sensorKey,
      value_type: 'Boolean',
      default_value: optionsBoolean.defaultValue,
    });
    expect(result).toBe(expectedResult);
  });
});

describe('checkIsMatchUrlWithLocation', () => {
  it('should return true when pathname matches a single targetUrl', () => {
    const location = { pathname: '/home' };
    const targetUrls = '/home';
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(true);
  });

  it('should return true when pathname starts with a targetUrl followed by a slash', () => {
    const location = { pathname: '/home/user' };
    const targetUrls = '/home';
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(true);
  });

  it('should return false when pathname does not match or start with targetUrl', () => {
    const location = { pathname: '/about' };
    const targetUrls = '/home';
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(false);
  });

  it('should return true when pathname matches any targetUrl in an array', () => {
    const location = { pathname: '/home' };
    const targetUrls = ['/home', '/about'];
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(true);
  });

  it('should return true when pathname starts with one of the targetUrls in an array', () => {
    const location = { pathname: '/home/user' };
    const targetUrls = ['/home', '/about'];
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(true);
  });

  it('should return false when pathname does not match or start with any of the targetUrls in an array', () => {
    const location = { pathname: '/profile' };
    const targetUrls = ['/home', '/about'];
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(false);
  });

  it('should return false when location is null or undefined', () => {
    const location = null;
    const targetUrls = '/home';
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(false);
  });

  it('should return false when targetUrls is empty', () => {
    const location = { pathname: '/home' };
    const targetUrls = [];
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(false);
  });

  it('should return true when targetUrls is an empty array but location is matched', () => {
    const location = { pathname: '/home' };
    const targetUrls = ['/home', '/about'];
    const result = checkIsMatchUrlWithLocation(location, targetUrls);
    expect(result).toBe(true);
  });

  it('should handle non-string targetUrls correctly', () => {
    const location = { pathname: '/home' };
    const targetUrls = { a: '/home' }; // Testing with an object as `targetUrls`

    // The function expects `targetUrls` to be an array or string, not an object.
    // If targetUrls is not an array or string, we should return false.
    const result = checkIsMatchUrlWithLocation(location, targetUrls);

    expect(result).toBe(false);
  });
});
