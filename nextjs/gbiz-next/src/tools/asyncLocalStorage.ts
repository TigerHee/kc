import type { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

import type { AsyncLocalStorage as ALS } from 'async_hooks';

type AsyncStore = IncomingMessage & { cookies: NextApiRequestCookies };

export let asyncLocalStorage: ALS<AsyncStore> | null = null;

if (typeof window === 'undefined') {
  const { AsyncLocalStorage } = require('async_hooks');
  asyncLocalStorage = new AsyncLocalStorage();
}
const DEFAULT_CONTEXT = {
  cookies: {},
  headers: {},
  method: 'GET',
  url: '',
};

export function getNextSSRStore(): AsyncStore | typeof DEFAULT_CONTEXT {
  return asyncLocalStorage?.getStore() || DEFAULT_CONTEXT;
}

export function runNextSSRStore<T>(store: AsyncStore, callback: () => T): T {
  if (!asyncLocalStorage) {
    // 非SSR直接执行
    return callback();
  }
  return asyncLocalStorage.run(store, callback);
}
