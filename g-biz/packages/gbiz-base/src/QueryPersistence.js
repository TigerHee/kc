/**
 * Owner: iron@kupotech.com
 */
import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';
import _isUndefined from 'lodash/isUndefined';
import _reduce from 'lodash/reduce';
import qs from 'query-string';
import store from './store2';

class QueryPersistence {
  static UTM_GROUP = ['utm_source', 'utm_campaign', 'utm_medium'];

  static RCODE = 'rcode';

  static UtmRcodeMap = {
    thirdPartClient: 'utm_source',
    utmCampaign: 'utm_campaign',
    utmMedium: 'utm_medium',
    referralCode: 'rcode',
  };

  static transformObjWithMap = (obj, keyMap) => {
    return _reduce(
      Object.keys(keyMap),
      (result, key) => {
        const transformKey = keyMap[key];
        if (typeof obj[transformKey] !== 'undefined') {
          result[key] = obj[transformKey];
        }

        return result;
      },
      {},
    );
  };

  static getInstance = (queryKeys, storeNamespace) => {
    if (!this.instance) {
      this.instance = new QueryPersistence(queryKeys, storeNamespace);
    }

    return this.instance;
  };

  constructor({ queryKeys = [], storeNamespace = '@gbiz.query.store' }) {
    this.instance = null;
    if (_isArray(queryKeys)) {
      this.queryKeys = queryKeys;
    } else {
      throw new Error('queryKeys config must be an array');
    }

    this.store = store.namespace(storeNamespace);
    this.persistentQueryKeys();
  }

  persistentQueryKeys() {
    if (typeof window !== 'undefined') {
      const queryObj = qs.parse(window.location.search);

      // 从queryObj里面提取queryKeys

      const collectedQueryObj = _reduce(
        this.queryKeys,
        (result, key) => {
          if (!_isString(key)) {
            throw new Error('queryKeys item must be string');
          }

          if (!_isUndefined(queryObj[key])) {
            result[key] = queryObj[key];
          }

          return result;
        },
        {},
      );

      this.store.session(collectedQueryObj);
    } else {
      console.warn('window object is undefined, please check the run time env');
    }
  }

  getPersistenceQuery(key) {
    if (_isString(key)) {
      return this.store.session(key);
    }

    if (_isArray(key)) {
      return _reduce(
        key,
        (result, currentKey) => {
          if (_isString(currentKey)) {
            const storeValue = this.store.session(currentKey);

            if (storeValue) {
              result[currentKey] = storeValue;
            }
          }

          return result;
        },
        {},
      );
    }

    return this.store.session();
  }

  setPersistenceQuery(obj) {
    const data = _reduce(
      this.queryKeys,
      (result, key) => {
        if (!_isString(key)) {
          throw new Error('queryKeys item must be string');
        }

        if (!_isUndefined(obj[key])) {
          result[key] = obj[key];
        }

        return result;
      },
      {},
    );

    this.store.session(data);
  }

  // widthOutParams=[],不应该出现在url-query参数中的参数。
  formatUrlWithStore(url, widthOutParams) {
    if (!_isString(url)) {
      return url;
    }

    const { query: currentQuery, ...parsedUrl } = qs.parseUrl(url, {
      parseFragmentIdentifier: true,
    });

    const queryObj = this.store.session();

    const mergedQuery = {
      ...currentQuery,
      ...queryObj,
    };
    let resultQuery = {};
    // 同域下的链接
    const currentOrigin = window.location.origin;
    const isSameOrigin = url.startsWith('/') || url.startsWith(currentOrigin);
    if (widthOutParams && widthOutParams.length && isSameOrigin) {
      const queryKeys = Object.entries(mergedQuery).map(([key]) => {
        return key;
      });
      queryKeys.forEach((item) => {
        if (!widthOutParams.includes(item)) {
          resultQuery[item] = mergedQuery[item];
        }
      });
    } else {
      resultQuery = mergedQuery;
    }

    const wrappedUrl = qs.stringifyUrl({ ...parsedUrl, query: resultQuery });

    return wrappedUrl;
  }
}

export const queryPersistence = QueryPersistence.getInstance({
  queryKeys: [...QueryPersistence.UTM_GROUP, QueryPersistence.RCODE],
});

export const initQueryPersistence = () => {
  return queryPersistence;
};

export default QueryPersistence;
