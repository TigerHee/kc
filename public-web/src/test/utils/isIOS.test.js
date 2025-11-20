/**
 * Owner: jessie@kupotech.com
 */
import isIOS from 'utils/isIOS';

describe('isIOS function', () => {
  it('should return true if the user agent indicates iOS', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'iPhone',
      writable: true,
    });
    expect(isIOS()).toBe(true);
  });

  it('should return false if the user agent does not indicate iOS', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Android',
      writable: true,
    });
    expect(isIOS()).toBe(false);
  });
});
