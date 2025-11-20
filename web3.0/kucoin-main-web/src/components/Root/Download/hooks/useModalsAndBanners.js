/**
 * Owner: jesse@kupotech.com
 */

import { useMemo, useCallback } from 'react';
import storage from 'utils/storage';

// 场景触发下载时的链接统一维护
const useModalsAndBanners = () => {
  // modal: 关闭1次，连续7天不再展示
  const modalNoneBannerDuration = 7 * 24 * 60 * 60 * 1000;

  const modalUpdateDataFn = useCallback(() => {
    let data = {};
    try {
      data = storage.getItem('download_modal_data') || {};
    } catch (e) {
      console.log(e);
    }
    const now = Date.now();
    storage.setItem(
      'download_modal_data',
      {
        time: now,
        closeTimes: now - data.time < modalNoneBannerDuration ? data.closeTimes + 1 : 1,
      },
    );
  }, [modalNoneBannerDuration]);

  const canShowModal = useMemo(() => {
    const data = storage.getItem('download_modal_data') || {}
    const now = Date.now();

    // 弹窗展示(关闭一次)后，从展示当天起7个自然日内不再展示
    if (data.closeTimes >= 1 && now - data.time < modalNoneBannerDuration) {
      return false;
    }

    return true;
  }, [modalNoneBannerDuration]);

  return {
    modalUpdateDataFn,
    canShowModal,
  };
};

export default useModalsAndBanners;
