/**
 * Owner: odan.ou@kupotech.com
 */

/**
 * 转化函数
 * @template T
 * @param {T[]} list 
 * @param {*} len 
 * @returns {T[][]}
 */
export const setTwoDimensionalArray = (list, len) => {
    const res = []
    const max = Math.ceil(list.length / len)
    for (let i = 0; i < max; i++) {
        res[i] = list.slice(i * len, (i + 1) * len)
    }
    return res
};