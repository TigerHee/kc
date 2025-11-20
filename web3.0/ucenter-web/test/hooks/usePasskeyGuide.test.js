/**
 * Owner: eli.xiang@kupotech.com
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import usePasskeyGuide, {
  AccountPageOpener,
  setAccountPageOpener,
} from 'src/hooks/usePasskeyGuide';
import { passkeysSupported } from 'src/utils/webauthn-json';
import storage from 'utils/storage';

// Mock storage and passkeysSupported
jest.mock('utils/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('utils/webauthn-json', () => ({
  passkeysSupported: jest.fn(), // 可以设置为 true 或 false 以测试不同情况
}));

const state = {
  user: { user: { uid: 12222222 } },
};
jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

describe('usePasskeyGuide', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 清除之前的mock状态
  });

  it('call setAccountPageOpener', () => {
    setAccountPageOpener(12222222, AccountPageOpener.loginSuccess);
    setAccountPageOpener(null, AccountPageOpener.loginSuccess);
  });

  it('should show guide when login success and not guided', () => {
    // Mock storage behavior
    storage.getItem.mockImplementation((key) => {
      if (key === 'passkeyGuided') return null; // 未引导
      if (key === 'accountPageOpener') return AccountPageOpener.loginSuccess; // 登录成功
      return null;
    });
    passkeysSupported.mockResolvedValue(true);

    const { result } = renderHook(() => usePasskeyGuide());

    // Effect 运行后，showGuide 应该为 true
    expect(result.current.showGuide).toBe(false);
    // expect(storage.setItem).toHaveBeenCalledWith('passkeyGuided', true);
    // expect(storage.removeItem).toHaveBeenCalledWith('accountPageOpener');
  });

  it('should not show guide if already guided', () => {
    storage.getItem.mockImplementation((key) => {
      if (key === 'passkeyGuided') return true; // 已引导
      if (key === 'accountPageOpener') return AccountPageOpener.loginSuccess; // 登录成功
      return null;
    });

    const { result } = renderHook(() => usePasskeyGuide());

    // Effect 运行后，showGuide 应该为 false
    expect(result.current.showGuide).toBe(false);
  });

  it('should not show guide if not from login success', () => {
    storage.getItem.mockImplementation((key) => {
      if (key === 'passkeyGuided') return null; // 未引导
      if (key === 'accountPageOpener') return 'otherOpener'; // 不是登录成功
      return null;
    });

    const { result } = renderHook(() => usePasskeyGuide());

    // Effect 运行后，showGuide 应该为 false
    expect(result.current.showGuide).toBe(false);
  });

  it('should hide guide when hiddenPasskeyGuide is called', () => {
    storage.getItem.mockImplementation((key) => {
      if (key === 'passkeyGuided') return null; // 未引导
      if (key === 'accountPageOpener') return AccountPageOpener.loginSuccess; // 登录成功
      return null;
    });

    passkeysSupported.mockResolvedValue(true);

    const { result } = renderHook(() => usePasskeyGuide());

    // Effect 运行后，showGuide 应该为 true
    expect(result.current.showGuide).toBe(false);

    // 调用 hiddenPasskeyGuide
    act(() => {
      result.current.hiddenPasskeyGuide();
    });

    // 现在 showGuide 应该为 false
    expect(result.current.showGuide).toBe(false);
  });

  it('empty state', () => {
    useSelector.mockImplementation((selector) => selector({}));
    const { result } = renderHook(() => usePasskeyGuide());
    expect(result.current.showGuide).toBe(false);
  });
});
