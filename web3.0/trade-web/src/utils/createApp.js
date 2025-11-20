/**
 * Owner: borden@kupotech.com
 */
import { getDvaApp } from '@kucoin-base/dva';
import { determineBasenameFromUrl } from 'utils/lang';

export const localeBasename = determineBasenameFromUrl && determineBasenameFromUrl();

export const historyConfig = { basename: '/trade/' };
if (localeBasename && localeBasename !== 'en') {
  historyConfig.basename = `/${localeBasename}/trade/`;
}

const app = getDvaApp();
if (process.env.NODE_ENV === 'development') {
  window.$state = () => app._store.getState();
}
export const getStore = () => app._store;
export default app;
