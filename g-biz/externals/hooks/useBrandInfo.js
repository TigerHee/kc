/**
 * Owner: eli.xiang@kupotech.com
 * 该文件已经废弃，没用了
 */
import remoteEvent from '@tools/remoteEvent';
import { brandDbStore, brandStoreKey } from '@tools/brandStorage';
import { useState, useEffect } from 'react';

function getBrandSite() {
  // 无 window._BRAND_SITE_ 时为主站，返回 KC
  return window._BRAND_SITE_ || 'KC';
}
async function getBrandInfoFromStorage() {
  try {
    const allSiteBrandInfo = await brandDbStore.get(brandStoreKey);
    let brandInfoKey = 'brand';
    if (window._BRAND_SITE_) {
      brandInfoKey = `brand_${window._BRAND_SITE_}`;
    }
    return JSON.parse(allSiteBrandInfo?.[brandInfoKey]);
  } catch (error) {
    console.log('getBrandInfoFromStorage error:', error);
    return {};
  }
}
// 此hooks用于获取站点品牌信息
const useBrandInfo = () => {
  // 初始化站点品牌信息
  const [brandInfo, setBrandInfo] = useState({ site: getBrandSite() });

  // 监听获取国家code事件
  useEffect(() => {
    getBrandInfoFromStorage().then((data) => {
      setBrandInfo({ ...data, site: getBrandSite() });
    });
  }, []);

  useEffect(() => {
    remoteEvent.on(remoteEvent.evts.GET_BRAND_INFO, (data) => {
      setBrandInfo({ ...data, site: getBrandSite() });
    });
  }, []);

  return brandInfo;
};

export default useBrandInfo;
