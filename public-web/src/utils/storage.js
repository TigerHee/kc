/**
 * Owner: willen@kupotech.com
 */
// storage.js 文件
import SyncStorage, { namespace } from '@kucoin-biz/syncStorage';

const defaultLocalStorage = new SyncStorage({
  namespace,
  storageType: 'localStorage',  // 默认值为 localStorage
});

export const kcLocalStorage = new SyncStorage({
  namespace: 'kc_',
  storageType: 'localStorage',
})


export const noPrefixLocalStorage = new SyncStorage({
  namespace: '',
  storageType: 'localStorage',  // 默认值为 localStorage
});

export const noPrefixSessionStorage = new SyncStorage({
  namespace: '',
  storageType: 'sessionStorage',  // 默认值为 localStorage
});


export default defaultLocalStorage;
