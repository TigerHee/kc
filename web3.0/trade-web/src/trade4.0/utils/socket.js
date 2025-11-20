/**
 * Owner: borden@kupotech.com
 */
// import * as ws from '@kc/socket';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';
import { forEach } from 'lodash';

export const checkSocketTopic = async ({ topic }) => {
  // sokect正常连接并且topic_state为1时，阻止此次fetch
  const connected = await workerSocket.connected();
  if (connected) {
    const wsState = await workerSocket.getTopicState();
    if (wsState) {
      const { topicStateConst, topicState } = wsState;
      const topicStateData = topicStateConst.SUBSCRIBED;
      // console.log('===socket wsState', topic, wsState, topicState[topic]);
      if (topicState[topic] && topicState[topic].status === topicStateData) {
        return true;
      }
    }
  }
  return false;
};

// 单独增加一个合约的 socket check
export const checkFuturesSocketTopic = async ({ topic }) => {
  // socket正常连接并且topic_state为1时，阻止此次fetch
  const connected = await futuresWorkerSocket.connected();
  if (connected) {
    const wsState = await futuresWorkerSocket.getTopicState();
    if (wsState) {
      const { topicStateConst, topicState } = wsState;
      const topicStateData = topicStateConst.SUBSCRIBED;
      // console.log('===socket wsState', topic, wsState, topicState[topic]);
      if (topicState[topic] && topicState[topic].status === topicStateData) {
        return true;
      }
    }
  }

  return false;
};
