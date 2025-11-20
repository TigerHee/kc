/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import Worker from 'services/workers/websocket.worker';
import { evtEmitter } from 'helper';
import { delay } from 'dva/saga';
import sentry from '@kc/sentry';
import { MESSAGE, STATIC, PushTypes } from 'services/workers/websocket.const';

export { PushConf, PrivateTopics } from 'services/workers/websocket.const';
// import SUBJECT_CONFIG from 'services/workers/notice.subjects.conf';

const _LOOP_ = () => {};
const _ROUND_TS_ = 20;

const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

// #region 用来处理一些新增的订阅信息
const PushTypesMessageTransferKeys = [];
const PushTypesHash = Object.values(PushTypes).reduce((res, val) => {
  res[val] = true;
  PushTypesMessageTransferKeys.push([val, val]);
  return res;
}, {});

export const isPushType = (type) => {
  return !!PushTypesHash[type];
};
// #endregion

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

const event = evtEmitter.getEvt('websocket.process');
// const NOTICE_SUBJECTS_TYPES = _.map(Object.keys(SUBJECT_CONFIG), subject => `${STATIC.NOTICECENTER}@${subject}`);

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
    } else
    if (typeof data === 'object' && data.workerSuccess) {
      // console.log(`emit ${STATIC.RESULT}_${data.id}`);
      event.emit(`${STATIC.RESULT}_${data.id}`, data);
    } else
    if (typeof data === 'object' && (
      data.type === STATIC.DEALORDERS ||
      data.type === STATIC.SYMBOLPRICEUPDOWN ||
      // data.type === STATIC.TRADEORDERS ||
      data.type === STATIC.TRADEORDERSBATCH ||
      data.type === STATIC.TRADEORDERSBATCHFREQUENCY500 ||
      data.type === STATIC.ADVANCEDORDERS ||
      data.type === STATIC.ADVANCEDORDERSFREQUENCY500 ||
      data.type === STATIC.OPENPRDERSL2 ||
      data.type === STATIC.OPENPRDERSL2Limit50 ||
      data.type === STATIC.CANDLEUPDATE ||
      data.type === STATIC.CANDLEADD ||
      data.type === STATIC.CANDLEREFRESH ||
      data.type === STATIC.MARKETSNAPSHOT ||
      data.type === STATIC.DEBTRATIO ||
      data.type === STATIC.POSITIONSTATUS ||
      data.type === STATIC.MARKPRICETICK ||
      data.type === STATIC.MARGINFUNDNAV ||
      data.type === STATIC.NOTICECENTER ||
      data.type === STATIC.POSITIONCHANGE ||
      data.type === STATIC.NOTICE_CENTER ||
      isPushType(data.type)
      // _.indexOf(NOTICE_SUBJECTS_TYPES, data.type) >= 0
    )) {
      event.emit(data.type, data.arr);
    } else if (
      typeof data === 'object' &&
      [STATIC.BALANCE, STATIC.CROSSBALANCECHANGE].includes(data.type)
    ) {
      event.emit(data.type, data.data);
    }
    if (typeof data === 'object' && data.method === STATIC.GETSOCKETSTORAGE) {
      // 获取缓存
      const { key } = data || {};
      let _data = '';
      if (key) {
        _data = localStorage.getItem(key) || '';
      }
      sendMessage({ ...data, data: _data || '' });
    }
    if (typeof data === 'object' && data.method === STATIC.SETSOCKETSTORAGE) {
      // 设置缓存
      const { key, data: _data = '' } = data || {};
      if (key) {
        localStorage.setItem(key, _data || '');
      }
    }
    if (typeof data === 'object' && data.method === STATIC.DELSOCKETSTORAGE) {
      // 删除缓存
      const { key } = data || {};
      if (key) {
        localStorage.removeItem(key);
      }
    }
    // 重连5次依然失败sentry上报
    if (typeof data === 'object' && data.type === STATIC.RECONNECTERROR) {
      try {
        sentry.captureEvent({
          message: 'websocket: 重连5次依然失败',
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

  // reinit while retry counter -> 0
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
let workerIns = initWorker();

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
          console.log('WebSocket process worker terminated',
            `wId: ${workerInstanceId}`, `gwId: ${workerId}`);
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
  return Promise.race([
    timeout(),
    workerResult(run),
  ]);
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

const genBaseApi = configs => _.reduce(configs, (result, item) => {
  const [_name, _method] = item;

  const hook = async (...args) => {
    await waitLock();

    const res = await commandWaitAck(() => {
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
    }, async () => {
      return await hook(...args);
    }, workerIns.id);
    return res;
  };
  return {
    ...result,
    [_name]: hook,
  };
}, {});

const genQueryApi = configs => _.reduce(configs, (result, item) => {
  const [_name, _method] = item;

  const hook = async (...args) => {
    await waitLock();

    const res = await commandWaitAck(() => {
      workerIns.sendMessage({
        method: _method,
        args: [...args],
      });
    }, async () => {
      return await hook(...args);
    }, workerIns.id);

    if (res) {
      return res.data;
    }
    return res;
  };

  return {
    ...result,
    [_name]: hook,
  };
}, {});

const genMessageTransfer = configs => _.reduce(configs, (result, item) => {
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
}, {});

const baseAPIs = genBaseApi([
  ['subscribe', STATIC.SUBSCRIBE], // 订阅
  ['unsubscribe', STATIC.UNSUBSCRIBE], // 取消订阅
  ['flush', STATIC.FLUSH], // 刷新缓冲区
  ['connect', STATIC.CONNECT], // 连接
  ['setCsrf', STATIC.SETCSRF], // 设置csrf token
]);

const queryAPIs = genQueryApi([
  ['connected', STATIC.CONNECTED], // 查询连接状态
  ['socketId', STATIC.SOCKETID], // 查询socketId
  ['getTopicState', STATIC.TOPICSTATE], // 查询topicState
]);

const messageTransferAPIs = genMessageTransfer([
  ['openOrdersL2Message', STATIC.OPENPRDERSL2],
  ['openOrdersL2Limit50', STATIC.OPENPRDERSL2Limit50],
  ['dealOrdersMessage', STATIC.DEALORDERS],
  ['symbolPriceUpDown', STATIC.SYMBOLPRICEUPDOWN], // 4.0专用，行情涨跌幅 topic
  ['tradeOrdersMessage', STATIC.TRADEORDERS],
  ['tradeOrdersBatchMessage', STATIC.TRADEORDERSBATCH],
  ['tradeOrdersBatchMessageF500', STATIC.TRADEORDERSBATCHFREQUENCY500], // 4.0专用，限频topic
  ['advancedOrdersMessage', STATIC.ADVANCEDORDERS],
  ['advancedOrdersMessageF500', STATIC.ADVANCEDORDERSFREQUENCY500], // 4.0专用，限频topic
  ['accountBalanceMessage', STATIC.BALANCE],
  ['crossBalanceChangeMessage', STATIC.CROSSBALANCECHANGE],
  ['candleUpdateMessage', STATIC.CANDLEUPDATE],
  ['candleAddMessage', STATIC.CANDLEADD],
  ['candleRefreshMessage', STATIC.CANDLEREFRESH],
  ['marketSnapshotMessage', STATIC.MARKETSNAPSHOT],
  // ...(_.map(Object.keys(SUBJECT_CONFIG), subject => [`noticeCenterMessage@${subject.replace(/[.-]/g, '')}`, `${STATIC.NOTICECENTER}@${subject}`])),
  ['noticeCenterMessage', STATIC.NOTICECENTER],
  ['debtRatioMessage', STATIC.DEBTRATIO],
  ['positionStatusMessage', STATIC.POSITIONSTATUS],
  ['markPriceTickMessage', STATIC.MARKPRICETICK],
  ['marginFundNavMessage', STATIC.MARGINFUNDNAV],
  ['positionChangeMessage', STATIC.POSITIONCHANGE],
  ['futuresNoticeCenterMessage', STATIC.NOTICE_CENTER],
  ...PushTypesMessageTransferKeys,
]);

const APIs = {
  ...baseAPIs,
  ...queryAPIs,
  ...messageTransferAPIs,
};

export default APIs;
