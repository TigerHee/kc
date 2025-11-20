import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import useIsMobile from 'src/trade4.0/hooks/common/useIsMobile.js';

describe('useIsMobile', () => {
  let originalUserAgent;

  beforeEach(() => {
    // 保存原始的 userAgent
    originalUserAgent = jest.spyOn(window.navigator, 'userAgent', 'get');
  });

  it('should return true for mobile user agents', () => {
    const mobileUserAgents = [
      'Mobi',
      'Android',
      'webOS',
      'iPhone',
      'iPad',
      'iPod',
      'BlackBerry',
      'IEMobile',
      'Opera Mini',
    ];

    mobileUserAgents.forEach((userAgent) => {
      // 设置 userAgent
      originalUserAgent.mockReturnValue(userAgent);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(true);
    });

     // 设置 userAgent为空 opera 为Opera Mini
     global.opera = 'Opera Mini';
     originalUserAgent.mockReturnValue(undefined);
     const { result } = renderHook(() => useIsMobile());
     expect(result.current).toBe(true);
  });

  it('should return false for non-mobile user agents', () => {
    const nonMobileUserAgents = ['Windows NT', 'Macintosh', 'Linux'];
    nonMobileUserAgents.forEach((userAgent) => {
      // 设置 userAgent
      originalUserAgent.mockReturnValue(userAgent);
      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);
    });
  });
});
