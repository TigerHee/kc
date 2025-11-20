/*
 * Owner: jesse.shao@kupotech.com
 */
import useInterval from 'src/hooks/useInterval';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useInterval', () => {
  it('should not set interval when delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, null));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback immediately when delay is 0', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 0));

    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe('useInterval', () => {
  jest.useFakeTimers();

  it('should call callback after delay', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useInterval', () => {
  it('should update savedCallback when callback changes', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const { rerender } = renderHook(({ callback }) => useInterval(callback, 1000), {
      initialProps: { callback: callback1 },
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    rerender({ callback: callback2 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
