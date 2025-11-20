/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useBtnClickCheck from 'src/hooks/useBtnClickCheck';
import { useSelector } from 'dva';

jest.mock('dva', () => {
  const originalModule = jest.requireActual('dva');
  return {
    __esModule: true,
    ...originalModule,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      app: {
        isInApp: false,
      },
      user: {
        isLogin: true,
      }
    })),
  };
});

jest.mock('utils/jsBridge', () => {
  return {
    __esModule: true,
    default: {
      init: jest.fn(),
      open: jest.fn(),
      isApp: () => false,
    },
  };
});

describe('useBtnClickCheck Func', () => {
  afterEach(() => {
    useSelector.mockClear();
  });
  it('test useBtnClickCheck', () => {
    const mockState = {
      app: {
        isInApp: false,

      },
      user: {
        isLogin: true,
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result } = renderHook(() => useBtnClickCheck());
    expect(result.current?.btnClickCheck).toBeDefined();
    expect(result.current?.handleLogin).toBeDefined();
    expect(result.current?.handleLogin()).toEqual(undefined);
    expect(result.current?.btnClickCheck()).toEqual(true);

  });
  it('test useBtnClickCheck isLogin is false && in useAppLoginInApp', () => {
    const mockState = {
      app: {
        isInApp: true,
      },
      user: {
        isLogin: false,
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result } = renderHook(() => useBtnClickCheck({ useAppLoginInApp: true }));
    expect(result.current?.btnClickCheck).toBeDefined();
    expect(result.current?.handleLogin).toBeDefined();
    expect(result.current?.btnClickCheck()).toEqual(false);
  });
  it('test useBtnClickCheck isLogin is false && not in useAppLoginInApp', () => {
    const mockState = {
      app: {
        isInApp: false,
      },
      user: {
        isLogin: false,
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result } = renderHook(() => useBtnClickCheck());
    expect(result.current?.btnClickCheck()).toEqual(false);
  });
});
