/**
 * Owner: borden@kupotech.com
 */
import { pull, postJson } from 'utils/request';

const prefix = '/trade-front';

/**
 * 增加布局配置
 */
export const addLayout = (params) => {
  return postJson(`${prefix}/layout/addLayout`, params);
};

/**
 * 删除布局配置
 */
export const deleteLayout = (params) => {
  return postJson(`${prefix}/layout/deleteLayout`, params);
};

/**
 * 更新布局配置
 */
export const updateLayout = (params) => {
  return postJson(`${prefix}/layout/updateLayout`, params);
};

/**
 * 查询当前用户布局配置
 */
export const getLayouts = (params) => {
  return pull(`${prefix}/layout/getLayouts`, params);
};
