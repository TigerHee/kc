/**
 * Owner: eli.xiang@kupotech.com
 */

import Decimal from 'decimal.js';
import dropZero from 'src/utils/dropZero';

jest.mock('decimal.js');

describe('dropZero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return "-" for empty string', () => {
    const result = dropZero('');
    expect(result).toBe('-');
  });

  test('should return "-" for null', () => {
    const result = dropZero(null);
    expect(result).toBe('-');
  });

  test('should return "-" for undefined', () => {
    const result = dropZero(undefined);
    expect(result).toBe('-');
  });

  test('should call Decimal and return formatted number', () => {
    const input = '123.456';
    const mockToFixed = jest.fn().mockReturnValue('123.46');
    Decimal.mockImplementation(() => ({
      toFixed: mockToFixed,
    }));

    const result = dropZero(input);

    expect(Decimal).toHaveBeenCalledWith(input);
    expect(mockToFixed).toHaveBeenCalled();
    expect(result).toBe('123.46');
  });

  test('should handle negative numbers', () => {
    const input = '-123.456';
    const mockToFixed = jest.fn().mockReturnValue('-123.46');
    Decimal.mockImplementation(() => ({
      toFixed: mockToFixed,
    }));

    const result = dropZero(input);

    expect(Decimal).toHaveBeenCalledWith(input);
    expect(mockToFixed).toHaveBeenCalled();
    expect(result).toBe('-123.46');
  });
});
