/**
 * Owner: eli.xiang@kupotech.com
 */
import showDatetime from 'src/utils/showDatetime';

describe('showDatetime', () => {
  test('should format timestamp correctly with default format', () => {
    const timestamp = 1633072800000; // 2021-10-01 00:00:00
    const formatted = showDatetime(timestamp);
    expect(formatted).toContain('2021/10/01');
  });

  test('should format timestamp correctly with custom format', () => {
    const timestamp = 1633072800000; // 2021-10-01 00:00:00
    const formatted = showDatetime(timestamp, 'DD-MM-YYYY');
    expect(formatted).toBe('01-10-2021');
  });

  test('should handle string timestamp input', () => {
    const timestamp = '1633072800000'; // 2021-10-01 00:00:00
    const formatted = showDatetime(timestamp);
    expect(formatted).toContain('2021/10/01');
  });

  test('should handle invalid timestamp input', () => {
    const timestamp = 'invalid';
    const formatted = showDatetime(timestamp);
    expect(formatted).toBe('Invalid date');
  });

  test('should handle negative timestamp', () => {
    const timestamp = -10000000000; // A date in the past
    const formatted = showDatetime(timestamp);
    expect(formatted).toContain('1969/09/07');
  });

  test('should handle zero timestamp', () => {
    const timestamp = 0; // 1970-01-01 00:00:00
    const formatted = showDatetime(timestamp);
    expect(formatted).toContain('1970/01/01');
  });
});
