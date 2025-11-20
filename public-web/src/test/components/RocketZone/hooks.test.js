/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
const { useSelector } = require('src/hooks/useSelector');

const {
  useResponsiveSize,
  useInApp,
  useExit,
  useHideHeader,
  useStatus,
} = require('src/components/RocketZone/hooks.js');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
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

  it('test useInApp', () => {
    renderHook(() => useInApp());
  });

  it('test useExit', () => {
    renderHook(() => useExit()());
  });

  it('test useHideHeader', () => {
    isApp.mockReturnValue(true);
    renderHook(() => useHideHeader());
  });
});

describe('useStatus', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the 0 when the params is empty', () => {
    const { result } = renderHook(() => useStatus({}));
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(0);
  });

  it('should return the 0', () => {
    const { result } = renderHook(() =>
      useStatus({
        startDate: Date.now() + 10000,
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(0);
  });

  it('should return the 2', () => {
    const { result } = renderHook(() =>
      useStatus({
        endDate: Date.now() - 1000,
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(2);
  });

  it('should return the 0 with gemPreMarket', () => {
    const { result } = renderHook(() =>
      useStatus({
        startDate: Date.now() + 10000,
        typeName: 'gemPreMarket',
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(0);
  });

  it('should return the 1 with gemPreMarket', () => {
    const { result } = renderHook(() =>
      useStatus({
        startDate: Date.now() - 10000,
        endDate: Date.now() + 10000,
        typeName: 'gemPreMarket',
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(1);
  });

  it('should return the 2 with gemPreMarket', () => {
    const { result } = renderHook(() =>
      useStatus({
        startDate: Date.now() - 10000,
        endDate: Date.now() - 10000,
        preDeliveryTime: Date.now() + 1000,
        typeName: 'gemPreMarket',
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(2);
  });

  it('should return the 3 with gemPreMarket', () => {
    const { result } = renderHook(() =>
      useStatus({
        startDate: Date.now() - 10000,
        endDate: Date.now() - 10000,
        preDeliveryTime: Date.now() - 1000,
        deliveryTime: Date.now() + 1000,
        typeName: 'gemPreMarket',
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(3);
  });

  it('should return the 4 with gemPreMarket', () => {
    const { result } = renderHook(() =>
      useStatus({
        deliveryTime: Date.now() - 1000,
        typeName: 'gemPreMarket',
      }),
    );
    jest.advanceTimersByTime(1000);
    const activityStatus = result.current;
    expect(activityStatus).toBe(4);
  });
});
