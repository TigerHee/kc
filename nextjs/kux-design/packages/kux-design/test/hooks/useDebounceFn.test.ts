import { renderHook, act } from '@testing-library/react';
import { useDebounceFn } from '@/hooks/useDebounceFn';

describe('useDebounceFn', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('basic debouncing', () => {
    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      // 连续调用函数，立即调用时不应该执行
      act(() => {
        result.current.run();
        result.current.run();
        result.current.run();
      });
      expect(mockFn).not.toHaveBeenCalled();

      // 等待防抖时间后应该执行
      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should use default options', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn));

      act(() => result.current.run());
      act(() => jest.advanceTimersByTime(0));
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('leading option', () => {
    it('should call function immediately when leading is true', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100, leading: true }));

      // 立即执行
      act(() => result.current.run());
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 后续调用被防抖
      act(() => result.current.run());
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 延迟后再次执行
      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should not call immediately when leading is false', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100, leading: false }));

      act(() => result.current.run());
      expect(mockFn).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('trailing option', () => {
    it('should call function at the end when trailing is true', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100, trailing: true }));

      act(() => result.current.run());
      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).toHaveBeenCalled();
    });

    it('should not call function at the end when trailing is false', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100, trailing: false }));

      act(() => result.current.run());
      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('maxWait option', () => {
    it('should respect maxWait limit', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 200, maxWait: 100 }));

      act(() => result.current.run());
      act(() => {
        jest.advanceTimersByTime(50);
        result.current.run();
      });
      act(() => jest.advanceTimersByTime(50));

      // 达到 maxWait 时间后执行
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('cancel functionality', () => {
    it('should cancel pending execution', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      act(() => {
        result.current.run();
        result.current.cancel();
      });
      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('flush functionality', () => {
    it('should immediately execute pending function', async () => {
      const mockFn = jest.fn(() => 'result');
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      act(() => result.current.run());
      let flushResult: any;
      await act(async () => {
        // Wait a bit to ensure the function is scheduled
        jest.advanceTimersByTime(50);
        flushResult = await result.current.flush();
      });
      expect(flushResult).toBe('result');
    });

    it('should return undefined when no pending execution', async () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      let flushResult: any;
      await act(async () => {
        flushResult = await result.current.flush();
      });
      expect(flushResult).toBeUndefined();
    });
  });

  describe('result tracking', () => {
    it('should track function result', () => {
      const mockFn = jest.fn(() => 'test result');
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      act(() => result.current.run());
      act(() => jest.advanceTimersByTime(100));
      expect(result.current.result).toBe('test result');
    });

    it('should update result on new execution', () => {
      const mockFn = jest
        .fn()
        .mockReturnValueOnce('first result')
        .mockReturnValueOnce('second result');
      const { result } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      act(() => result.current.run());
      act(() => jest.advanceTimersByTime(100));
      expect(result.current.result).toBe('first result');

      act(() => result.current.run());
      act(() => jest.advanceTimersByTime(100));
      expect(result.current.result).toBe('second result');
    });
  });

  describe('cleanup on unmount', () => {
    it('should cancel pending execution on unmount', () => {
      const mockFn = jest.fn();
      const { result, unmount } = renderHook(() => useDebounceFn(mockFn, { wait: 100 }));

      act(() => result.current.run());
      unmount();
      act(() => jest.advanceTimersByTime(100));
      expect(mockFn).not.toHaveBeenCalled();
    });
  });
});
