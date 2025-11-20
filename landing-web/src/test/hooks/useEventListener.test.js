/*
 * Owner: jesse.shao@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useEventListener from 'src/hooks/useEventListener';

describe('useEventListener', () => {
  it('should add event listener to window when element is not provided', () => {
    const eventName = 'click';
    const handler = jest.fn();
    const { unmount } = renderHook(() => useEventListener(eventName, handler));

    window.dispatchEvent(new Event(eventName));
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();

    window.dispatchEvent(new Event(eventName));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should add event listener to provided element', () => {
    const eventName = 'click';
    const handler = jest.fn();
    const element = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useEventListener(eventName, handler, element));

    element.current.dispatchEvent(new Event(eventName));
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();

    element.current.dispatchEvent(new Event(eventName));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener on cleanup', () => {
    const eventName = 'click';
    const handler = jest.fn();
    const element = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useEventListener(eventName, handler, element));

    element.current.dispatchEvent(new Event(eventName));
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();

    element.current.dispatchEvent(new Event(eventName));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
