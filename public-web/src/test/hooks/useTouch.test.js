/**
 * Owner: chris@kupotech.com
 */
const { default: useTouch } = require('src/hooks/useTouch');
import { act, renderHook } from '@testing-library/react-hooks';

jest.mock('@kux/mui/hooks', () => ({
  useEventCallback: (fn) => fn,
}));

describe('useTouch', () => {
  // Mocking addEventListener and removeEventListener
  const addEventListenerSpy = jest.spyOn(document.body, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(document.body, 'removeEventListener');

  const mockCallbacks = {
    leftCallback: jest.fn(),
    rightCallback: jest.fn(),
    topCallback: jest.fn(),
    bottomCallback: jest.fn(),
    touchConfig: {},
  };

  beforeEach(() => {
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
    mockCallbacks.leftCallback.mockClear();
    mockCallbacks.rightCallback.mockClear();
    mockCallbacks.topCallback.mockClear();
    mockCallbacks.bottomCallback.mockClear();
  });

  it('should attach event listeners when enabled', () => {
    const { rerender } = renderHook(() => useTouch({ ...mockCallbacks, enable: true }));

    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), false);
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function), false);

    // Now let's disable the hook and check if listeners are removed
    rerender(() => useTouch({ ...mockCallbacks, enable: false }));

    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), false);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function), false);
  });

  it('should call leftCallback on left swipe', () => {
    const touchStartEvent = {
      touches: [{ clientX: 0, clientY: 0 }],
    };
    const touchEndEvent = {
      changedTouches: [{ clientX: 150, clientY: 0 }],
    };

    renderHook(() => useTouch({ ...mockCallbacks, enable: true }));

    // Simulate left swipe
    act(() => {
      document.body.dispatchEvent(new TouchEvent('touchstart', touchStartEvent));
      document.body.dispatchEvent(new TouchEvent('touchend', touchEndEvent));
    });

    expect(mockCallbacks.leftCallback).toHaveBeenCalled();
  });

  it('should call leftCallback on right swipe', () => {
    const touchStartEvent = {
      touches: [{ clientX: 150, clientY: 0 }],
    };
    const touchEndEvent = {
      changedTouches: [{ clientX: 0, clientY: 0 }],
    };

    renderHook(() => useTouch({ ...mockCallbacks, enable: true }));

    // Simulate left swipe
    act(() => {
      document.body.dispatchEvent(new TouchEvent('touchstart', touchStartEvent));
      document.body.dispatchEvent(new TouchEvent('touchend', touchEndEvent));
    });

    expect(mockCallbacks.rightCallback).toHaveBeenCalled();
  });

  it('should call leftCallback on bottom swipe', () => {
    const touchStartEvent = {
      touches: [{ clientX: 0, clientY: 0 }],
    };
    const touchEndEvent = {
      changedTouches: [{ clientX: 0, clientY: 200 }],
    };

    renderHook(() =>
      useTouch({
        ...mockCallbacks,
        enable: true,
        touchConfig: null,
      }),
    );

    // Simulate left swipe
    act(() => {
      document.body.dispatchEvent(new TouchEvent('touchstart', touchStartEvent));
      document.body.dispatchEvent(new TouchEvent('touchend', touchEndEvent));
    });

    expect(mockCallbacks.bottomCallback).toHaveBeenCalled();
  });

  it('should call leftCallback on top swipe', () => {
    const touchStartEvent = {
      touches: [{ clientX: 0, clientY: 200 }],
    };
    const touchEndEvent = {
      changedTouches: [{ clientX: 0, clientY: 0 }],
    };

    renderHook(() => useTouch({ ...mockCallbacks, enable: true }));

    // Simulate left swipe
    act(() => {
      document.body.dispatchEvent(new TouchEvent('touchstart', touchStartEvent));
      document.body.dispatchEvent(new TouchEvent('touchend', touchEndEvent));
    });

    expect(mockCallbacks.topCallback).toHaveBeenCalled();
  });

  // Additional tests for the rightCallback, topCallback, and bottomCallback should be similar
  // You would need to create the corresponding touchStartEvent and touchEndEvent for each case

  // ... other tests ...
  it('should call bottomCallback when swiping down and conditions are met', () => {
    const bottomCallback = jest.fn();
    const touchConfig = {
      maxTouchYId: 'testId',
      maxTouchYField: 'bottom',
    };
    const { result } = renderHook(() =>
      useTouch({
        enable: true,
        leftCallback: jest.fn(),
        rightCallback: jest.fn(),
        topCallback: jest.fn(),
        bottomCallback: bottomCallback,
        touchConfig,
      }),
    );

    const mockTouchStartEvent = {
      touches: [{ clientX: 0, clientY: 0 }],
    };
    const mockTouchEndEvent = {
      changedTouches: [{ clientX: 0, clientY: 150 }],
    };

    const mockElement = {
      getBoundingClientRect: () => ({ bottom: 50 }),
    };
    document.querySelector = jest.fn(() => mockElement);
    act(() => {
      document.body.dispatchEvent(new TouchEvent('touchstart', mockTouchStartEvent));
      document.body.dispatchEvent(new TouchEvent('touchend', mockTouchEndEvent));
    });
    expect(bottomCallback).toHaveBeenCalled();
  });

  afterEach(() => {
    // Remove any listeners added during the tests
    document.body.removeEventListener('touchstart', expect.any(Function), false);
    document.body.removeEventListener('touchend', expect.any(Function), false);
  });
});
