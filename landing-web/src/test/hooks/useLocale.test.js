/*
 * Owner: terry@kupotech.com
 */
import { useSelector } from 'dva';
import { renderHook } from '@testing-library/react-hooks';
import { useLocale } from 'hooks/useLocale';

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      KuRewards: {
        imgUrl0: 'imgUrl1',
      },
      app: {},
      user: {},
    })),
  };
});

describe('useLocale', () => {
  afterEach(() => {
    useSelector.mockClear();
  });

  it('currentLang', () => {
    const mockState = {
      app: {
        currentLang: 'zh_HK',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result: { current } = {} } = renderHook(() => useLocale());
    expect(current).toBeDefined();
    expect(current.currentLang).toEqual('zh_HK')
  })

  it('isRTL', () => {
    const mockState = {
      app: {
        currentLang: 'ar_AE',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result: { current } = {} } = renderHook(() => useLocale());
    expect(current).toBeDefined();
    expect(current.isRTL).toEqual(true)
  })

  it('isRussian', () => {
    const mockState = {
      app: {
        currentLang: 'ru_RU',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result: { current } = {} } = renderHook(() => useLocale());
    expect(current).toBeDefined();
    expect(current.isRussian).toEqual(true)
  })

  it('isES', () => {
    const mockState = {
      app: {
        currentLang: 'es_ES',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result: { current } = {} } = renderHook(() => useLocale());
    expect(current).toBeDefined();
    expect(current.isES).toEqual(true)
  })

  it('isPL', () => {
    const mockState = {
      app: {
        currentLang: 'pl_PL',
      }
    }
    useSelector.mockImplementation((selector) => selector(mockState));
    const { result: { current } = {} } = renderHook(() => useLocale());
    expect(current).toBeDefined();
    expect(current.isPL).toEqual(true)
  })
})

