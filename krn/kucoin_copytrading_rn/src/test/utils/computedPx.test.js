import {convertPxToReal} from 'utils/computedPx';

// Mock dependencies
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({
      width: 750, // Mock window width
    })),
  },
}));

describe('computedPx.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('convertPxToReal', () => {
    it('should convert number to real pixels with unit', () => {
      const result = convertPxToReal(100);
      expect(result).toBe('200px'); // (750 * 100) / 375 = 200
    });

    it('should convert string with px to real pixels with unit', () => {
      const result = convertPxToReal('100px');
      expect(result).toBe('200px');
    });

    it('should convert number to real pixels without unit', () => {
      const result = convertPxToReal(100, false);
      expect(result).toBe(200);
    });

    it('should handle custom UX width', () => {
      const result = convertPxToReal(100, true, 750);
      expect(result).toBe('100px'); // (750 * 100) / 750 = 100
    });

    it('should return original value for non-numeric input', () => {
      const result = convertPxToReal('abc');
      expect(result).toBe('abc');
    });

    it('should return original value for null input', () => {
      const result = convertPxToReal(null);
      expect(result).toBe(null);
    });

    it('should return original value for undefined input', () => {
      const result = convertPxToReal(undefined);
      expect(result).toBe(undefined);
    });

    it('should return original value for empty string input', () => {
      const result = convertPxToReal('');
      expect(result).toBe('');
    });

    it('should handle zero input', () => {
      const result = convertPxToReal(0);
      expect(result).toBe(0);
    });

    it('should handle negative input', () => {
      const result = convertPxToReal(-100);
      expect(result).toBe('-200px');
    });

    it('should handle decimal input', () => {
      const result = convertPxToReal(100.5);
      expect(result).toBe('201px'); // (750 * 100.5) / 375 = 201
    });
  });
});
