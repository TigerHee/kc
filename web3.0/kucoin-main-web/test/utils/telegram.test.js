/**
 * Owner: mike@kupotech.com
 */
import { isTelegramIDValid } from 'src/utils/telegram.js';

describe('isTelegramIDValid', () => {
  it('should return false for empty string', () => {
    expect(isTelegramIDValid('')).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isTelegramIDValid(null)).toBe(false);

    expect(isTelegramIDValid(undefined)).toBe(false);
  });

  it('should return false for strings shorter than 4 characters', () => {
    expect(isTelegramIDValid('abc')).toBe(false);
  });

  it('should return false for strings containing spaces', () => {
    expect(isTelegramIDValid('abc def')).toBe(false);

    expect(isTelegramIDValid(' abcdef')).toBe(false);

    expect(isTelegramIDValid('abcdef ')).toBe(false);
  });

  it('should return false for strings containing invalid characters', () => {
    expect(isTelegramIDValid('abc-def')).toBe(false);

    expect(isTelegramIDValid('abc.def')).toBe(false);

    expect(isTelegramIDValid('abc@def')).toBe(false);
  });

  it('should return false for strings starting with a number or underscore', () => {
    expect(isTelegramIDValid('1abcdef')).toBe(false);

    expect(isTelegramIDValid('_abcdef')).toBe(false);
  });

  it('should return false for strings ending with an underscore', () => {
    expect(isTelegramIDValid('abcdef_')).toBe(false);
  });

  it('should return true for valid Telegram IDs', () => {
    expect(isTelegramIDValid('abcd')).toBe(true);

    expect(isTelegramIDValid('abc_def')).toBe(true);

    expect(isTelegramIDValid('abc123')).toBe(true);

    expect(isTelegramIDValid('a_b_c_d')).toBe(true);
  });
});
