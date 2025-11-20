/*
 * @owner: borden@kupotech.com
 */
import webStorage from 'tools/webStorage';
import { kcsensorsManualTrack } from 'tools/sensors';
import { STAND_SITE, getBrandSite } from '../../../config';
import { checkIsStale } from '../../../tools';

// 获取当前站点
const currentSite: any = getBrandSite();

// 判断是否为独立站，非独立站增加一个 site 区分 indexDB 库
const indexDBName: any = STAND_SITE.includes(currentSite) ? 'KC_REQUEST_CACHE' : `KC_REQUEST_CACHE_${currentSite}`;

// request 库都用这个仓库名 跟 storeName
const cacheStorage: any = webStorage.createInstance({
  name: indexDBName,
  storeName: 'common_request',
  driver: [webStorage.INDEXED_DB, webStorage.MEMORY_STORAGE], // 指定驱动类型
  maxItemSize: 1024 * 1024 * 3, // 最大 3MB
});

export const getCache = async (key: any): Promise<any> => {
  try {
    const getTimer: any = Date ? Date.now() : 0;
    const getData: any = await cacheStorage.getItem(key);
    const resultTimer: any = Date ? Date.now() : 0;

    kcsensorsManualTrack(
      {
        spm: ['commonServiceCache_getCache_timer', '1'],
        data: {
          result: !getTimer ? 'date timer error' : resultTimer - getTimer,
        },
      },
      'technology_event'
    );

    return getData;
  } catch (e: any) {
    console.error(e);
    kcsensorsManualTrack(
      {
        spm: ['commonServiceCache_getCache_error', '1'],
        data: {
          fail_reason: e?.toString(),
        },
      },
      'technology_event'
    );

    return null;
  }
};

export const setCache = async (key: any, data: any): Promise<any> => {
  try {
    return await cacheStorage.setItem(key, data);
  } catch (e: any) {
    console.error(e);
    kcsensorsManualTrack(
      {
        spm: ['commonServiceCache_setCache_error', '1'],
        data: {
          fail_reason: e?.toString(),
        },
      },
      'technology_event'
    );
    return null;
  }
};

// 神策上报

export const track = (data: any): void => {
  kcsensorsManualTrack({ data, checkID: false }, 'commonServiceCache_results');
};

// 获取缓存已过期的时长

const getExpiredTime = (time: any): any => {
  return Math.ceil((Date.now() - time) / 60000);
};

// 上报走到swr的过期时间等信息

export const trackSwr = (cacheKey: any, staleTime: any, cacheData: any): void => {
  try {
    const cacheTime: any = cacheData.data.time || cacheData.time;

    if (typeof cacheTime === 'object') {
      Object.entries(cacheTime).forEach(([key, time]: [any, any]) => {
        if (time && !checkIsStale(staleTime, time)) {
          track({
            result: 'swr',
            cacheKey: `${cacheKey}_${key}`,
            expiredTime: getExpiredTime(time),
          });
        }
      });
    } else if (cacheTime) {
      track({
        result: 'swr',
        cacheKey,
        expiredTime: getExpiredTime(cacheTime),
      });
    }
  } catch (e: any) {
    console.error(e);
  }
};
