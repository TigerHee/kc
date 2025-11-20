/**
 * Owner: larvide.peng@kupotech.com
 */

import { act, renderHook } from '@testing-library/react-hooks';
import useRealInteraction from 'src/hooks/useRealInteraction';

jest.useFakeTimers();
describe('useRealInteraction', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should return pass as true after the specified stay duration', () => {
    const { result } = renderHook(() => useRealInteraction());

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.pass).toBe(false);
    expect(result.current.passType).toBe('');
  });

  it('should return pass as true after user interaction (mousemove)', () => {
    const { result } = renderHook(() => useRealInteraction());

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove'));
    });

    expect(result.current.pass).toBe(true);
    expect(result.current.passType).toBe('moveCheck');
  });

  it('should return pass as true after user interaction (touchmove)', () => {
    const { result } = renderHook(() => useRealInteraction());

    act(() => {
      window.dispatchEvent(new TouchEvent('touchmove'));
    });

    expect(result.current.pass).toBe(true);
    expect(result.current.passType).toBe('moveCheck');
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useRealInteraction());

    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
  });

  it('should clear timeout on unmount', () => {
    const { unmount } = renderHook(() => useRealInteraction({ stayDuration: 5000 }));

    unmount();
    expect(clearTimeout).toHaveBeenCalled();
  });
});
