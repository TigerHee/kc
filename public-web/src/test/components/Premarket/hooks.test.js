/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
const { useSelector } = require('src/hooks/useSelector');
// import { useParams } from 'react-router-dom';

const {
  useResponsiveSize,
  useProcessPercentage,
  useActivityStatus,
  useActivityItemStatus,
  usePathRedirect,
} = require('src/components/Premarket/hooks.js');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(() => jest.fn()),
  useMediaQuery: jest.fn(),
}));

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ coin: 'BTC' })),
}));

describe('test hook', () => {
  afterEach(() => {
    useSelector.mockClear();
  });

  it('test useResponsiveSize', () => {
    useResponsive.mockReturnValue({ sm: false, lg: true });
    const { result: result1 } = renderHook(() => useResponsiveSize());
    expect(result1.current).toBe('sm');

    useResponsive.mockReturnValue({ sm: true, lg: true });
    const { result: result2 } = renderHook(() => useResponsiveSize());
    expect(result2.current).toBe('lg');

    useResponsive.mockReturnValue({ sm: true, lg: false });
    const { result: result3 } = renderHook(() => useResponsiveSize());
    expect(result3.current).toBe('md');
  });

  it('test useProcessPercentage', () => {
    const { result } = renderHook(() => useProcessPercentage());
    expect(result.current).toBe('--');

    const { result: result2 } = renderHook(() => useProcessPercentage(10));
    expect(result2.current).toBe('10%');
  });

  it('test usePathRedirect', () => {
    const mockDeliveryCurrencyList = [{ shortName: 'ETH', id: '' }];
    useSelector.mockReturnValue(mockDeliveryCurrencyList);
    useDispatch.mockReturnValue(jest.fn());
    const { result } = renderHook(() => usePathRedirect());
    expect(result.current).toBe();
  });

  it('test useActivityStatus', () => {
    const mockPageInfo = { tradeStartAt: 0, tradeEndAt: 0, deliveryTime: 0 };
    useSelector.mockReturnValue(mockPageInfo);
    const { result } = renderHook(() => useActivityStatus());
    expect(result.current).toBe(0);

    const mockPageInfo1 = { tradeStartAt: 10, tradeEndAt: 10, deliveryTime: 10 };
    useSelector.mockReturnValue(mockPageInfo1);
    const { result: result1 } = renderHook(() => useActivityStatus());
    expect(result1.current).toBe(3);

    const mockPageInfo2 = { tradeStartAt: 10, tradeEndAt: 10, deliveryTime: 0 };
    useSelector.mockReturnValue(mockPageInfo2);
    const { result: result2 } = renderHook(() => useActivityStatus());
    expect(result2.current).toBe(2);

    const mockPageInfo3 = { tradeStartAt: 10, tradeEndAt: 0, deliveryTime: 0 };
    useSelector.mockReturnValue(mockPageInfo3);
    const { result: result3 } = renderHook(() => useActivityStatus());
    expect(result3.current).toBe(1);
  });

  it('test useActivityItemStatus', () => {
    const mockPageInfo = { tradeStartAt: 0, tradeEndAt: 0, deliveryTime: 0 };
    const { result } = renderHook(() => useActivityItemStatus(mockPageInfo));
    expect(result.current).toBe(0);

    const mockPageInfo1 = { tradeStartAt: 10, tradeEndAt: 10, deliveryTime: 10 };
    const { result: result1 } = renderHook(() => useActivityItemStatus(mockPageInfo1));
    expect(result1.current).toBe(3);

    const mockPageInfo2 = { tradeStartAt: 10, tradeEndAt: 10, deliveryTime: 0 };
    const { result: result2 } = renderHook(() => useActivityItemStatus(mockPageInfo2));
    expect(result2.current).toBe(2);

    const mockPageInfo3 = { tradeStartAt: 10, tradeEndAt: 0, deliveryTime: 0 };
    const { result: result3 } = renderHook(() => useActivityItemStatus(mockPageInfo3));
    expect(result3.current).toBe(1);
  });
});
