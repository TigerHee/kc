/**
 * Owner: garuda@kupotech.com
 * 现货跟合约是两条 Socket 通道，单独拆分出来
 */
import { reduce, forEach, get } from 'lodash';
import sentry from '@kc/sentry';

import { evtEmitter } from 'helper';
import { getStore } from 'src/utils/createApp';
import { isFuturesNew } from '@/meta/const';

import Worker from 'services/workers/websocket.futures.worker';
import { MESSAGE, STATIC } from 'services/workers/websocket.const';

const delay = (d) => new Promise((resolve) => setTimeout(resolve, d));

const _ROUND_TS_ = 20;

const state = {
  pending: true,
};
/**
 * 设置pending占用
 */
function setPending() {
  state.pending = true;
  // console.log('set pending');
}

/**
 * 解除pending占用
 */
function unsetPending() {
  state.pending = false;
  // console.log('unset pending');
}

/**
 * 是否pending
 */
function isPending() {
  return state.pending;
}

/**
 * 等待锁
 * @return false || Function
 */
const waitLock = async () => {
  // 等着抢占后继续执行
  // console.log('try pending');
  while (isPending()) {
    // console.log('pending');
    await delay(_ROUND_TS_);
  }
  // console.log('not pending');
};

// 获取redux store中的 state
const getStoreState = (keys) => {
  const globalState = getStore().getState();
  const getKeyMap = {};
  if (!keys || !keys.length) {
    return getKeyMap;
  }
  forEach(keys, (name) => {
    const keyName = name.split('.').pop();
    getKeyMap[keyName] = get(globalState, name);
  });
  return getKeyMap;
};

const event = evtEmitter.getEvt('futures.websocket.process');

/**
 * Worker
 */
