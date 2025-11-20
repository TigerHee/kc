/**
 * Owner: willen@kupotech.com
 */

import { ga } from './ga';

/**
 * 新版本自定义点击埋点
 */
export const gaClickNew = async (key, obj) => {
  if (!key) return;
  const { siteid, pageid, modid, eleid, ...other } = obj || {};
  ga(key, {
    ...other,
    str1: siteid,
    str2: `${siteid}.${pageid}`,
    str3: `${siteid}.${pageid}.${modid}`,
    str4: `${siteid}.${pageid}.${modid}.${eleid}`,
  });
};
