/*
 * Owner: tom@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  ACTIVITY_NOT_STARTED,
  END_ACTIVITY_STATUS,
  END_RESERVATION_STATUS,
  LOTTERY_STATUS,
  RESERVATION_NOT_STARTED,
  RESULT_ANNOUNCED_STATUS,
  REWARD_EXPECT_STATUS,
  START_RESERVATION_STATUS,
} from 'components/Spotlight/SpotlightR6/constant';
import {
  useActivityProcessingStatus,
  useDeposit,
  useKyc,
  useProcessBar,
  useProcesss,
  useRegistrationCount,
} from 'components/Spotlight/SpotlightR6/hooks';
import { useDispatch } from 'react-redux';

const { useSelector } = require('src/hooks/useSelector');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  shallowEqual: jest.fn(),
}));

jest.mock('src/hooks/useSelector', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({ countryInfo: 'countryInfo' })),
  };
});
jest.mock('@knb/native-bridge', () => ({ open: jest.fn(), isApp: jest.fn() }));
jest.mock('tools/i18n', () => ({ addLangToPath: (path) => path, _t: (key) => key }));

jest.mock('utils/siteConfig', () => ({ KUCOIN_HOST: 'http://localhost/' }));

const timeNum = 600000;

describe('useActivityProcessingStatus', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct status before the activity starts', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(ACTIVITY_NOT_STARTED);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: ACTIVITY_NOT_STARTED },
    });
  });

  it('should return the correct status before the reservation starts', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - timeNum,
            startReservationTime: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(RESERVATION_NOT_STARTED);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: RESERVATION_NOT_STARTED },
    });
  });

  it('should return the correct status during the reservation period', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - timeNum,
            startReservationTime: Date.now() - timeNum,
            endReservationTime: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(START_RESERVATION_STATUS);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: START_RESERVATION_STATUS },
    });
  });

  it('should return the correct status before the expect starts', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - timeNum,
            startReservationTime: Date.now() - timeNum,
            endReservationTime: Date.now() - timeNum,
            rewardExpectAt: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(END_RESERVATION_STATUS);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: END_RESERVATION_STATUS },
    });
  });

  it('should return the correct status before the result announced starts', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - timeNum,
            startReservationTime: Date.now() - timeNum,
            endReservationTime: Date.now() - timeNum,
            rewardExpectAt: Date.now() - timeNum,
            resultAnnouncedAt: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(REWARD_EXPECT_STATUS);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: REWARD_EXPECT_STATUS },
    });
  });

  it('should return the correct status before the lottery starts', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - timeNum,
            startReservationTime: Date.now() - timeNum,
            endReservationTime: Date.now() - timeNum,
            rewardExpectAt: Date.now() - timeNum,
            resultAnnouncedAt: Date.now() - timeNum,
            lotteryTime: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(RESULT_ANNOUNCED_STATUS);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: RESULT_ANNOUNCED_STATUS },
    });
  });

  it('should return the correct status before the activity ends', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - timeNum,
            startReservationTime: Date.now() - timeNum,
            endReservationTime: Date.now() - timeNum,
            rewardExpectAt: Date.now() - timeNum,
            resultAnnouncedAt: Date.now() - timeNum,
            lotteryTime: Date.now() - timeNum,
            endAt: Date.now() + timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(LOTTERY_STATUS);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: LOTTERY_STATUS },
    });
  });

  it('should return the correct status after the activity ends', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            endAt: Date.now() - timeNum,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    jest.advanceTimersByTime(1000);
    expect(result.current).toBe(END_ACTIVITY_STATUS);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'spotlight/changeProcessStatus',
      payload: { status: END_ACTIVITY_STATUS },
    });
  });

  it('should clear the interval on unmount', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            endAt: Date.now() - timeNum,
          },
        },
      }),
    );
    const { unmount } = renderHook(() => useActivityProcessingStatus());
    unmount();
    expect(clearInterval).toHaveBeenCalled();
  });
});

describe('Custom hooks', () => {
  beforeEach(() => {
    window.onListenEvent = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
    delete window.onListenEvent;
  });
  test('useActivityProcessingStatus', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {
            startAt: Date.now() - 10000,
            endAt: Date.now() + 10000,
            startReservationTime: Date.now() - 5000,
            endReservationTime: Date.now() - 3000,
            rewardExpectAt: Date.now() - 2000,
            lotteryTime: Date.now() + 10000,
            resultAnnouncedAt: Date.now() + 5000,
          },
        },
      }),
    );
    const { result } = renderHook(() => useActivityProcessingStatus());
    expect(result.current).toBe(ACTIVITY_NOT_STARTED);
  });
  test('useKyc isInApp true', () => {
    JsBridge.isApp.mockReturnValue(true);
    const { result } = renderHook(() => useKyc());
    const { handleKyc } = result.current;
    act(() => {
      handleKyc();
    });
    expect(JsBridge.open).toHaveBeenCalled();
  });

  test('useKyc isInApp false', () => {
    JsBridge.isApp.mockReturnValue(false);
    const { result } = renderHook(() => useKyc());
    const { handleKyc } = result.current;
    act(() => {
      handleKyc();
    });

    expect(window.location.href).toBe('http://localhost/');
  });

  test('useDeposit isInApp true', () => {
    JsBridge.isApp.mockReturnValue(true);
    const { result } = renderHook(() => useDeposit());
    const { handleDeposit } = result.current;
    act(() => {
      handleDeposit();
    });
    expect(JsBridge.open).toHaveBeenCalled();
  });
  test('useDeposit isInApp false', () => {
    JsBridge.isApp.mockReturnValue(false);
    const { result } = renderHook(() => useDeposit());
    const { handleDeposit } = result.current;
    act(() => {
      handleDeposit();
    });

    expect(window.location.href).toBe('http://localhost/');
  });
});

describe('useProcessBar', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the status before the reservation time', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {},
          processingStatus: REWARD_EXPECT_STATUS,
        },
      }),
    );
    const { result } = renderHook(() => useProcessBar());
    const [_, currentProcess] = result.current;
    expect(currentProcess).toBe(3);
  });
});

describe('useProcesss', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('test useProcesss', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {},
          processingStatus: REWARD_EXPECT_STATUS,
        },
      }),
    );
    const { result } = renderHook(() => useProcesss());
    const { isSameOrBefore, isSameOrAfter, isAfter, isBefore, isSame } = result.current;
    expect(isSameOrBefore(ACTIVITY_NOT_STARTED)).toBe(false);
    expect(isSameOrAfter(ACTIVITY_NOT_STARTED)).toBe(true);
    expect(isAfter(ACTIVITY_NOT_STARTED)).toBe(true);
    expect(isBefore(ACTIVITY_NOT_STARTED)).toBe(false);
    expect(isSame(ACTIVITY_NOT_STARTED)).toBe(false);
  });
});
describe('useRegistrationCount', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('test useRegistrationCount', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {},
          processingStatus: REWARD_EXPECT_STATUS,
        },
      }),
    );
    renderHook(() => useRegistrationCount());
  });

  it('test useRegistrationCount', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        spotlight: {
          detailInfo: {},
          processingStatus: START_RESERVATION_STATUS,
        },
      }),
    );
    renderHook(() => useRegistrationCount());
  });
});
