/**
 * Owner: will.wang@kupotech.com
 */
import compareVersion from 'src/utils/compareVersion';


describe('compareVersion', () => {
  test('相同版本号返回 0', () => {
    expect(compareVersion('1.0.0', '1.0.0')).toBe(0);
  });

  test('v1大于v2应该返回正值', () => {
    expect(compareVersion('1.2.0', '1.1.9')).toBeGreaterThan(0);
    expect(compareVersion('2.0.0', '1.9.9')).toBeGreaterThan(0);
  });

  test('v1小于v2应该返回负值', () => {
    expect(compareVersion('1.0.0', '1.0.1')).toBeLessThan(0);
    expect(compareVersion('1.9.9', '2.0.0')).toBeLessThan(0);
  });

  test('处理不同长度版本号', () => {
    expect(compareVersion('1.0.0', '1.0')).toBe(0);
    expect(compareVersion('1.0', '1.0.1')).toBeLessThan(0);
    expect(compareVersion('1.0.1', '1.0')).toBeGreaterThan(0);
  });

  test('处理 leading zeros', () => {
    expect(compareVersion('1.01', '1.001')).toBe(0);
    expect(compareVersion('1.0.1', '1.0.01')).toBe(0);
  });
});



