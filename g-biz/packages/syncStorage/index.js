/**
 * Owner: garuda@kupotech.com
 */
import sentryReport from './sentryReport';
import isStorageValid from './isStorageValid';
import { _isQuotaExceeded, _handleQuotaExceeded } from './storageClean';
import {
  brandPrefix,
  getBrandSite,
  namespace,
  isSupportStorageType,
  defaultStorageType,
  STAND_SITE,
  NEED_SET_TWICE,
  FORCE_PUBLIC_KEY,
  FORCE_USE_KEY,
} from './constant';

class SyncStorage {
  constructor({ namespace = '', reporter, storageType = defaultStorageType } = {}) {
    // this.publicPrefix = '#-'; // 公共 key 前缀
    // this.brandPrefix = '!_'; // 私有 key 前缀
    this.siteKey = `${brandPrefix}${getBrandSite()}_`; // 特殊key, 根据这个识别
    this.namespace = namespace; // 默认值是 ''
    this.reporter = reporter || sentryReport;
    // this.isLegacyBrowser =
    //   navigator.userAgent.includes('MSIE') ||
    //   navigator.userAgent.includes('Trident/') ||
    //   navigator.userAgent.includes('Edge/16');
    this.NEED_CALLBACK = STAND_SITE;
    // check storageType 是否合法
    this.storageType =
      storageType && isSupportStorageType.includes(storageType) ? storageType : defaultStorageType;
    // 需要额外处理的 key 类型
    this.NEED_SET_TWICE = NEED_SET_TWICE;
  }

  // 检查是否需要强制使用 is_public
  _checkForcePublic = (key) => {
    return FORCE_PUBLIC_KEY.includes(key);
  };

  // 检查是否强制使用用户传入的 key
  _checkForceUseKey = (key) => {
    return FORCE_USE_KEY.includes(key);
  };

  // check 是否要执行兜底逻辑
  _checkFallback = () => {
    console.log('check --->', this.NEED_CALLBACK.includes(getBrandSite()));
    return this.NEED_CALLBACK.includes(getBrandSite());
  };

  // check 是否需要执行额外的处理，不进行删除（只对 global 站做处理）
  _checkSetTwiceKeys = (key) => {
    return this.NEED_SET_TWICE.includes(key) && this._checkFallback();
  };

  // 拼接 base prefix key
  // 拼接逻辑： `${this.namespace}${key}`
  _getBasePrefix = (key) => {
    const fbKey = `${this.namespace}${key}`;

    return fbKey;
  };

  // 添加前缀 key
  // public key {namespace}{key}
  // 站点 key !_{site}_{namespace}{key}
  _addPrefix = (key, { isPublic } = {}) => {
    if (this._checkForceUseKey(key)) {
      return key;
    }
    const basePrefix = this._getBasePrefix(key);
    if (this._checkForcePublic(basePrefix)) {
      return basePrefix;
    }
    return isPublic ? basePrefix : `${this.siteKey}${basePrefix}`;
  };

  _getItem = (type, key, { isPublic = false } = {}) => {
    try {
      // 兼容不支持场景
      if (!isStorageValid(type)) {
        return null;
      }
      const checkSetTwice = this._checkSetTwiceKeys(key);
      let data = null;
      // 如果满足设置两次 key 的场景，则取兜底 key
      if (checkSetTwice) {
        data = window[type].getItem(this._getBasePrefix(key, { isPublic }));
      } else {
        data = window[type].getItem(this._addPrefix(key, { isPublic }));
        // 没有 data 并且需要触发兜底逻辑
        if (!data && this._checkFallback()) {
          data = window[type].getItem(this._getBasePrefix(key, { isPublic }));
        }
      }
      // 这里兼容下取值，之前用原生 localStorage 存的值，可能千奇百怪
      try {
        return JSON.parse(data);
      } catch (e) {
        if (data) return data;
        throw e;
      }
    } catch (e) {
      this.reporter(`syncStorage ${type} getItem error`, e);
      return null;
    }
  };

  _setItem = (type, key, value, { isPublic = false } = {}) => {
    const prefixKey = this._addPrefix(key, { isPublic });
    const saveValue = JSON.stringify(value);
    try {
      // 兼容不支持场景
      if (!isStorageValid(type)) {
        return null;
      }
      const checkSetTwice = this._checkSetTwiceKeys(key);
      // 如果触发兜底 并且不是 public key 并且不是设置两次的 key 类型，则先删除
      if (this._checkFallback() && !isPublic && !checkSetTwice) {
        this._removeItem(type, key, { isPublic: true });
      }
      // 如果满足设置两次的场景，需要设置下 兜底 key
      if (checkSetTwice) {
        window[type].setItem(this._getBasePrefix(key, { isPublic }), saveValue);
      }
      window[type].setItem(prefixKey, saveValue);
    } catch (e) {
      if (_isQuotaExceeded(e)) {
        _handleQuotaExceeded({
          type,
          prefix: this.siteKey,
          key: prefixKey,
          saveValue,
          reporter: this.reporter,
        });
      } else {
        this.reporter(`syncStorage ${type} setItem error for unknown`, e);
      }
    }
  };

  _removeItem = (type, key, { isPublic = false } = {}) => {
    try {
      // 兼容不支持场景
      if (!isStorageValid(type)) {
        return null;
      }
      window[type].removeItem(this._addPrefix(key, { isPublic }));
    } catch (err) {
      console.warn({
        message: 'Sorry, the browser’s storage space is full.',
        description: `To ensure the normal usage, please visit Tools > Clear
         Recent History > Cookies and select All in Time Range to release the storage space.`,
      });
      this.reporter(`syncStorage ${type} removeItem error`, err);
      return null;
    }
  };

  getItem = (key, { isPublic = false } = {}) => {
    return this._getItem(this.storageType, key, { isPublic });
  };

  setItem = (key, value, { isPublic = false } = {}) => {
    return this._setItem(this.storageType, key, value, { isPublic });
  };

  removeItem = (key, { isPublic = false } = {}) => {
    return this._removeItem(this.storageType, key, { isPublic });
  };
}

export { brandPrefix, namespace, isSupportStorageType, defaultStorageType };

export default SyncStorage;
