import { basename } from '@kucoin-base/i18n';

import { createBrowserHistory } from 'history-with-query';

let history = patchHistory(createBrowserHistory({ basename }));

function patchHistory(history) {
  const oldListen = history.listen;

  history.listen = (callback) => {
    const cbStr = callback.toString();

    const isConnectedRouterHandler =
      (callback.name === 'handleLocationChange' && cbStr.indexOf('onLocationChanged') > -1) ||
      (cbStr.indexOf('.inTimeTravelling') > -1 &&
        cbStr.indexOf('.inTimeTravelling') > -1 &&
        cbStr.indexOf('arguments[2]') > -1);

    // why add __isDvaPatch: true

    // since it's a patch from dva, we need to identify it in the listen handlers

    callback(history.location, history.action, { __isDvaPatch: true });

    return oldListen.call(history, (...args) => {
      if (isConnectedRouterHandler) {
        callback(...args);
      } else {
        // Delay all listeners besides ConnectedRouter

        setTimeout(() => {
          callback(...args);
        });
      }
    });
  };

  return history;
}

let cb = null;
history.listen(location => {
  if (cb) document.removeEventListener('click', cb);
  cb = () => {
    if (!window.sensors || window.sensors.__page_clicked__) return;
    window.sensors.track('page_click', {
      pathname: location.pathname
    });
  };
  document.addEventListener('click', cb, { once: true });
});

export function createAppHistory(options = {}) {
  history = patchHistory(createBrowserHistory(options));

  return history;
}

export const getHistory = () => {
  return history;
};

export default history;
