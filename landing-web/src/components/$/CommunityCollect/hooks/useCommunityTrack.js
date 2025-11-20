import { kcsensorsClick, kcsensorsManualExpose } from 'utils/ga';
import { merge } from 'lodash';
import { useSelector } from 'dva';

export const trackConfig = {
  pageId: 'B1Kucommunity',
  exposeKeys: {
    banner: 'BannerPageView',
  },
  // blockId, 根据 platform + 'PageView' 规则生成
};

// 防止重复曝光
const exposeQueueMap = {};

// 删除后台配置渠道时候的空格
export function getPlatformTrackId(platform) {
  return platform.replace(/\s/g, '');
}

export function getExposeBlockId(platform) {
  return platform + 'PageView';
}

export function getPageClickBlockId(platform) {
  return platform;
}

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function useCommunityTrack() {
  const app = useSelector((state) => state.app);
  const { currentLang } = app;

  const defaultPageData = {
    kc_page_id: trackConfig.pageId,
  };
  const defaultLocationId = '1';
  const defaultData = {
    lang: currentLang,
  };

  function log(...options) {
    // console.log('useCommunityTrack.log:', options);
  }

  /**
   * @param options {{
   *   pageData: {
   *     kc_page_id: string;
   *     [key: string]: any;
   *   },
   *   data: Record<string, any>;
   *   locationId: string;
   *   blockId: string;
   * }}
   */
  function trackExpose(options) {
    try {
      log(options, defaultData);
      const _options = merge({}, options || {});
      const _pageData = merge({}, defaultPageData, _options.pageData);
      const _data = merge({}, defaultData, _options.data);
      const _locationId = _options.locationId || defaultLocationId;
      const _blockId = _options.blockId;

      if (!_blockId) {
        console.warn('trackExpose: blockId is required!');
        return;
      }

      const exposeKey = [
        _pageData.kc_page_id,
        _blockId,
        _locationId
      ].join('_');

      if (exposeQueueMap[exposeKey]) {
        return;
      }

      exposeQueueMap[exposeKey] = true;

      kcsensorsManualExpose(_pageData, [_blockId, _locationId], {
        ..._data,
      });
    } catch (e) {
      console.warn('trackExpose error', e);
    }
  }

  /**
   * @param options {{
   *   data: Record<string, any>;
   *   locationId: string;
   *   blockId: string;
   * }}
   */
  function trackClick(options) {
    try {
      log(options);
      const _options = merge({}, options || {});
      const _data = merge({}, defaultData, _options.data);
      const _locationId = _options.locationId || defaultLocationId;
      const _blockId = _options.blockId;

      if (!_blockId) {
        console.warn('trackClick: blockId is required!');
        return;
      }

      kcsensorsClick([_blockId, _locationId], {
        ..._data,
      });
    } catch (e) {
      console.warn('trackClick error', e);
    }
  }

  return {
    trackExpose,
    trackClick,
  };
}
