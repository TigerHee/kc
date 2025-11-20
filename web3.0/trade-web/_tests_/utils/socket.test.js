/**
 * Owner: Clyne@kupotech.com
 */

import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { checkSocketTopic, checkFuturesSocketTopic } from 'src/trade4.0/utils/socket';

jest.mock('common/utils/socketProcess', () => ({
  connected: jest.fn(),
  getTopicState: jest.fn(),
}));

jest.mock('common/utils/futuresSocketProcess', () => ({
  connected: jest.fn(),
  getTopicState: jest.fn(),
}));

describe('socket UT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('checkSocketTopic spot', async () => {
    // 正常调用
    workerSocket.connected.mockResolvedValueOnce(true);
    workerSocket.getTopicState.mockResolvedValueOnce({
      topicStateConst: {
        SUBSCRIBED: 1,
      },
      topicState: {
        position: {
          status: 1,
        },
      },
    });
    await expect(checkSocketTopic({ topic: 'position' })).resolves.toBe(true);
    // 未连接
    workerSocket.connected.mockResolvedValueOnce(false);
    await expect(checkSocketTopic({ topic: 'position' })).resolves.toBe(false);
    // 连接但无topicState
    workerSocket.connected.mockResolvedValueOnce(true);
    workerSocket.getTopicState.mockResolvedValueOnce(null);
    await expect(checkSocketTopic({ topic: 'position' })).resolves.toBe(false);
    // 连接 有topicstate 但是状态没对
    workerSocket.connected.mockResolvedValueOnce(true);
    workerSocket.getTopicState.mockResolvedValueOnce({
      topicStateConst: {
        SUBSCRIBED: 1,
      },
      topicState: {
        position: {
          status: 2,
        },
      },
    });
    await expect(checkSocketTopic({ topic: 'position' })).resolves.toBe(false);
  });

  test('checkSocketTopic futures', async () => {
    // 正常调用
    futuresWorkerSocket.connected.mockResolvedValueOnce(true);
    futuresWorkerSocket.getTopicState.mockResolvedValueOnce({
      topicStateConst: {
        SUBSCRIBED: 1,
      },
      topicState: {
        position: {
          status: 1,
        },
      },
    });
    await expect(checkFuturesSocketTopic({ topic: 'position' })).resolves.toBe(true);
    // 未连接
    futuresWorkerSocket.connected.mockResolvedValueOnce(false);
    await expect(checkFuturesSocketTopic({ topic: 'position' })).resolves.toBe(false);
    // 连接但无topicState
    futuresWorkerSocket.connected.mockResolvedValueOnce(true);
    futuresWorkerSocket.getTopicState.mockResolvedValueOnce(null);
    await expect(checkFuturesSocketTopic({ topic: 'position' })).resolves.toBe(false);
    // 连接 有topicstate 但是状态没对
    futuresWorkerSocket.connected.mockResolvedValueOnce(true);
    futuresWorkerSocket.getTopicState.mockResolvedValueOnce({
      topicStateConst: {
        SUBSCRIBED: 1,
      },
      topicState: {
        position: {
          status: 2,
        },
      },
    });
    await expect(checkFuturesSocketTopic({ topic: 'position' })).resolves.toBe(false);
  });
});
