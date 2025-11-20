/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';
import { render, unmount, act } from '@testing-library/react';
import wsSubscribe, {
  getOriginTopic,
  checkTopicInWorkerWay,
  subscribeCounter,
  unsubscribeCounter,
} from 'hocs/wsSubscribe';
import workerSocket from 'src/common/utils/socketProcess';

jest.mock('src/common/utils/socketProcess');
jest.mock('services/workers/websocket.worker', () => {
  class Worker {
    constructor(stringUrl) {
      this.url = stringUrl;
      this.onmessage = () => {};
    }

    postMessage(msg) {
      this.onmessage(msg);
    }
    onmessage() {}
    addEventListener() {}
  }
  return {
    __esModule: true,
    default: Worker,
  };
});

describe('wsSubscribe', () => {
  let WrappedComponent;
  let WsSubscribe;

  beforeEach(() => {
    WrappedComponent = (props) => <div {...props} />;
    const options = {
      getTopics: () => [
        ['topic1', {}],
        ['topic2', {}],
      ],
      didUpdate: () => true,
      onUnSubscribe: jest.fn(),
      onSubscribe: jest.fn(),
      onRealUnSubscribe: jest.fn(),
      onRealSubscribe: jest.fn(),
    };
    WsSubscribe = wsSubscribe(options)(WrappedComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should unsubscribe from topics on componentWillUnmount', async () => {
    const wrapper = render(<WsSubscribe />);
    await wrapper.unmount();
    expect(workerSocket.unsubscribe).toHaveBeenCalledTimes(2);
    expect(workerSocket.unsubscribe).toHaveBeenCalledWith('topic1', false);
    expect(workerSocket.unsubscribe).toHaveBeenCalledWith('topic2', false);
  });

  it('should subscribe to topics on componentDidMount', () => {
    render(<WsSubscribe />);
    expect(workerSocket.subscribe).toHaveBeenCalledTimes(2);
    expect(workerSocket.subscribe).toHaveBeenCalledWith('topic1', false);
    expect(workerSocket.subscribe).toHaveBeenCalledWith('topic2', false);
  });

  it('should subscribe and unsubscribe from topics on componentDidUpdate', () => {
    const { rerender } = render(<WsSubscribe />);
    act(() => {
      rerender(<WsSubscribe />);
    });
    expect(workerSocket.unsubscribe).toHaveBeenCalledTimes(0);
    act(() => {
      rerender(<WsSubscribe />);
    });
  });

  it('should getOriginTopic return origin topic', () => {
    const originTopic = getOriginTopic('workSubscribe@@@private');

    expect(originTopic).toBe('workSubscribe');
  });

  it('should checkTopicInWorkerWay topic /spotMarket/tradeOrders return false', () => {
    const originTopic = checkTopicInWorkerWay('/spotMarket/tradeOrders');

    expect(originTopic).toBe(false);
  });

  it('should checkTopicInWorkerWay topic /spotMarket/advancedOrders return true', () => {
    const originTopic = checkTopicInWorkerWay('/spotMarket/advancedOrders');

    expect(originTopic).toBe(true);
  });

  it('should unsubscribeCounter topic /spotMarket/advancedOrders return 1', () => {
    subscribeCounter('/spotMarket/advancedOrders');
    subscribeCounter('/spotMarket/advancedOrders');
    unsubscribeCounter('/spotMarket/advancedOrders');
    expect(workerSocket.subscribe).toHaveBeenCalledTimes(1);
    expect(workerSocket.unsubscribe).not.toHaveBeenCalled();
  });

  it('should wsSubscribe getTopics or didUpdate not function get Error', () => {
    try {
      wsSubscribe({ getTopics: 'string' });
    } catch (e) {
      expect(e.name).toBe('Error');
    }
  });
});
