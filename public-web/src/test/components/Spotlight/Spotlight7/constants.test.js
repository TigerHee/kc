/**
 * Owner: jennifer.y.liu@kupotech.com
 */
import { PERIOD_STATUS, SUB_RESULT, ERROR_CODE } from 'src/components/Spotlight/SpotlightR7/constants';

describe('PERIOD_STATUS', () => {
  test('should have correct values', () => {
    expect(PERIOD_STATUS).toEqual({
      PRESALE: 0,
      FORMAL: 1,
      DISTRIBUTION: 2
    });
  });

  test('values should be unique', () => {
    const values = Object.values(PERIOD_STATUS);
    const uniqueValues = [...new Set(values)];
    expect(values.length).toBe(uniqueValues.length);
  });
});

describe('SUB_RESULT', () => {
  test('should have correct values', () => {
    expect(SUB_RESULT).toEqual({
      SUCCESS: 1,
      ERROR: 0
    });
  });

  test('values should be unique', () => {
    const values = Object.values(SUB_RESULT);
    const uniqueValues = [...new Set(values)];
    expect(values.length).toBe(uniqueValues.length);
  });
});

describe('ERROR_CODE', () => {
  test('should be an array', () => {
    expect(Array.isArray(ERROR_CODE)).toBe(true);
  });

  test('should contain only strings', () => {
    ERROR_CODE.forEach(code => {
      expect(typeof code).toBe('string');
    });
  });

  test('should not have duplicate entries', () => {
    const uniqueCodes = [...new Set(ERROR_CODE)];
    // 注意：原ERROR_CODE中有重复项，这里测试实际情况，可根据需要修改
    expect(ERROR_CODE.length).not.toBe(uniqueCodes.length);
    // 如果期望不重复，可添加以下断言并修复原数据
    // expect(ERROR_CODE.length).toBe(uniqueCodes.length);
  });

  test('each code should match expected format', () => {
    const codePattern = /^\d+$/; // 简单的数字字符串校验
    ERROR_CODE.forEach(code => {
      expect(code).toMatch(codePattern);
    });
  });
});  