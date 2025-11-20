/*
 * Owner: jesse.shao@kupotech.com
 */
import { updateQueryStringParameter } from 'utils/formatUrlWithLang';

describe('updateQueryStringParameter', () => {
  test('should return the same URI if no value is provided', () => {
    const uri = 'https://example.com?param1=value1';
    const result = updateQueryStringParameter(uri, 'param2', '');
    expect(result).toBe(uri);
  });

  test('should add a new query string parameter if it does not exist', () => {
    const uri = 'https://example.com?param1=value1';
    const result = updateQueryStringParameter(uri, 'param2', 'value2');
    expect(result).toBe('https://example.com?param1=value1&param2=value2');
  });

  test('should update the existing query string parameter with the new value', () => {
    const uri = 'https://example.com?param1=value1';
    const result = updateQueryStringParameter(uri, 'param1', 'newValue1');
    expect(result).toBe('https://example.com?param1=newValue1');
  });

  test('should handle URIs without any query string parameters', () => {
    const uri = 'https://example.com';
    const result = updateQueryStringParameter(uri, 'param1', 'value1');
    expect(result).toBe('https://example.com?param1=value1');
  });
});
