import _isUndefined from 'lodash-es/isUndefined';
import qs from 'query-string';
import store from './store2';

interface QueryPersistenceOptions {
  queryKeys?: string[];
  storeNamespace?: string;
}

interface Store {
  session: (data?: any) => any;
  namespace: (namespace: string) => Store;
}

const _isString = s => typeof s === 'string';

class QueryPersistence {
  static UTM_GROUP = ['utm_source', 'utm_campaign', 'utm_medium'] as const;
  static RCODE = 'rcode';
  static UtmRcodeMap: { [key: string]: string } = {
    thirdPartClient: 'utm_source',
    utmCampaign: 'utm_campaign',
    utmMedium: 'utm_medium',
    referralCode: 'rcode',
  };

  private static instance: QueryPersistence | null = null;
  private queryKeys: string[];
  private store: Store;

  static transformObjWithMap = (obj: { [key: string]: any }, keyMap: { [key: string]: string }) => {
    return Object.keys(keyMap).reduce((result: { [key: string]: any }, key: string) => {
      const transformKey = keyMap[key];
      if (typeof obj[transformKey] !== 'undefined') {
        result[key] = obj[transformKey];
      }
      return result;
    }, {});
  };

  static getInstance(queryKeys: string[], storeNamespace: string): QueryPersistence {
    if (!this.instance) {
      this.instance = new QueryPersistence({ queryKeys, storeNamespace });
    }
    return this.instance;
  }

  constructor({ queryKeys = [], storeNamespace = '@gbiz.query.store' }: QueryPersistenceOptions) {
    if (Array.isArray(queryKeys)) {
      this.queryKeys = queryKeys;
    } else {
      throw new Error('queryKeys config must be an array');
    }

    this.store = store.namespace(storeNamespace);
    this.persistentQueryKeys();
  }

  // 从当前 URL 的查询参数中提取预定义的特定参数，并将其持久化到会话存储中​​
  // 预定义的参数为 UTM_GROUP RCODE
  persistentQueryKeys() {
    if (typeof window !== 'undefined') {
      const queryObj = qs.parse(window.location.search);
      if (Object.keys(queryObj).length === 0) {
        this.store.session({});
        return;
      }
      const collectedQueryObj = this.queryKeys.reduce((result: { [key: string]: string }, key: string) => {
        if (!_isString(key)) {
          throw new Error('queryKeys item must be string');
        }
        if (!_isUndefined(queryObj[key])) {
          result[key] = queryObj[key] as string;
        }
        return result;
      }, {});
      this.store.session(collectedQueryObj);
    } 
  }

  getPersistenceQuery(key?: string | string[]): any {
    if (_isString(key)) {
      return this.store.session(key);
    }

    if (Array.isArray(key)) {
      return key.reduce((result: { [key: string]: any }, currentKey: string) => {
        if (_isString(currentKey)) {
          const storeValue = this.store.session(currentKey);
          if (storeValue) {
            result[currentKey] = storeValue;
          }
        }
        return result;
      }, {});
    }

    return this.store.session();
  }

  // SSR 状态不记录store
  setPersistenceQuery(obj: { [key: string]: any }) {
    if (typeof window === 'undefined') {
      return null;
    }
    const data = this.queryKeys.reduce((result: { [key: string]: any }, key: string) => {
      if (!_isString(key)) {
        throw new Error('queryKeys item must be string');
      }
      if (!_isUndefined(obj[key])) {
        result[key] = obj[key];
      }
      return result;
    }, {});
    this.store.session(data);
  }

  formatUrlWithStore(url: string, widthOutParams: string[] = []): string {
    // SSR 状态不记录store
    if (!_isString(url) || typeof window === 'undefined') {
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
    let resultQuery: { [key: string]: string } = {};
    
    const currentOrigin = window.location.origin;
    const isSameOrigin = url.startsWith('/') || url.startsWith(currentOrigin);
    if (widthOutParams && widthOutParams.length && isSameOrigin) {
      const queryKeys = Object.entries(mergedQuery).map(([key]) => key);
      queryKeys.forEach((item) => {
        if (!widthOutParams.includes(item)) {
          resultQuery[item] = mergedQuery[item] as string;
        }
      });
    } else {
      resultQuery = mergedQuery;
    }

    const wrappedUrl = qs.stringifyUrl({ ...parsedUrl, query: resultQuery });

    return wrappedUrl;
  }
}

export const queryPersistence = QueryPersistence.getInstance(
  [...QueryPersistence.UTM_GROUP, QueryPersistence.RCODE],
  '@gbiz.query.store'
);

export const initQueryPersistence = () => {
  return queryPersistence;
};

export default QueryPersistence;
