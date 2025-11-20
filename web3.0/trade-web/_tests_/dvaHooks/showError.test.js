import {
  UNAUTH,
  NO_UPGRADE,
  LOGIN_INVALID,
  ACCOUNT_FROZEN,
  CHECK_LOGIN_SECURITY_FAILED,
} from 'codes';
import { siteCfg } from 'config';
import showError from 'src/dvaHooks/showError';

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

jest.mock('codes', () => ({
  UNAUTH: 'UNAUTH',
  NO_UPGRADE: 'NO_UPGRADE',
  LOGIN_INVALID: 'LOGIN_INVALID',
  ACCOUNT_FROZEN: 'ACCOUNT_FROZEN',
  CHECK_LOGIN_SECURITY_FAILED: 'CHECK_LOGIN_SECURITY_FAILED',
}));

jest.mock('config', () => ({
  siteCfg: {
    MAINSITE_HOST: 'http://main.site',
  },
}));

jest.mock('utils/lang', () => ({
  addLangToPath: jest.fn((path) => path),
}));

describe('showError', () => {
  beforeEach(() => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });
  });

  it('should handle CHECK_LOGIN_SECURITY_FAILED error', () => {
    const dispatch = jest.fn();
    const error = {
      code: CHECK_LOGIN_SECURITY_FAILED,
      preventDefault: jest.fn(),
      data: {
        needActions: false,
      },
    };

    showError().onError(error, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'login/update',
      payload: {
        security: false,
        needActions: error.data.needActions,
      },
    });
  });

  it('should handle UNAUTH error', () => {
    const dispatch = jest.fn();
    const error = {
      code: UNAUTH,
      preventDefault: jest.fn(),
    };

    showError().onError(error, dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: 'app/clearSessionData' });
  });

  it('should handle LOGIN_INVALID error', () => {
    const dispatch = jest.fn();
    const error = {
      msg: 'msg',
      code: LOGIN_INVALID,
      preventDefault: jest.fn(),
    };

    showError().onError(error, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'notice/feed',
      payload: {
        type: 'message.error',
        message: error.msg,
      },
    });
  });

  it('should handle ACCOUNT_FROZEN error', () => {
    const dispatch = jest.fn();
    const error = {
      code: ACCOUNT_FROZEN,
      preventDefault: jest.fn(),
    };

    showError().onError(error, dispatch);

    expect(window.location.href).toBe(`${siteCfg.MAINSITE_HOST}/freeze`);
  });

  it('should handle NO_UPGRADE error', () => {
    const dispatch = jest.fn();
    const error = {
      code: NO_UPGRADE,
      preventDefault: jest.fn(),
    };

    showError().onError(error, dispatch);

    expect(window.location.href).toBe(`${siteCfg.MAINSITE_HOST}/utransfer`);
  });

  it('should handle warning message', () => {
    const dispatch = jest.fn();
    const error = {
      msg: 'msg',
      code: '999',
      level: 'warning',
      preventDefault: jest.fn(),
    };

    showError().onError(error, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'notice/feed',
      payload: {
        type: 'message.warning',
        message: error.msg,
      },
    });
  });

  it('should handle error message', () => {
    const dispatch = jest.fn();
    const error = {
      msg: 'msg',
      code: '999',
      level: 'error',
      preventDefault: jest.fn(),
    };

    showError().onError(error, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'notice/feed',
      payload: {
        type: 'message.error',
        message: error.msg,
      },
    });
  });

  it('should handle response', () => {
    const dispatch = jest.fn();
    const error = {
      code: '999',
      preventDefault: jest.fn(),
      response: {
        status: 401,
      },
    };

    showError().onError(error, dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'app/clearSessionData',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'user/update', payload: { isLogin: false },
    });
  });
});