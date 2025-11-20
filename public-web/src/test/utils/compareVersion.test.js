/**
 * Owner: saiya.lee@kupotech.com
 */
import compareVersion from 'utils/compareVersion';

describe('compareVersion', () => {
  const cases = [
    ['1.0.0', '1.0.0', 0],
    ['1.0.0', '1.0.1', -1],
    ['1.0.0', '1.0.0', 0],
    ['0', '0', 0],
    ['0', '1', -1],
    ['1', '0', 1],
  ]
  it.each(cases)('compareVersion(%s, %s) should return %s', (v1, v2, expected) => {
    expect(compareVersion(v1, v2)).toBe(expected);
  });
});
