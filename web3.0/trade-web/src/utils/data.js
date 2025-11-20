/**
 * Owner: odan.ou@kupotech.com
 */
import { valIsEmpty } from './base';

/**
 * 数据为空时处理
 * @template T
 * @param {T} val
 * @param {string} [defaultVal] 默认'--'
 */
export const dataEmptyFormat = (val, defaultVal = '--') => {
    return valIsEmpty(val) ? defaultVal : val;
};
