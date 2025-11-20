/**
 * Owner: garuda@kupotech.com
 */

import { useDispatch, useSelector } from 'dva';

import useWatchPageHidden from '@/hooks/common/useWatchPageHidden';
import lifeCycle from 'page-lifecycle';

import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('dva', () => ({
  useDispatch: jest.fn(),

  useSelector: jest.fn(),
}));

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');
  return {
    ...originalModule,
    debounce: jest.fn((fn) => fn),
  };
});

jest.mock('page-lifecycle', () => ({
  addEventListener: jest.fn(),

  removeEventListener: jest.fn(),
}));

describe('useWatchPageHidden', () => {
  let dispatch;

  let useSelectorMock;

  beforeEach(() => {
    dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    useSelectorMock = useSelector;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch correct actions on page state change', () => {
    renderHook(() => useWatchPageHidden());

    const event = { newState: 'hidden' };

    act(() => {
      lifeCycle.addEventListener.mock.calls[0][1](event);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresCommon/update',

      payload: {
        pageHidden: true,
      },
    });

    const eventVisible = { newState: 'active' };

    act(() => {
      lifeCycle.addEventListener.mock.calls[0][1](eventVisible);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresCommon/update',

      payload: {
        pageHidden: false,

        pageExpiredTimer: false,
      },
    });
  });

  it('should handle pageHidden state and timers correctly', () => {
    jest.useFakeTimers();

    useSelectorMock.mockReturnValue(true);

    renderHook(() => useWatchPageHidden());

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(dispatch).not.toHaveBeenCalledWith({
      type: 'futuresCommon/update',

      payload: { pageExpiredTimer: true },
    });

    act(() => {
      jest.advanceTimersByTime(20000);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresCommon/update',

      payload: { pageExpiredTimer: true },
    });

    jest.useRealTimers();
  });

  it('should clear interval on unmount', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'clearInterval');

    useSelectorMock.mockReturnValue(true);

    const { unmount } = renderHook(() => useWatchPageHidden());

    unmount();

    expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
  });

  it('should add and remove event listeners on mount and unmount', () => {
    const { unmount } = renderHook(() => useWatchPageHidden());

    expect(lifeCycle.addEventListener).toHaveBeenCalledWith(
      'statechange',
      expect.any(Function),
      false,
    );

    unmount();

    expect(lifeCycle.removeEventListener).toHaveBeenCalledWith(
      'statechange',
      expect.any(Function),
      false,
    );
  });
});
