/*
 * Owner: jesse.shao@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useDomVisible from 'src/hooks/useDomVisible';

describe('useDomVisible', () => {
  it('should disconnect IntersectionObserver on unmount', () => {
    const mockDisconnect = jest.fn();
    const callback = jest.fn();
    const mockDomRef = { current: document.createElement('div') };

    window.IntersectionObserver = jest.fn(function () {
      this.observe = jest.fn();
      this.disconnect = mockDisconnect;
    });

    const { unmount } = renderHook(() => useDomVisible(mockDomRef, callback));

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

describe('useDomVisible', () => {
  it('should do nothing if domRef is invalid', () => {
    const mockObserve = jest.fn();
    const mockCallback = jest.fn();
    const mockDomRef = { current: null };

    window.IntersectionObserver = jest.fn(function () {
      this.observe = mockObserve;
    });

    renderHook(() => useDomVisible(mockDomRef, mockCallback));

    expect(window.IntersectionObserver).not.toHaveBeenCalled();
  });
});
