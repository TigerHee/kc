/**
 * Owner: garuda@kupotech.com
 */

import { render } from '@testing-library/react';
import { colors, fx, styleCombine, mediaLayout, withMedia, withStyle } from '@/style/emotion';
import React from 'react';

jest.mock('@/components/ComponentWrapper/context', () => ({
  ScreenContext: {
    Consumer: ({ children }) => children('desktop'),
  },
}));

// Mock the theme for the props
const theme = {
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
  },
};

const MockComponent = React.forwardRef(({ $colors, $media, $screen, ...props }, ref) => (
  <div ref={ref} {...props} style={{ color: $colors('primary') }}>
    Mock Component
  </div>
));

describe('style utilities', () => {
  describe('colors function', () => {
    it('should return the correct color from theme', () => {
      const props = { theme };
      expect(colors(props, 'primary')).toBe('#ff0000');
    });

    it('should return an empty string if color key does not exist', () => {
      const props = { theme };
      expect(colors(props, 'nonExisting')).toBe('');
    });

    it('should return an empty string if props are not defined', () => {
      expect(colors(undefined, 'primary')).toBe('');
    });
  });

  describe('fx utility functions', () => {
    // An array of test cases with the function name, input arguments, and expected result
    const testCases = [
      ['display', ['block'], 'display: block;'],
      ['width', [100], 'width: 100px;'],
      ['minWidth', [50], 'min-width: 50px;'],
      ['maxWidth', [200, '%'], 'max-width: 200%;'],
      ['height', [100], 'height: 100px;'],
      ['minHeight', [50], 'min-height: 50px;'],
      ['maxHeight', [200, 'vh'], 'max-height: 200vh;'],
      ['cursor', [], 'cursor: pointer;'],
      ['cursor', ['grab'], 'cursor: grab;'],
      ['lineHeight', [], 'line-height: 14px;'],
      ['lineHeight', [20, 'em'], 'line-height: 20em;'],
      ['overflow', ['hidden'], 'overflow: hidden;'],
      ['textAlign', ['center'], 'text-align: center;'],
      ['border', [], 'border: 1px solid;'],
      ['border', ['2px dashed'], 'border: 2px dashed;'],
      ['borderBottom', [], 'border-bottom: 1px solid;'],
      ['borderRadius', ['5px'], 'border-radius: 5px;'],
      ['borderColor', ['red'], 'border-color: red;'],
      ['borderWidth', [2], 'border-width: 2px;'],
      ['borderStyle', ['dotted'], 'border-style: dotted;'],
      ['padding', ['10px'], 'padding: 10px;'],
      ['paddingLeft', [5], 'padding-left: 5px;'],
      ['paddingRight', [5, 'em'], 'padding-right: 5em;'],
      ['paddingBottom', [10, '%'], 'padding-bottom: 10%;'],
      ['paddingTop', [3, 'rem'], 'padding-top: 3rem;'],
      ['margin', ['10px'], 'margin: 10px;'],
      ['marginLeft', [5], 'margin-left: 5px;'],
      ['marginLeft', [5, 'em'], 'margin-left: 5em;'],
      ['marginRight', [5], 'margin-right: 5px;'],
      ['marginRight', [5, 'em'], 'margin-right: 5em;'],
      ['marginBottom', [10], 'margin-bottom: 10px;'],
      ['marginBottom', [10, '%'], 'margin-bottom: 10%;'],
      ['marginTop', [3], 'margin-top: 3px;'],
      ['marginTop', [3, 'rem'], 'margin-top: 3rem;'],
      ['background', ['red'], 'background: red;'],
      [
        'backgroundColor',
        [{ theme: { colors: { key: 'blue' } } }, 'key'],
        'background-color: blue;',
      ],
      ['backgroundImage', ['url(image.png)'], 'background-image: url(image.png);'],
      ['backgroundRepeat', [undefined], 'background-repeat: no-repeat;'],
      ['backgroundPosition', ['top right'], 'background-postion: top right;'],
      ['backgroundSize', ['cover'], 'background-size: cover;'],
      ['font', ['12px Arial'], 'font: 12px Arial;'],
      ['fontSize', [16, 'px'], 'font-size: 16px;'],
      ['fontSize', [], 'font-size: 14px;'],
      ['fontFamily', ['Arial'], 'font-family: Arial;'],
      ['fontFace', ['Arial'], 'font-face: Arial;'],
      ['fontWeight', [300], 'font-weight: 300;'],
      ['fontWeight', [], 'font-weight: 400;'],
      ['color', [{ theme: { colors: { key: 'black' } } }, 'key'], 'color: black;'],
      ['textDecoration', ['underline'], 'text-decoration: underline'],
      ['alignItems', ['center'], 'align-items: center;'],
      ['justifyContent', ['space-between'], 'justify-content: space-between;'],
      ['flexWrap', ['wrap'], 'flex-wrap: wrap;'],
      ['flexFlow', ['row nowrap'], 'flex-flow: row nowrap;'],
      ['flexShrink', [0], 'flex-shrink: 0;'],
      ['flex', ['1'], 'flex: 1;'],
      ['alignContent', ['stretch'], 'align-content: stretch;'],
      ['position', ['absolute'], 'position: absolute;'],
      ['transform', ['rotate(90deg)'], 'transform: rotate(90deg);'],
      ['wordBreak', ['break-all'], 'word-break: break-all;'],
    ];

    // Iterate over the test cases
    test.each(testCases)('%s with args %j returns %s', (fnName, args, expected) => {
      // Call the function with the provided arguments
      const result = fx[fnName](...args);
      // Assert the result is as expected
      expect(result).toBe(expected);
    });
  });

  describe('styleCombine function', () => {
    it('should combine styles correctly', () => {
      const target = { color: 'red' };
      const styles = { backgroundColor: 'blue' };
      const combinedStyles = styleCombine(target, styles);
      expect(combinedStyles).toEqual({ color: 'red', backgroundColor: 'blue' });
    });

    it('should not override existing styles', () => {
      const target = { color: 'red' };
      const styles = { color: 'blue' };
      const combinedStyles = styleCombine(target, styles);
      expect(combinedStyles).toEqual({ color: 'blue' });
    });

    it('should return target', () => {
      const target = { color: 'red' };
      const combinedStyles = styleCombine(target);
      expect(combinedStyles).toEqual({ color: 'red' });
    });
  });

  describe('mediaLayout function', () => {
    it('should return code if screen matches point', () => {
      expect(mediaLayout('mobile', 'mobile', 'display: none;')).toBe('display: none;');
    });

    it('should return an empty string if screen does not match point', () => {
      expect(mediaLayout('mobile', 'desktop', 'display: none;')).toBe('');
    });
  });
});

describe('withStyle HOC', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should pass the correct styles to the wrapped component', () => {
    const WithStyleComponent = withStyle(MockComponent);
    const { getByText } = render(<WithStyleComponent theme={theme} />);
    const element = getByText('Mock Component');
    expect(element).toHaveStyle('color: #ff0000'); // Assuming 'primary' is set to '#ff0000' in the theme
  });
});

describe('withMedia HOC', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should pass the correct screen context to the wrapped component', () => {
    const WithMediaComponent = withMedia('ScreenContext', MockComponent);
    const { getAllByText } = render(<WithMediaComponent theme={theme} />);
    const element = getAllByText('Mock Component');
    expect(element[0]).toHaveStyle('color: rgb(255, 0, 0)'); // Assuming 'primary' is set to '#ff0000' in the theme
  });
});
