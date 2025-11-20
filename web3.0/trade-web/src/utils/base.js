/**
 * Owner: odan.ou@kupotech.com
 */
/**
 * 当前值是否为空
 * @template T
 * @param {T} val
 */
export const valIsEmpty = (val) => {
    return val == null || (typeof val !== 'object' && String(val).trim() === '');
};
