/**
 * Owner: jessie@kupotech.com
 */
import { isApp } from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {
  useActivityInit,
  useActivityTime,
  useInitActivityStatus,
  useIsMobile,
  useIsMobileApp,
  useResponsiveSize,
  useShare,
} from 'src/components/Votehub/hooks';
import { useSelector } from 'src/hooks/useSelector';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
  useMediaQuery: jest.fn(),
  useSnackbar: () => {
    return {
      message: {
        success: () => { },
        info: () => { },
        error: () => { },
        warning: () => { },
        loading: () => { },
      },
    };
  },
}));

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});

jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
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

  it('test useIsMobile', () => {
    useResponsive.mockReturnValue({ sm: false });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    useResponsive.mockReturnValue({ sm: true });
    const { result: result1 } = renderHook(() => useIsMobile());
    expect(result1.current).toBe(false);
  });

  it('test useIsMobileApp', () => {
    useResponsive.mockReturnValue({ sm: false });
    const { result } = renderHook(() => useIsMobileApp());
    expect(result.current).toBe(true);

    useResponsive.mockReturnValue({ sm: true });
    const { result: result1 } = renderHook(() => useIsMobileApp());
    expect(result1.current).toBe(false);
  });

  it('test useActivityInit', () => {
    jest.useFakeTimers();
    useDispatch.mockReturnValue(jest.fn());
    renderHook(() => useActivityInit());

    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('test useInitActivityStatus', () => {
    const mockPageInfo = { voteStartAt: 0, voteEndAt: 0 };
    useSelector.mockReturnValue(mockPageInfo);
    renderHook(() => useInitActivityStatus());

    const mockPageInfo1 = {
      activityEndAt: moment().valueOf() - 100000,
    };
    useSelector.mockReturnValue(mockPageInfo1);
    renderHook(() => useInitActivityStatus());

    const mockPageInfo2 = {
      voteEndAt: moment().valueOf() - 100000,
      activityEndAt: moment().valueOf() + 100000,
    };
    useSelector.mockReturnValue(mockPageInfo2);
    renderHook(() => useInitActivityStatus());

    const mockPageInfo3 = {
      voteStartAt: moment().valueOf() - 100000,
      voteEndAt: moment().valueOf() + 200000,
      activityStartAt: moment().valueOf() + 100000,
      activityEndAt: moment().valueOf() + 100000,
    };
    useSelector.mockReturnValue(mockPageInfo3);
    renderHook(() => useInitActivityStatus());

    const mockPageInfo4 = {
      voteStartAt: moment().valueOf() + 100000,
      voteEndAt: moment().valueOf() + 200000,
      activityStartAt: moment().valueOf() - 100000,
      activityEndAt: moment().valueOf() + 100000,
    };
    useSelector.mockReturnValue(mockPageInfo4);
    renderHook(() => useInitActivityStatus());

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });

  it('test useShare with share', () => {
    const mockPageInfo1 = { referralCode: '', appInfo: {} };
    useSelector.mockReturnValue(mockPageInfo1);
    renderHook(() => useShare()());
    // result.current();

    isApp.mockReturnValue(true);
    const mockPageInfo = { referralCode: 'qq1212', appInfo: {} };
    useSelector.mockReturnValue(mockPageInfo);
    const { result: result1 } = renderHook(() => useShare());
    result1.current();
  });

  it('test useActivityTime', () => {
    const mockPageInfo = { voteStartAt: 0, voteEndAt: 0 };
    useSelector.mockReturnValue(mockPageInfo);
    const { result } = renderHook(() => useActivityTime());
    expect(result.current.voteStartTime).toBe(-1);
    expect(result.current.voteEndTime).toBe(-1);

    const mockPageInfo1 = {
      voteStartAt: moment().valueOf() + 100000,
      voteEndAt: moment().valueOf() + 200000,
    };
    useSelector.mockReturnValue(mockPageInfo1);
    const { result: result1 } = renderHook(() => useActivityTime());
    expect(result1.current.voteStartTime).not.toBe(-1);
    expect(result1.current.voteEndTime).not.toBe(-1);
  });
});
