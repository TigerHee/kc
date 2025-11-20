/**
 * Owner: terry@kupotech.com
 */
import { SyncStorage, namespace } from '@kc/storage';
import { storagePrefix } from 'config';

/**
 * kucoinv2_ 前缀的localStorage
 */
export const kucoinStorage = new SyncStorage({
  namespace, // kucoinv2_ 前缀
});

/**
 * land_ 前缀的localStorage
 */
export default new SyncStorage({
  namespace: storagePrefix, // land_ 前缀
});


/**
 * 不带key前缀的localStorage，主要配合.getItem（xx, {isPublic: true}）
 * 平替window.localStorage.getItem('kc_theme')
 */
export const noPrefixLocalStorage = new SyncStorage({
  namespace: ''
});

/**
 * 不带key前缀的sessionStorage，主要配合.getItem（xx, {isPublic: true}）
 * 平替window.sessoinStorage.getItem('rcode')
 */
export const noPrefixSessionStorage = new SyncStorage({
  // todo 需要和其他项目namespace保持一致，目前仅rcode会使用
  namespace: '',
  storageType: 'sessionStorage',
});