let workerId = 0;
const initWorker = () => {
  // lock
  setPending();

  workerId += 1;
  if (workerId > 1e6) {
    workerId = 0;
  }
  const worker = new Worker();
  console.log('WebSocket process worker init');

  worker.addEventListener('message', (e) => {
    const data = JSON.parse(e.data);
    if (!data) {
      return;
    }
    if (typeof data === 'string' && data === MESSAGE.PONG) {
      // do nothing
    } else if (typeof data === 'object' && data.workerSuccess) {
      // console.log(`emit ${STATIC.RESULT}_${data.id}`);
      event.emit(`${STATIC.RESULT}_${data.id}`, data);
    } else if (typeof data === 'object' && data.method === STATIC.TOPIC_MESSAGE) {
      event.emit(data.type, data.data);
    } else if (typeof data === 'object' && data.method === STATIC.GET_STORE) {
      const store = getStoreState(data.keys);
      sendMessage({
        method: STATIC.MAKE_DATA,
        args: { type: data.type, store },
      });
    }
    // 重连5次依然失败sentry上报
    if (typeof data === 'object' && data.type === STATIC.RECONNECTERROR) {
      try {
        sentry.captureEvent({
          message: 'websocket: 重连5次依然失败（合约）',
          tags: {
            fatal_type: 'websocket',
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
  });

  // worker.
  worker.addEventListener('error', (e) => {
    console.log(`Socket Worker error: ${e.message}`);
    throw e;
  });

  // message id
  let msgId = 0;
  const incMsgId = () => {
    msgId += 1;
    if (msgId > 1e6) {
      msgId = 0;
    }
    return msgId;
  };

  const sendMessage = (msg) => {
    if (typeof msg === 'object') {
      msg = {
        ...msg,
        __msgId: msgId,
      };
      // console.log(msg);
    }
    worker.postMessage(JSON.stringify(msg));
  };

  // ping worker
  sendMessage(MESSAGE.PING);

  // re init while retry counter -> 0
  let retryCount = 3;
  const retryCounter = () => {
    retryCount -= 1;
    return retryCount;
  };

  // unlock
  unsetPending();

  return {
    id: workerId,
    worker,
    incMsgId,
    sendMessage,
    retryCounter,
  };
};

// Worker Variable
let workerIns = {};

// ------------------------->

const commandWaitAck = async (runFn, retryFn, workerInstanceId) => {
  if (typeof retryFn !== 'function') {
    throw new Error('Retry Func is invalid.');
  }
  let res = await raceWorker(runFn);
  // console.log('res', res);
  if (res === STATIC.TIMEOUT) {
    if (workerIns.retryCounter() < 0) {
      // TIMEOUT优先执行retryCounter减计数
      console.log('wio retry timeout false');
      return undefined;
    } else {
      // 重启worker
      if (workerInstanceId === workerId) {
        if (typeof workerIns.worker.terminate === 'function') {
          workerIns.worker.terminate();
          console.log(
            'WebSocket process worker terminated',
            `wId: ${workerInstanceId}`,
            `gwId: ${workerId}`,
          );
        }
        workerIns = initWorker();
      } else {
        // console.log('WebSocket process worker is terminating, just retry',
        //   `wId: ${workerInstanceId}`, `gwId: ${workerId}`);
      }
      res = await retryFn();
    }
  }
  return res;
};

// Tips.若执行超时无回复，可以检查worker中对应type或者method逻辑条件是否正确
function raceWorker(run) {
  return Promise.race([timeout(), workerResult(run)]);
}

async function timeout() {
  await delay(5000);
  return STATIC.TIMEOUT;
}

function workerResult(func, id) {
  return new Promise((resolve, reject) => {
    // 获取结果
    const commandId = workerIns.incMsgId();
    // console.log(`listen workerResult ${id} ${STATIC.RESULT}_${commandId}`);
    event.once(`${STATIC.RESULT}_${commandId}`, (data) => {
      // console.log(`resolve workerResult ${id} ${STATIC.RESULT}_${commandId}`, data);
      resolve(data);
    });
    func();
  });
}

// ------------------------->

const genBaseApi = (configs) =>
  reduce(
    configs,
    (result, item) => {
      const [_name, _method] = item;

      const hook = async (...args) => {
        await waitLock();

        const res = await commandWaitAck(
          () => {
            const extraCtx = {};
            if (_method === STATIC.CONNECT) {
              const { protocol, host } = window.location;
              const _host = `${protocol}//${host}`;
              extraCtx.host = _host;
            }
            workerIns.sendMessage({
              method: _method,
              args: [...args],
              ...extraCtx,
            });
          },
          async () => {
            return await hook(...args);
          },
          workerIns.id,
        );
        return res;
      };
      return {
        ...result,
        [_name]: hook,
      };
    },
    {},
  );

const genQueryApi = (configs) =>
  reduce(
    configs,
    (result, item) => {
      const [_name, _method] = item;

      const hook = async (...args) => {
        await waitLock();

        const res = await commandWaitAck(
          () => {
            workerIns.sendMessage({
              method: _method,
              args: [...args],
            });
          },
          async () => {
            return await hook(...args);
          },
          workerIns.id,
        );

        if (res) {
          return res.data;
        }
        return res;
      };

      return {
        ...result,
        [_name]: hook,
      };
    },
    {},
  );

const genMessageTransfer = (configs) =>
  reduce(
    configs,
    (result, item) => {
      const [_name, _method] = item;

      const hook = (callback) => {
        if (typeof callback !== 'function') {
          throw new Error(`Invalid ${_name} callback`);
        }

        event.on(_method, (data) => {
          callback(data);
        });
      };
      return {
        ...result,
        [_name]: hook,
      };
    },
    {},
  );

const socketConnectSub = (callback) => {
  if (typeof callback !== 'function') {
    throw new Error(`Invalid socketConnectSub callback`);
  }
  event.on(STATIC.CONNECT_SUB, (data) => {
    callback(data);
  });
};

const baseAPIs = genBaseApi([
  ['subscribe', STATIC.SUBSCRIBE], // 订阅
  ['unsubscribe', STATIC.UNSUBSCRIBE], // 取消订阅
  ['connect', STATIC.CONNECT], // 连接
  ['setCsrf', STATIC.SETCSRF], // 设置csrf token
  ['flush', STATIC.FLUSH], // 刷新缓冲区
]);

const queryAPIs = genQueryApi([
  ['connected', STATIC.CONNECTED], // 查询连接状态
  ['socketId', STATIC.SOCKETID], // 查询socketId
  ['getTopicState', STATIC.TOPICSTATE], // 查询topicState
]);

// 统一消息接收函数
const messageTransferAPIs = genMessageTransfer([
  ['topicPosition', STATIC.FUTURES_POSITION],
  ['topicActiveOrder', STATIC.FUTURES_ACTIVE_ORDER],
  ['topicStopOrder', STATIC.FUTURES_STOP_ORDER],
  ['topicWallet', STATIC.FUTURES_WALLET],
  ['topicMarkIndexPrice', STATIC.FUTURES_MARK_INDEX_PRICE],
  ['topicFundingRate', STATIC.FUTURES_FUNDING_RATE],
  ['topicCandleStick', STATIC.FUTURES_CANDLE_STICK],
  ['topicSnapshotVolume', STATIC.FUTURES_SNAPSHOT_VOLUME],
  ['topicTickerPrice', STATIC.FUTURES_TICKER_PRICE],
  ['topicRecentDeal', STATIC.FUTURES_RECENT_DEAL],
  ['topicNotice', STATIC.FUTURES_NOTICE_CENTER],
  ['topicLevel2', STATIC.FUTURES_LEVEL2],
  ['topicContract', STATIC.FUTURES_CONTRACT],
  ['topicRiskLimitChange', STATIC.FUTURES_RISK_LIMIT_CHANGE],
  ['topicContractUpdate', STATIC.FUTURES_CONTRACT_UPDATED],
  ['topicFuturesCrossLeverage', STATIC.FUTURES_CROSS_LEVERAGE],
  ['topicFuturesMarginMode', STATIC.FUTURES_MARGIN_MODE],
]);

// 如果开启合约
const initFuturesWorker = () => {
  if (isFuturesNew()) {
    workerIns = initWorker();
  }
};

const APIs = {
  ...baseAPIs,
  ...queryAPIs,
  ...messageTransferAPIs,
  socketConnectSub,
  initFuturesWorker,
};

export default APIs;
