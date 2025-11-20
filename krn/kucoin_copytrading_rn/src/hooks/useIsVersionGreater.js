import {useMount} from 'ahooks';
import {useCallback, useState} from 'react';

import {compareVersion, getNativeInfo} from 'utils/helper';

// 使用模块级变量进行缓存
let nativeInfoCache = null;
let pendingPromise = null;
/** 传入版本号判断 是否大于当前 APP版本hook
 * 用法eg：
 * const isVersionGreater = useIsVersionGreater();
 * * 假设某个地方获取到 inputVersion
 * const inputVersion = '2.0.1';
 * const currentVersion = '1.0.0';
 * const check = isVersionGreater(inputVersion);
 */
export const useIsVersionGreater = () => {
  const [appVersion, setAppVersion] = useState('');

  useMount(async () => {
    // 如果已有缓存直接使用
    if (nativeInfoCache) {
      setAppVersion(nativeInfoCache.version);
      return;
    }

    // 处理并发请求
    if (!pendingPromise) {
      pendingPromise = getNativeInfo();
    }

    try {
      const nativeInfo = await pendingPromise;
      nativeInfoCache = nativeInfo; // 缓存结果
      setAppVersion(nativeInfo?.version || '');
    } catch (error) {
      console.error('Failed to get native info:', error);
      pendingPromise = null; // 失败时重置
    }
  });

  const checkVersion = useCallback(
    inputVersion => {
      if (!appVersion) return null;
      return compareVersion(appVersion, inputVersion) >= 0;
    },
    [appVersion],
  );

  return checkVersion;
};
