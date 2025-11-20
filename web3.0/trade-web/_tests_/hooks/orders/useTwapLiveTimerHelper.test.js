import '@testing-library/jest-dom';
import { useSelector } from 'dva';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  useTwapLiveTimeHelper,
  LIVE_TIME_SCENE,
} from 'src/trade4.0/pages/Orders/Common/hooks/useTwapLiveTimeHelper';
import { convertSecondsToHMS } from 'src/trade4.0/pages/Orders/Common/presenter/time-util';

describe('convertSecondsToHMS', () => {
  it('converts seconds to hours, minutes, and seconds correctly', () => {
    expect(convertSecondsToHMS(3661)).toEqual([1, 1, 1].map((i) => `${i}`));
    expect(convertSecondsToHMS(60)).toEqual([0, 1, 0].map((i) => `${i}`));
    expect(convertSecondsToHMS(59)).toEqual([0, 0, 59].map((i) => `${i}`));
    expect(convertSecondsToHMS(0)).toEqual([0, 0, 0].map((i) => `${i}`));
  });
});

jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

jest.mock('src/trade4.0/pages/Orders/Common/OrderConfig/index.js', () => ({
  TWAP_PROCESS_STATUS: {
    PENDING: 'PENDING', // 委托中
    PAUSED: 'PAUSED', // 已暂停
    COMPLETED: 'COMPLETED', // 已完成
    CANCELLED: 'CANCELLED', // 已取消
  },
}));

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
jest.spyOn(global, 'clearInterval');

describe('useTwapLiveTimeHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates the currentSeconds and formatHMSList based on orderTwap', () => {
    const initialState = {
      orderTwap: {
        fetchTime: new Date().getTime() - 3000,
      },
      orderTwapHistory: {},
    };
    useSelector.mockImplementation((selector) => selector(initialState));

    const { result } = renderHook(() =>
      useTwapLiveTimeHelper(5000, 'PENDING', LIVE_TIME_SCENE.orderTwap),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.currentSeconds).toBe(5004);
    expect(result.current.formatHMSList).toEqual(['1', '23', '24']);
  });

  it('updates the currentSeconds and formatHMSList based on orderTwapHistory', () => {
    const initialState = {
      orderTwapHistory: {
        fetchTime: new Date().getTime() - 5000,
      },
      orderTwap: {},
    };
    useSelector.mockImplementation((selector) => selector(initialState));

    const { result } = renderHook(() =>
      useTwapLiveTimeHelper(5000, 'PENDING', LIVE_TIME_SCENE.orderTwapHistory),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.currentSeconds).toBe(5006);
    expect(result.current.formatHMSList).toEqual(['1', '23', '26']);
  });
});
