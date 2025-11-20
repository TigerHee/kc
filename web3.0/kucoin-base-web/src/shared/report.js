import storage from '@kucoin-base/syncStorage';
import { v4 as uuidV4 } from 'uuid';
import { IS_PROD } from '@utils/env';
export default function report(deviceInfo, options={}) {
  const states = {
    UNINIT: 'uninit',
    PENDING: 'pending',
    INITED: 'inited',
  };

  let state = states.UNINIT;
  let Report = null;

  function replayQueue() {
    if (proxyReport.queue.length) {
      const { name, args, resolve, reject } = proxyReport.queue.shift();
      if (resolve && reject) {
        Report[name]
          .apply(Report, args)
          .then((value) => resolve(value))
          .catch((e) => reject(e));
      } else {
        Report[name].apply(Report, args);
      }

      replayQueue(Report);
    }
  }

  [
    'setIDConfig',
    'logWebNetwork',
    'logSelfDefined',
    'logStay',
    'logAction',
    'logFingerprint@async',
  ].forEach(function (n) {
    const [name, asyncTag] = n.split('@');
    proxyReport[name] = proxyReport.apply(null, [name, asyncTag]);
  });

  function proxyReport(name, asyncTag) {
    return function (...args) {
      // 这里是按需初始化，只有在 Report 实例方法被调用的时候，才会进行初始化
      if (state === states.UNINIT) {
        state = states.PENDING;
        System.import('@kc/report').then(({ default: R }) => {
          // 完成初始化
          reportConf(R, deviceInfo, options);
          Report = R;
          // 回放队列
          replayQueue(R);
          // 将状态设置为完成
          state = states.INITED;
        });
      }

      // 如果 Report 没有初始化，则将调用放到队列中
      if (!Report) {
        proxyReport.queue = proxyReport.queue || [];
        if (asyncTag === 'async') {
          // 如果是异步方法，这里需要返回一个 pending 中的 promise，在队列回放完成的时候，去调用 promise 的 resolve/reject 方法
          const promise = new Promise((resolve, reject) => {
            proxyReport.queue.push({
              name,
              args,
              resolve,
              reject,
            });
          });

          return promise;
        }

        proxyReport.queue.push({
          name,
          args,
        });
      } else {
        return Report[name].apply(Report, args);
      }
    };
  }

  return proxyReport;
}

function reportConf(Report, deviceInfo, options) {
  Report.useV2(); // eslint-disable-line

  Report.configure({
    host: window.location.origin,
    api: '/_api/frontend-event-tracking/eventTracking',
    deviceInfo,
    channel: 'web',
    env: IS_PROD ? 'prod' : 'test',
    ...options
  });

  // 设置设备ID
  let clientId = storage.getItem('clientId', {
    isPublic: true,
  });
  if (!clientId) {
    clientId = uuidV4();
    storage.setItem('clientId', clientId, {
      isPublic: true,
    });
  }
  Report.setIDConfig(null, clientId);
}
