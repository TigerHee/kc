/**
 * Owner: willen@kupotech.com
 */

import { isNaN, isNil } from 'lodash';

/**
 * 返回截取小数位后的数字
 * @param {*} num 数字
 * @param {*} interceptDigits
 * @returns Number类型的返回值
 * 举例 numSeparateDecimal(3212.12545, 2) => 3212.12
 * 举例 numSeparateDecimal('3212.12545', 8) => 3212.12545
 *
 */
const numSeparateDecimal = (num, interceptDigits = 2) => {
  if (isNil(num) || isNaN(num) || !num) return 0;
  let stringNum = '' + num;
  let stringNumArray = stringNum.split('.');
  if (stringNumArray.length === 1) {
    return parseFloat(stringNum);
  }
  if (stringNumArray[1].length > interceptDigits) {
    const n1 = stringNumArray[1].slice(0, interceptDigits);
    stringNumArray.splice(1, 1, n1);
    return parseFloat(stringNumArray.join('.'));
  }
  return +num;
};

/**
 * 国际化数字千分位, 支持负数
 * @param {*} param0
 * @param lang 语言参数 默认是 'en_US'
 * @param data 需要转化的数字数据
 * @param options 可选选项
 * @param interceptDigits 截取小数位数 有的业务需要使用的是直接截取小数位数而不是直接四舍五入就需要传递这个 默认值 null
 * 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * 参考 https://kux.kucoin.net/#/intl
 * bn-BD国际化数字对应是 1234567890 =>  ১২৩৪৫৬৭৮৯০
 * @returns
 * 举例 formatLocalLangNumber({ data: 9999, lang: 'bn-BD' }) => ৯,৯৯৯
 * 举例 formatLocalLangNumber({ data: '3212.12545', interceptDigits: 2 }) => 3,212.12
 * 举例 formatLocalLangNumber({ data: '3212.12545', lang: 'bn-BD' }) =>  ৩,২১২.১২৫৪৫
 * 举例 formatLocalLangNumber({ data: '-10000.234', lang: 'bn-BD' }) =>  -১০,০০০.২৩৪
 * 举例 formatLocalLangNumber({ data: '3212.12545', lang: 'bn-BD', interceptDigits: 2 }) => ৩,২১২.১২
 * 举例 formatLocalLangNumber({ data:  0.258789, lang: 'bn-BD', options:{ style: 'percent' } }) => ২৫.৮৭৮৯%
 */
export default ({ lang = 'en_US', data, options = {}, interceptDigits = null }) => {
  const num = +data;
  if (isNil(data) || isNaN(data) || typeof num !== 'number') return data;
  const _lang = lang.replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, {
    ...{ maximumFractionDigits: 8 },
    ...options,
  });
  let result;
  let newNum = num;
  if (!isNil(interceptDigits) && typeof interceptDigits === 'number' && interceptDigits >= 0) {
    newNum = numSeparateDecimal(newNum, interceptDigits);
  }
  result = numberFormat.format(newNum);
  return result;
};
