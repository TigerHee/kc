/**
 * Owner: borden@kupotech.com
 */

import Worker from 'services/workers/level2.worker';
import { evtEmitter } from 'helper';
import { delay } from 'dva/saga';
import { ab2str, str2ab, checkTransferables } from 'utils/convert';
import { MESSAGE, STATIC } from 'services/workers/level2.const';

const _LOOP_ = () => {};
const _ROUND_TS_ = 20;

const state = {
  pending: true,
};
const event = evtEmitter.getEvt('level2.depth.calc');

/**
 * Worker
 */
const initWorker = () => {
  setDepthCalcPending();

  const worker = new Worker();
  console.log('L2 calc worker init');

  // check transferables
  const transferables = checkTransferables(worker);

  worker.addEventListener('message', (e) => {
    let data;
    const edata = e.data;
    if (transferables) {
      try {
        data = JSON.parse(ab2str(edata));
      } catch (err) {
        console.error(err);
      }
    } else {
      data = JSON.parse(edata);
    }

    if (!data) {
      return;
    }
    if (typeof data === 'string' && data === MESSAGE.PONG) {
      unsetDepthCalcPending();
    } else
    if (typeof data === 'object' && data.workerSuccess) {
      event.emit(STATIC.RESULT, data);
    }
  });

  const sendMessage = (msg) => {
    // console.log(JSON.stringify(msg).length / 1024, 'kb');
    if (!transferables) {
      worker.postMessage(JSON.stringify(msg));
    } else {
      const sendAb = str2ab(JSON.stringify(msg));
      worker.postMessage(sendAb, [sendAb]);
    }
  };
  sendMessage(MESSAGE.PING);

  return {
    worker,
    sendMessage,
  };
};

// Worker Variable
let workerIns = initWorker();

const level2DepthCalc = async (...args) => {
  let res = await raceWorker(() => {
     // 提交计算
    workerIns.sendMessage({
      calc: true,
      args: [...args],
    });
  });
  if (res === STATIC.TIMEOUT) {
    // 重启worker
    if (typeof workerIns.worker.terminate === 'function') {
      workerIns.worker.terminate();
      console.log('L2 calc worker terminated');
    }
    workerIns = initWorker();
    // 重新计算
    res = await level2DepthCalc(...args);
  }
  // console.log(res);
  return res;
};

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

function workerResult(fun) {
  return new Promise((resolve, reject) => {
    // 获取结果
    event.once(STATIC.RESULT, (data) => {
      resolve(data);
    });
    fun();
  });
}

/**
 * 设置pending占用
 */
function setDepthCalcPending() {
  state.pending = true;
}

/**
 * 解除pending占用
 */
function unsetDepthCalcPending() {
  state.pending = false;
}

/**
 * 是否pending
 */
function isDepthCalcPending() {
  return state.pending;
}

/**
 * 抢占并行锁
 * @return false || Function
 */
export const fightDepthCalcLock = async (fight) => {
  if (!fight) {
    if (isDepthCalcPending()) {
      // 直接阻止后续执行流程
      return false;
    } else {
      // 独占流程
      setDepthCalcPending();
    }
  } else {
    // 等着抢占后继续执行
    while (true) {
      await delay(_ROUND_TS_);
      if (!isDepthCalcPending()) {
        setDepthCalcPending();
        break;
      }
    }
  }

  return () => {
    // 解除独占
    unsetDepthCalcPending();
  };
};

/**
 * 暂存level2变更
 * @return false || Function
 */
const _updatesStash = {};
export const stashUpdates = async (coinPair, changes) => {
  let firstStash = false;
  if (!_updatesStash[coinPair]) {
    firstStash = true;
    _updatesStash[coinPair] = { asks: [], bids: [] };
  }
  _updatesStash[coinPair].asks = changes.asks;
  _updatesStash[coinPair].bids = changes.bids;

  if (firstStash) {
    while (true) {
      await delay(_ROUND_TS_);
      if (!isDepthCalcPending()) {
        setDepthCalcPending();
        break;
      }
    }
    return () => {
      // 解除独占
      unsetDepthCalcPending();
    };
  }
  return false;
};

/**
 * 取出level2变更并清除暂存
 */
export const popUpdates = (coinPair) => {
  if (_updatesStash[coinPair]) {
    const asks = _updatesStash[coinPair].asks;
    const bids = _updatesStash[coinPair].bids;

    delete _updatesStash[coinPair];

    return {
      coinPair,
      changes: {
        asks,
        bids,
      },
    };
  }
  return false;
};

/**
 * 清除暂存
 * @param {*} coinPair
 */
export const cleanUpdates = (coinPair) => {
  if (_updatesStash[coinPair]) {
    delete _updatesStash[coinPair];
  }
};

export default level2DepthCalc;
