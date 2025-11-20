/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { act, renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import useAppInit from 'TradeActivity/hooks/useAppInit';

// Mock the dependencies
jest.mock('@knb/native-bridge');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useAppInit', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    JsBridge.isApp.mockReturnValue(true);
    window.onListenEvent = jest.fn();
    window.DCLTIME = 1234;
    window._useSSG = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch initApp action on login event', () => {
    renderHook(() => useAppInit());
    expect(window.onListenEvent).toHaveBeenCalledWith('onLogin', expect.any(Function));
    const loginCallback = window.onListenEvent.mock.calls[0][1];

    act(() => {
      loginCallback();
    });

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'app/initApp',
    });
  });

  it('should call JsBridge.open with correct parameters on page mount', () => {
    jest.useFakeTimers();
    renderHook(() => useAppInit());

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(JsBridge.open).toHaveBeenCalledWith({
      type: 'event',
      params: {
        name: 'onPageMount',
        dclTime: 1234,
        pageType: 'CSR',
      },
    });

    jest.useRealTimers();
  });

  it('should clear timeout on unmount', () => {
    jest.useFakeTimers();
    const { unmount } = renderHook(() => useAppInit());
    unmount();
    expect(clearTimeout).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should not do anything if not in app', () => {
    JsBridge.isApp.mockReturnValue(false);
    renderHook(() => useAppInit());
    expect(window.onListenEvent).not.toHaveBeenCalled();
    expect(JsBridge.open).not.toHaveBeenCalled();
  });
});
