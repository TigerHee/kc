/**
 * Owner: garuda@kupotech.com
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useSelector, useDispatch } from 'dva';
import useWorkerSubscribe, {
  getTopic,
  useFuturesWorkerSubscribe,
} from '@/hooks/useWorkerSubscribe';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { Topic } from '@kc/socket';

// Mocks
jest.mock('dva', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock('common/utils/socketProcess', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
}));
jest.mock('common/utils/futuresSocketProcess', () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
}));
jest.mock('@kc/socket', () => ({
  Topic: {
    get: jest.fn(),
  },
}));

// Helper function to setup the hooks
const setupHook = (hook, topic, privateChannel) => {
  const dispatch = jest.fn();
  useDispatch.mockReturnValue(dispatch);
  useSelector.mockImplementation((callback) => callback({ user: { isLogin: true } }));
  return renderHook(() => hook(topic, privateChannel));
};

describe('getTopic', () => {
  it('should return empty string if symbols are not provided', () => {
    const result = getTopic('topic_temp', null);
    expect(result).toBe('');
  });

  it('should return topic string if symbols are provided', () => {
    Topic.get.mockImplementation((topicTemp, { SYMBOLS }) => `topic_${SYMBOLS.join(',')}`);
    const result = getTopic('topic_temp', ['BTC', 'ETH']);
    expect(result).toBe('topic_BTC,ETH');
    expect(Topic.get).toHaveBeenCalledWith('topic_temp', { SYMBOLS: ['BTC', 'ETH'] });
    const result2 = getTopic('topic_temp', 'ETH');
    expect(result2).toBe('topic_ETH');
    expect(Topic.get).toHaveBeenCalledWith('topic_temp', { SYMBOLS: ['ETH'] });
  });
});

describe('useWorkerSubscribe', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe and unsubscribe to a topic', () => {
    const { unmount } = setupHook(useWorkerSubscribe, 'topic1', true);

    // Check if the subscription was made
    expect(workerSocket.subscribe).toHaveBeenCalledWith('topic1', true);

    // Unmount the hook to trigger the cleanup function
    act(() => {
      unmount();
    });

    // Check if the unsubscription was made
    expect(workerSocket.unsubscribe).toHaveBeenCalledWith('topic1', true);
  });

  it('should not subscribe or unsubscribe if not logged in', () => {
    useSelector.mockReturnValueOnce(false);
    const { unmount } = setupHook(useWorkerSubscribe, 'topic1', true);

    expect(workerSocket.subscribe).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(workerSocket.unsubscribe).not.toHaveBeenCalled();
  });

  it('should not subscribe or unsubscribe if no topic is provided', () => {
    const { unmount } = setupHook(useWorkerSubscribe, '', true);

    expect(workerSocket.subscribe).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(workerSocket.unsubscribe).not.toHaveBeenCalled();
  });

  it('should handle public channels correctly', () => {
    const { unmount } = setupHook(useWorkerSubscribe, 'topic1');

    expect(workerSocket.subscribe).toHaveBeenCalledWith('topic1', false);

    act(() => {
      unmount();
    });

    expect(workerSocket.unsubscribe).toHaveBeenCalledWith('topic1', false);
  });
});

describe('useFuturesWorkerSubscribe', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe and unsubscribe to a topic', () => {
    const { unmount } = setupHook(useFuturesWorkerSubscribe, 'topic1', true);

    // Check if the subscription was made
    expect(futuresWorkerSocket.subscribe).toHaveBeenCalledWith('topic1', true);

    // Unmount the hook to trigger the cleanup function
    act(() => {
      unmount();
    });

    // Check if the unsubscription was made
    expect(futuresWorkerSocket.unsubscribe).toHaveBeenCalledWith('topic1', true);
  });

  it('should not subscribe or unsubscribe if not logged in', () => {
    useSelector.mockReturnValueOnce(false);
    const { unmount } = setupHook(useFuturesWorkerSubscribe, 'topic1', true);

    expect(futuresWorkerSocket.subscribe).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(futuresWorkerSocket.unsubscribe).not.toHaveBeenCalled();
  });

  it('should not subscribe or unsubscribe if no topic is provided', () => {
    const { unmount } = setupHook(useFuturesWorkerSubscribe, '', true);

    expect(futuresWorkerSocket.subscribe).not.toHaveBeenCalled();

    act(() => {
      unmount();
    });

    expect(futuresWorkerSocket.unsubscribe).not.toHaveBeenCalled();
  });

  it('should handle public channels correctly', () => {
    const { unmount } = setupHook(useFuturesWorkerSubscribe, 'topic1');

    expect(futuresWorkerSocket.subscribe).toHaveBeenCalledWith('topic1', false);

    act(() => {
      unmount();
    });

    expect(futuresWorkerSocket.unsubscribe).toHaveBeenCalledWith('topic1', false);
  });
});
