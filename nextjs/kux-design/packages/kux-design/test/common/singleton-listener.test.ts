import { renderHook, act } from '@testing-library/react';
import { createSingletonListener } from '@/common/singleton-listener';

type ISubscribe = (callback: () => void) => () => void;

describe('createSingletonListener', () => {
  let subscribeMock: jest.Mock<ReturnType<ISubscribe>, [() => void]>;
  let getSnapshotMock: jest.Mock<number, []>;
  let unsubscribeMock: jest.Mock<void, []>;

  beforeEach(() => {
    unsubscribeMock = jest.fn();
    subscribeMock = jest.fn((_callback: () => void) => {
      // 模拟 subscribe 函数，在调用时执行回调
      const wrappedUnsubscribe = () => {
        unsubscribeMock();
      };
      return wrappedUnsubscribe;
    });
    getSnapshotMock = jest.fn(() => Math.random()); // 每次调用返回一个随机数
  });

  it('should subscribe and unsubscribe correctly', () => {
    const { useValue: _useValue, subscribe } = createSingletonListener<number>(
      subscribeMock,
      getSnapshotMock,
    );

    const callback = jest.fn();
    const unsubscribe = subscribe(callback);

    expect(subscribeMock).toHaveBeenCalledTimes(1); // 首次订阅时调用 subscribe
    expect(callback).toHaveBeenCalledTimes(0);

    // 模拟值更新
    act(() => {
      if (subscribeMock.mock.calls[0] && subscribeMock.mock.calls[0][0]) {
        subscribeMock.mock.calls[0][0]();
      }
    });

    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1); // 取消订阅时调用 unsubscribe

    // 再次更新，callback 不应再被调用
    act(() => {
      if (subscribeMock.mock.calls[0] && subscribeMock.mock.calls[0][0]) {
        subscribeMock.mock.calls[0][0]();
      }
    });

    expect(callback).toHaveBeenCalledTimes(1); // 仍然是 1，因为已经取消订阅
  });

  it('should only subscribe once with multiple subscribers', () => {
    const { useValue: _useValue, subscribe } = createSingletonListener<number>(
      subscribeMock,
      getSnapshotMock,
    );

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const unsubscribe1 = subscribe(callback1);
    const unsubscribe2 = subscribe(callback2);

    expect(subscribeMock).toHaveBeenCalledTimes(1); // 只调用一次 subscribe

    // 模拟值更新
    act(() => {
      if (subscribeMock.mock.calls[0] && subscribeMock.mock.calls[0][0]) {
        subscribeMock.mock.calls[0][0]();
      }
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    unsubscribe1();
    expect(unsubscribeMock).toHaveBeenCalledTimes(0); // 尚未取消所有订阅

    unsubscribe2();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1); // 取消所有订阅后才调用 unsubscribe
  });

  it('should unsubscribe when the last subscriber unsubscribes', () => {
    const { useValue: _useValue, subscribe } = createSingletonListener<number>(
      subscribeMock,
      getSnapshotMock,
    );

    const unsubscribe1 = subscribe(() => {});
    const unsubscribe2 = subscribe(() => {});

    unsubscribe1();
    expect(unsubscribeMock).toHaveBeenCalledTimes(0); // 还有订阅者，不取消订阅

    unsubscribe2();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1); // 最后一个订阅者取消，执行取消订阅
  });

  it('should update the value when getSnapshot returns a new value', () => {
    const { useValue } = createSingletonListener<number>(subscribeMock, getSnapshotMock);

    const { result, rerender: _rerender } = renderHook(() => useValue());

    const initialValue = result.current;

    act(() => {
      if (subscribeMock.mock.calls[0] && subscribeMock.mock.calls[0][0]) {
        subscribeMock.mock.calls[0][0]();
      }
    });

    expect(result.current).not.toBe(initialValue); // 值应该更新
  });

  it('should not update the value when getSnapshot returns the same value', () => {
    getSnapshotMock.mockReturnValue(123); // 固定返回值

    const { useValue } = createSingletonListener<number>(subscribeMock, getSnapshotMock);

    const { result, rerender: _rerender } = renderHook(() => useValue());

    const initialValue = result.current;

    act(() => {
      if (subscribeMock.mock.calls[0] && subscribeMock.mock.calls[0][0]) {
        subscribeMock.mock.calls[0][0]();
      }
    });

    expect(result.current).toBe(initialValue); // 值相同，不更新
  });

  it('should handle callback error in onValUpdate', () => {
    const { subscribe } = createSingletonListener<number>(subscribeMock, getSnapshotMock);
    const error = new Error('test error');
    const errorCallback = jest.fn(() => {
      throw error;
    });
    const normalCallback = jest.fn();
    subscribe(errorCallback);
    subscribe(normalCallback);
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // 触发 onValUpdate
    if (subscribeMock.mock.calls[0] && subscribeMock.mock.calls[0][0]) {
      subscribeMock.mock.calls[0][0]();
    }
    expect(errorCallback).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('[singleton listener] callback', error); // 错误被正确捕获并记录
    spy.mockRestore();
  });
});
