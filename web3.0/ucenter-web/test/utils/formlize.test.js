/**
 * Owner: eli.xiang@kupotech.com
 */
import formlize from 'src/utils/formlize';

describe('formlize', () => {
  test('should convert a plain object to FormData', () => {
    const obj = { name: 'John', age: 30 };
    const formData = formlize(obj);

    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBe('30');
  });

  test('should ignore undefined values', () => {
    const obj = { name: 'John', age: undefined };
    const formData = formlize(obj);

    expect(formData.get('name')).toBe('John');
    expect(formData.has('age')).toBe(false);
  });

  test('should return the same FormData instance if passed', () => {
    const formData = new FormData();
    formData.append('existing', 'value');

    const result = formlize(formData);

    expect(result).toBe(formData);
    expect(result.get('existing')).toBe('value');
  });

  test('should handle empty objects', () => {
    const obj = {};
    const formData = formlize(obj);

    expect(formData.has('name')).toBe(false);
  });

  test('should handle null values by ignoring them', () => {
    const obj = { name: 'John', age: null };
    const formData = formlize(obj);

    expect(formData.get('name')).toBe('John');
    expect(formData.has('age')).toBe(true);
  });
});
