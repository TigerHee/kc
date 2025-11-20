/**
 * Owner: garuda@kupotech.com
 * 清除 key 以及重试方法
 */

import { brandPrefix } from './constant';

// 收集所有需要清除的 key
export const _legacyStorageCleanup = (type: string, prefix: string) => {
  // IE/Edge的特殊清理逻辑
  // 需要遍历后先收集所有key再删除
  const keys: string[] = [];
  for (let i = 0; i < window[type].length; i++) {
    const k = window[type].key(i);
    // 这个地方会把 传入 prefix 的也删除，是符合规则的
    if (k && k?.startsWith(brandPrefix) && !k?.startsWith(prefix)) {
      keys.push(k);
    }
  }
  console.log('clean --->', keys);
  return keys;
};

// 检测存储 超额
export const _isQuotaExceeded = (error: any) => {
  // Chrome/Firefox 标准错误
  if (error instanceof DOMException) {
    return (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      // 兼容旧版浏览器
      error.code === 22 || // Chrome
      error.code === 1014 || // Firefox
      // Safari 特殊处理
      (typeof error.message === 'string' && error.message?.includes('QuotaExceeded')) ||
      // IE/Edge 兼容
      (navigator.userAgent.includes('MSIE') && error.message === 'Storage quota exceeded')
    );
  }
  // 移动端特殊处理
  if (/Mobi/.test(navigator.userAgent)) {
    return error?.message?.includes('超出存储限制') || error?.message?.includes('storage limit');
  }
};

// 批量删除方法
export const _batchDelete = (
  type: string,
  keys: string[],
  callback: () => void,
  reporter: (message: string, error?: any) => void
) => {
  const BATCH_SIZE = 50;
  let index = 0;

  const deleteNextBatch = () => {
    const batch = keys.slice(index, index + BATCH_SIZE);
    batch.forEach(key => {
      try {
        window[type].removeItem(key);
      } catch (e) {
        // 处理删除过程中可能出现的异常
        console.warn(`删除 ${key} 失败:`, e);
        typeof reporter === 'function' && reporter(`${type} retry _batchDelete error for unknown`, e);
      }
    });

    index += BATCH_SIZE;
    if (index < keys.length) {
      // 使用微任务避免阻塞
      Promise.resolve().then(deleteNextBatch);
    } else {
      typeof callback === 'function' && callback();
    }
  };

  deleteNextBatch();
};

// 重试方法
export const _retryOperation = ({
  type,
  key,
  saveValue,
  reporter,
}: {
  type: string;
  key: string;
  saveValue: any;
  reporter: (message: string, error?: any) => void;
}) => {
  try {
    // 先尝试直接存储
    window[type].setItem(key, saveValue);
  } catch (retryError) {
    console.error('retryError --->', retryError);
    // 二次错误类型分析
    if (typeof reporter === 'function') {
      if (_isQuotaExceeded(retryError)) {
        reporter(`${type} retry setItem error for quotaExceeded`, retryError);
      } else {
        reporter(`${type} retry setItem error for unknown`, retryError);
      }
    }
  }
};

// 执行存储超额方法
export const _handleQuotaExceeded = ({
  type,
  prefix,
  key,
  saveValue,
  reporter,
}: {
  type: string;
  prefix: string;
  key: string;
  saveValue: any;
  reporter: (message: string, error?: any) => void;
}) => {
  try {
    const externalKeys = _legacyStorageCleanup(type, prefix);

    _batchDelete(
      type,
      externalKeys,
      () => {
        _retryOperation({ type, key, saveValue, reporter });
      },
      reporter
    );
  } catch (e) {
    typeof reporter === 'function' && reporter(`${type} _handleQuotaExceeded error for unknown`, e);
  }
};
