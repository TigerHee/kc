import {storage} from '@krn/toolkit';
import * as Sentry from '@sentry/react-native';

import {queryClient} from 'config/queryClient';

const CACHE_PARENT_UID = 'CACHE_PARENT_UID';
const PRELOAD_CACHE_KEY = 'PRELOAD_CACHE_KEY';

/**
 * QueryClientCacheController 类用于管理 React Query 的查询缓存。
 * 提供基于父账户 UID 变化的缓存清理机制，确保不同用户数据隔离
 */
export class QueryClientCacheController {
  /**
   * 根据父级 UID 重置查询缓存
   * - 当检测到 UID 变更时（与新传入 UID 不一致），清空所有查询缓存
   * - 更新存储的 UID 为最新值
   * @static
   * @param {string} uid - 当前父账户的 UID
   * @returns {Promise<void>}
   */
  static async resetQueriesByParentUid(uid) {
    const cacheUid = await storage.getItem(CACHE_PARENT_UID);

    if (uid !== cacheUid && cacheUid) {
      queryClient.clear();
    }

    storage.setItem(CACHE_PARENT_UID, uid);
  }

  /**
   * 强制重置所有查询缓存
   * - 清空 React Query 客户端缓存
   * - 重置存储的 UID 为空值
   * @static
   * @returns {Promise<void>}
   */
  static async resetQueries() {
    const cacheUid = await storage.getItem(CACHE_PARENT_UID);
    if (!cacheUid) {
      return;
    }

    queryClient.clear();
    storage.setItem(CACHE_PARENT_UID, '');
  }
}

/**
 * QueryPreloadController 类用于管理查询数据的预加载机制
 * - 支持预写查询数据到持久化存储
 * - 支持初始化时恢复预存的查询数据
 * - 提供缓存数据的生命周期管理
 */
export class QueryPreloadController {
  /**
   * 预写入查询数据到缓存存储
   * @static
   * @param {string} queryKey - React Query 的查询键
   * @param {Object} data - 要预存的数据（需符合接口防腐层结构）
   * @returns {Promise<void>}
   */
  static async preWriteQueryData(queryKey, data) {
    if (!queryKey) return;
    queryClient.setQueryData(queryKey, data);

    const preloadCache = (await storage.getItem(PRELOAD_CACHE_KEY)) || [];
    const writeTime = Date.now();

    const existing = preloadCache.find(item => item.queryKey === queryKey);
    if (existing) {
      existing.data = data;
      existing.time = writeTime;
    } else {
      preloadCache.push({queryKey, data, time: writeTime});
    }

    await storage.setItem(PRELOAD_CACHE_KEY, preloadCache);
  }

  /**
   * 获取所有预存的查询数据
   * @static
   * @returns {Promise<Array>} 返回包含预存查询数据的数组
   */
  static async getPreWriteQueriesData() {
    return (await storage.getItem(PRELOAD_CACHE_KEY)) || [];
  }

  /**
   * 初始化预存查询数据到 React Query 客户端
   * - 从存储加载所有预存数据
   * - 将数据设置到 QueryClient 中
   * - 清理已加载的缓存数据
   * - 包含错误监控上报机制
   * @static
   * @returns {Promise<void>}
   */
  static async initPreWriteQueriesData() {
    try {
      const data = await this.getPreWriteQueriesData();
      if (!data?.length) return;

      // 批量设置查询数据到 QueryClient
      data.forEach(({queryKey, data}) => {
        queryClient.setQueryData(queryKey, data);
      });

      await storage.setItem(PRELOAD_CACHE_KEY, []);
    } catch (error) {
      Sentry.captureEvent({
        message: 'QueryPreloadController-initPreWriteQueriesData-error',
        tags: {error, fatal_type: 'network'},
      });
    }
  }
}
