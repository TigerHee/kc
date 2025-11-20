/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const { default: useInterval } = require('src/hooks/useInterval');

jest.useFakeTimers();

describe('useInterval', () => {
  it('should not execute the callback function when delay is 0', () => {
    const callback = jest.fn();
    const delay = 0;
    renderHook(() => useInterval(callback, delay));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not execute the callback function when delay is less than 0', () => {
    const callback = jest.fn();
    const delay = -1;
    renderHook(() => useInterval(callback, delay));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should execute the callback function every interval', () => {
    const callback = jest.fn();
    const delay = 1000;
    const { unmount } = renderHook(() => useInterval(callback, delay));
    expect(callback).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
    }, 1000);

    unmount();
  });

  it('should execute the callback function immediately if immediate option is true', () => {
    const callback = jest.fn();
    const delay = 1000;
    const { unmount } = renderHook(() => useInterval(callback, delay, { immediate: true }));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not set interval if delay is not a number', () => {
    const callback = jest.fn();
    const delay = undefined;
    renderHook(() => useInterval(callback, delay, { immediate: true }));
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('should not set interval if immediate is not a boolean', () => {
    const callback = jest.fn();
    const delay = 1;
    renderHook(() => useInterval(callback, delay, { immediate: undefined }));
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
