/**
 * Owner: willen@kupotech.com
 */
/**
 * 用于封装缓存location的pull
 */

let onCache = false;

function _isDefaultHost(url) {
  return url.indexOf('/') === 0 && url.indexOf('//') !== 0;
}

const pullWrapper =
  (pull) =>
  (url, ...restArgs) => {
    if (onCache) {
      if (_isDefaultHost(url)) {
        const _url = `/kcscache${url}`;
        return pull(_url, ...restArgs);
      }
    }

    return pull(url, ...restArgs);
  };

const setOnCache = (cache) => {
  onCache = cache;
};

const isOnCache = () => {
  return onCache;
};

export { pullWrapper, isOnCache, setOnCache };
