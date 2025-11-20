import { preciseTimer as originalPreciseTimer } from '@/common/precise-timer';

describe('precise-timer', () => {
  let setTimeoutSpy: jest.SpyInstance;
  let clearTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  it('calls callback after timeout', () => {
    const callback = jest.fn();
    const clear = originalPreciseTimer(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1); // 超时后执行回调
    clear();
  });

  it('does not call callback if cleared early', () => {
    const callback = jest.fn();
    const clear = originalPreciseTimer(callback, 1000);
    clear();
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled(); // 提前清除后不执行回调
  });

  it('reschedules timer if not yet due', () => {
    let now = 1000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    const callback = jest.fn();
    const timeouts: { fn: Function; delay: number }[] = [];
    setTimeoutSpy.mockImplementation((fn, delay) => {
      timeouts.push({ fn, delay });
      return 1;
    });
    const clear = originalPreciseTimer(callback, 100, 10);
    // 触发第一个回调 (100ms)
    const cb = timeouts.find((t) => t.delay === 100)?.fn;
    expect(cb).toBeDefined();
    now = 1050; // 期望时间 = 1100
    if (cb) cb();
    expect(callback).not.toHaveBeenCalled(); // 时间未到，不执行回调
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Number)); // 重新调度定时器
    (Date.now as jest.Mock).mockRestore();
    clear();
  });
});
