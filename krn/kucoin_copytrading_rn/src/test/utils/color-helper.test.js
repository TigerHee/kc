import {enhanceColors} from 'constants';
import {getEnhanceColorByType, isLight} from 'utils/color-helper';

// Mock dependencies
jest.mock('constants', () => ({
  enhanceColors: {
    light: {
      primary: '#000000',
      secondary: '#ffffff',
    },
    dark: {
      primary: '#ffffff',
      secondary: '#000000',
    },
  },
}));

describe('color-helper.js', () => {
  describe('getEnhanceColorByType', () => {
    it('should return light theme colors when themeType is light', () => {
      const result = getEnhanceColorByType('light');
      expect(result).toBe(enhanceColors.light);
    });

    it('should return dark theme colors when themeType is dark', () => {
      const result = getEnhanceColorByType('dark');
      expect(result).toBe(enhanceColors.dark);
    });

    it('should return specific color from light theme', () => {
      const result = getEnhanceColorByType('light', 'primary');
      expect(result).toBe('#000000');
    });

    it('should return specific color from dark theme', () => {
      const result = getEnhanceColorByType('dark', 'primary');
      expect(result).toBe('#ffffff');
    });

    it('should return undefined for non-existent color key', () => {
      const result = getEnhanceColorByType('light', 'nonexistent');
      expect(result).toBeUndefined();
    });

    it('should default to light theme when themeType is not provided', () => {
      const result = getEnhanceColorByType();
      expect(result).toBe(enhanceColors.light);
    });

    it('should return all colors when colorKey is not provided', () => {
      const result = getEnhanceColorByType('light');
      expect(result).toEqual(enhanceColors.light);
    });
  });

  describe('isLight', () => {
    it('should return true for light theme type', () => {
      expect(isLight('light')).toBe(true);
    });

    it('should return false for dark theme type', () => {
      expect(isLight('dark')).toBe(false);
    });

    it('should return false for any other theme type', () => {
      expect(isLight('custom')).toBe(false);
      expect(isLight('')).toBe(false);
      expect(isLight(null)).toBe(false);
      expect(isLight(undefined)).toBe(false);
    });
  });
});
