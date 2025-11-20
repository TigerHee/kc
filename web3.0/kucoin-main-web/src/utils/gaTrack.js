/**
 * Owner: odan.ou@kupotech.com
 */
// 常用的一些埋点方法
import { trackClick, saTrackForBiz } from 'utils/ga';

/**
 * 判断是否为空值
 * @param {unknown} val
 */
const valIsEmpty = (val) => val == null || String(val).trim() === '';

/**
 * 分离埋点中在param中的的SpmIndex属性和Params
 * @param {Record<string, any>} [params] index的值默认使用1
 * @param {string | false } [key] false表示不使用index
 * @returns {[string, Record<string, any>]}
 */
const getTrackIndexAndParams = (params = {}, key = 'index') => {
  if (key === false) return ['', params];
  const { [key]: index = '1', ...others } = params;
  return [index, others];
};

/**
 * 获取spm 和 parmas的值
 * @param {string[] | string} spm
 * @param {Record<string, any> | undefined} [params] index的值默认使用1
 * @param {string | false } [key] false表示不使用index
 * @returns {[string[], undefined | Record<string, any>]}
 */
const getSpmAndParams = (spm = [], params, key) => {
  const spmArr = Array.isArray(spm) ? spm : valIsEmpty(spm) ? [] : [spm];
  const [index, otherParams] = getTrackIndexAndParams(params, key);
  if (!valIsEmpty(index)) {
    spmArr.push(index);
  }
  return [spmArr.map((str) => String(str)), otherParams];
};

/**
 * 用于常规的点击上报
 * @param {string[] | string} spm 值为[blockid] | blockid
 * @param {Record<string, any> | undefined} [params] index的值默认使用1
 * @param { string | false } [key] 放在params中表示index的值，默认index,false表示不使用
 */
export const trackClickHandle = (spm, params, key) => {
  const [newSpm, newParams] = getSpmAndParams(spm, params, key);
  return trackClick(newSpm, newParams);
};

/**
 * 用于常规的点击上报（不会生成index)
 * @param {string[] | string} spm 值为[blockid] | blockid
 * @param {Record<string, any> | undefined} [params] index的值默认使用1
 */
export const trackClickSpm = (spm, params) => {
  return trackClickHandle(spm, params, false);
};

/**
 * 埋点事件处理，默认为曝光事件
 * 有需要再暴露出去
 * @param {*} saType 上传类型，默认为expose（曝光
 * @param {string[] | string} spm [blockid] | blockid
 * @param {Record<string, any> | undefined} [params] index的值默认使用1
 * @param { string | false } [key] 放在params中表示index的值，默认index,false表示不使用
 */
const trackHandle = (saType, spm, params, key) => {
  const [newSpm, newParams] = getSpmAndParams(spm, params, key);
  return saTrackForBiz({ saType }, newSpm, newParams);
};

/**
 * 曝光上报
 * @param {string[] | string} spm [blockid] | string
 * @param {Record<string, any> | undefined} [params] index的值默认使用1
 * @param { string | false } [key] 放在params中表示index的值，默认index,false表示不使用
 */
export const trackExposeHandle = (spm, params, key) => {
  return trackHandle('expose', spm, params, key);
};

/**
 * 曝光上报(不会生成index)
 * @param {string[] | string} spm [blockid] | string
 * @param {Record<string, any> | undefined} [params] index的值默认使用1
 * @param { string | false } [key] 放在params中表示index的值，默认index,false表示不使用
 */
export const trackExposeHandleSpm = (spm, params) => {
  return trackHandle('expose', spm, params, false);
};
