/**
 * Owner: jessie@kupotech.com
 */
import toDateTs from 'utils/toDateTs';

describe('toDateTs', () => {
  test('should return the timestamp at the start of the day for a given timestamp', () => {
    const timestamp = new Date('2022-01-01 12:34:56').getTime();
    const expected = new Date('2022-01-01 00:00:00').getTime();
    expect(toDateTs(timestamp)).toBe(expected);
  });

  test('should handle timestamp at the start of the day', () => {
    const timestamp = new Date('2022-01-01 00:00:00').getTime();
    expect(toDateTs(timestamp)).toBe(timestamp);
  });

  test('should handle timestamp at the end of the day', () => {
    const timestamp = new Date('2022-01-01 23:59:59').getTime();
    const expected = new Date('2022-01-01 00:00:00').getTime();
    expect(toDateTs(timestamp)).toBe(expected);
  });
});
