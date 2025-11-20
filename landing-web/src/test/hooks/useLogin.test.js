/**
 * Owner: jesse@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useLogin from 'src/hooks/useLogin';
import { useSelector, useDispatch } from 'dva';
import jsBridge from 'utils/jsBridge';
import { gotoAppLogin } from '@knb/native-bridge/lib/BizBridge';

jest.mock('dva');
jest.mock('utils/jsBridge');
jest.mock('@knb/native-bridge/lib/BizBridge', () => ({
  gotoAppLogin: jest.fn(),
}))

describe('useLogin', () => {
  let state = {
    user: {
      isLogin: false,
    },
    app: {
      isInApp: false,
    },
  };
  let mockDispatch;
  let spyJsBridgeOpen;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(cb => cb(state));

    spyJsBridgeOpen = jest.spyOn(jsBridge, 'open').mockImplementation((payload, callback) => {
      callback && callback({ code: 0 });
    });
  });

  afterEach(() => {
    spyJsBridgeOpen.mockClear();
  });

  it.skip('returns undefined as the previous value on the first render', () => {
    const onLoginChange = jest.fn();
    const { result } = renderHook(() => useLogin(onLoginChange));
    expect(result.current.handleLogin).toBeDefined();
    expect(result.current.handleLogin(() => { })).toBeUndefined();
    expect(result.current.handleLogout()).toBeUndefined();
  });

  it('show login drawer when login in non-app', () => {
    state.app.isInApp = false;
    const onLoginChange = jest.fn();
    const { result } = renderHook(() => useLogin(onLoginChange));
    result.current.handleLogin();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/update',
      payload: {
        showLoginDrawer: true,
      },
    });
  });

  it('dispatch user/logout action when logout in non-app', () => {
    state.app.isInApp = false;
    const onLoginChange = jest.fn();
    const { result } = renderHook(() => useLogin(onLoginChange));
    result.current.handleLogout();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'user/logout',
    });
  });

  it('jump to user/login page without params when login in app', () => {
    state.app.isInApp = true;
    const onLoginChange = jest.fn();
    const { result } = renderHook(() => useLogin(onLoginChange));
    result.current.handleLogin();
    expect(gotoAppLogin).toBeCalled();
  });

  it('jump to user/login page with params when login in app', () => {
    state.app.isInApp = true;
    const onLoginChange = jest.fn();
    const { result } = renderHook(() => useLogin(onLoginChange));
    result.current.handleLogin('?a=1');
    expect(gotoAppLogin).toBeCalled()
  });

  it('call logout func when logout in app', () => {
    state.app.isInApp = true;
    const onLoginChange = jest.fn();
    const { result } = renderHook(() => useLogin(onLoginChange));
    result.current.handleLogout();
    expect(spyJsBridgeOpen).toHaveBeenCalledWith({
      type: 'func',
      params: {
        name: 'logout',
      },
    }, expect.any(Function));
  });

  it('call onLoginChange callback when isLogin changed: false => true', () => {
    state.user.isLogin = false;
    const onLoginChange = jest.fn();
    const { rerender } = renderHook(() => useLogin(onLoginChange));
    state.user.isLogin = true;
    rerender();
    expect(onLoginChange).toHaveBeenCalled();
  });

  it('call onLoginChange callback when isLogin changed: true => false', () => {
    state.user.isLogin = true;
    const onLoginChange = jest.fn();
    const { rerender } = renderHook(() => useLogin(onLoginChange));
    state.user.isLogin = false;
    rerender();
    expect(onLoginChange).toHaveBeenCalled();
  });
});
