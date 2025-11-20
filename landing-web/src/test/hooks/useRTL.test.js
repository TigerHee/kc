/*
 * Owner: melon@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useRTL from 'src/hooks/useRTL';

import { useSelector } from 'dva';

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      app: {
        currentLang: 'en_US'
      },
      user: {},
      categories: {},
    })),
  };
});

describe('useRTL Func', () => {
  afterEach(() => {
    useSelector.mockClear();
  });
  it('test useRTL', () => {
    const mockState = {
      app: {
        currentLang: 'en_US',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result } = renderHook(() => useRTL());
    expect(result.current).toBeDefined();
  });
});
