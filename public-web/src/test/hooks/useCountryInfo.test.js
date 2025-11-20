/**
 * Owner: willen@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import {
  getSceneDownloadLinks,
  useGetCountryInfo,
  useIsLegalGp,
  useIsPulling,
  usePullCountryInfo,
} from 'src/hooks/useCountryInfo';

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
  };
});
jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});

test('test useConstructor', () => {
  renderHook(usePullCountryInfo);
  const { result } = renderHook(() => useGetCountryInfo());
  expect(result.current).toBe('countryInfo');
});

test('test useIsPulling', () => {
  const { result } = renderHook(() => useIsPulling());
  expect(result.current).toBe(false);
});

test('test useIsLegalGp', () => {
  const { result } = renderHook(() => useIsLegalGp());
  expect(result.current).toBe(true);
});

test('test useIsLegalGp', () => {
  const { result } = renderHook(() => useIsLegalGp());
  expect(result.current).toBe(true);
});

test('test getSceneDownloadLinks', () => {
  const { result } = renderHook(() => getSceneDownloadLinks());
  expect(result.current).toEqual({
    Guide: 'https://kucoin.onelink.me/iqEP/gmz14d5p',
    Modal: 'https://kucoin.onelink.me/iqEP/44gsnxav',
    Banner: 'https://kucoin.onelink.me/iqEP/xy0tdqd1',
  });
});

test('test getSceneDownloadLinks', () => {
  const { result } = renderHook(() => getSceneDownloadLinks({ countryCode: 1 }));
  expect(result.current).toEqual({
    Guide: 'https://kucoin.onelink.me/iqEP/gmz14d5p',
    Modal: 'https://kucoin.onelink.me/iqEP/44gsnxav',
    Banner: 'https://kucoin.onelink.me/iqEP/xy0tdqd1',
  });
});

test('test getSceneDownloadLinks', () => {
  const { result } = renderHook(() => getSceneDownloadLinks({ countryCode: 1 }, [1]));
  expect(result.current).toEqual({
    Guide: 'https://kucoin.onelink.me/iqEP/b13j8t0l',
    Modal: 'https://kucoin.onelink.me/iqEP/mq0b70uh',
    Banner: 'https://kucoin.onelink.me/iqEP/9ib4f15p',
  });
});
