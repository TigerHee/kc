/**
 * Owner: melon@kupotech.com
 */
import { dateTimeFormat as KuDateTimeFormat, numberFormat as KuNumberFormat } from '@kux/mui/utils';
import { isNaN, isNil, toNumber, toString } from 'lodash';
import { separateNumber, toNonExponential, getIsAndroid } from 'helper';
import Decimal from 'decimal.js/decimal';
import { currentLang } from 'utils/lang';

export const RTL_Langs = ['ar_AE', 'ur_PK']; // 翻转语种

export const defaultTimeOptions = {
  year: 'numeric',
  // month: 'numeric',
  // day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h24',
  day: '2-digit',
  month: '2-digit',
  hourCycle: 'h23', // 如果用h24的话 会出现 00:00:00 变成24:00:00的问题
};

// options isPositive
// 默认精度
const defaultOptions = { maximumFractionDigits: 20 };

// RTL替换代替语种 时间格式修改
export const dateTimeFormat = ({ lang=window._DEFAULT_LANG_, date, options = {} }) => {
  try {
    const result = KuDateTimeFormat({
      lang: lang || currentLang,
      date,
      options: {
        ...defaultTimeOptions,
        ...options,
      },
    });
    return result;
  } catch (e) {
    return date;
  }
};

export const NumberFormat = ({ lang, number, isPositive, currency = '', options = {} }) => {
  try {
    if (isNil(number) || isNaN(number)) {
      return number;
    }
    const _lang = (lang || 'en_US').replace('_', '-');
    const formater = new Intl.NumberFormat(_lang, { ...defaultOptions, ...options });
    /** 科学计数兜底转换 不然 0.000000001 会变成 1e-9 */
    const result = toNonExponential(number);
    // 高精度的情况下 直接取绝对值会有问题 所以做一些特殊处理
    const _stringResult = toString(result).replace('-', '');

    const validNumber = formater.format(_stringResult);
    // 判断符号
    let positive = '';
    if (+number < 0) {
      positive = '-';
    } else if (isPositive) {
      positive = '+';
    }
    // 需要反转的语言, % 单独处理
    if (options.style === 'percent') {
      if (RTL_Langs.includes(lang)) {
        const num = `\u202D${validNumber.replace('%', '')}\u202C`;
        return `\u202E${positive}${num}%\u202C`; // -10.23%，页面上会自动转
      }
      return `${positive}${validNumber}`;
    }
    return `${positive}${currency}${validNumber}`;
  } catch (e) {
    console.log('e:', e);
    return number;
  }
};
// 只格式化千分位，不国际化格式化
export const normalNumberFormat = ({ lang, number, isPositive, currency = '', options = {} }) => {
  try {
    if (isNil(number) || isNaN(number)) {
      return number;
    }
    /** 科学计数兜底转换 不然 0.000000001 会变成 1e-9 */
    const result = toNonExponential(number);
    // 高精度的情况下 直接取绝对值会有问题 所以做一些特殊处理
    const _stringResult = toString(result).replace('-', '');
    // 得到带千分位的结果
    const validNumber = separateNumber(_stringResult);

    // 判断符号
    let positive = '';
    if (+number < 0) {
      positive = '-';
    } else if (isPositive) {
      positive = '+';
    }
    // 需要反转的语言, % 单独处理
    if (options.style === 'percent') {
      if (RTL_Langs.includes(lang)) {
        const num = `\u202D${validNumber.replace('%', '')}\u202C`;
        return `\u202E${positive}${num}%\u202C`; // -10.23%，页面上会自动转
      }
      return `${positive}${validNumber}%`;
    }
    return `${positive}${currency}${validNumber}`;
  } catch (e) {
    console.log('e:', e);
    return number;
  }
};
/**
* 国际化数字千分位, 支持负数
* @param {*} param0
* @param lang 语言参数 默认是 'en_US'
* @param number 需要转化的数字数据  注意如果是转换成百分比的话 传入的数据是小数 例如传入数字是0.1 最后返回会是10%
* @param options 可选选项
* @param isPositive 正数是否需要 + 符号
* @param currency 币种符号
* @param defaultText 传入数据不正确时的默认展示文字 默认为 --
* @param needAbs
* @param suitableForAndroid 安卓是否只格式化千分位而不采用国际格式化

* 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
* 参考 https://kux.kucoin.net/#/intl
* bn-BD国际化数字对应是 1234567890 =>  ১২৩৪৫৬৭৮৯০
* @returns
* 举例 formatLocalLangNumber({ number: 9999, lang: 'bn-BD' }) => ৯,৯৯৯
* 举例 formatLocalLangNumber({ number: '3212.12545', interceptDigits: 2 }) => 3,212.12
* 举例 formatLocalLangNumber({ number: '3212.12545', lang: 'bn-BD' }) =>  ৩,২১২.১২৫৪৫
* 举例 formatLocalLangNumber({ number: '-10000.234', lang: 'bn-BD' }) =>  -১০,০০০.২৩৪
* 举例 formatLocalLangNumber({ number:  0.258789, lang: 'bn-BD', options:{ style: 'percent' } }) => ২৫.৮৭৮৯%
*/
export const numberFormat = ({
  lang,
  number,
  isPositive,
  currency,
  options = {},
  needAbs = true, // 是否需要处理绝对值， 默认用kux/mui 的格式化好了
  suitableForAndroid = false, // 安卓是否只格式化千分位而不采用国际格式化
  defaultText = '--',
}) => {
  const _isAndroid = getIsAndroid();
  // 如果需要测试安卓就用这个
  // const _isAndroid = true;

  try {
    if (isNil(number) || isNaN(number)) {
      return defaultText;
    }
    let result = number;

    if (suitableForAndroid && _isAndroid) {
      let androidNum = '';
      if (options.style === 'percent') {
        if (!options?._ignoreFractionDigits) {
          androidNum = new Decimal(number)
            .mul(100)
            .toFixed(options.maximumFractionDigits || options.minimumFractionDigits || 12);
        } else {
          androidNum = new Decimal(number).mul(100).toFixed();
        }
      } else {
        // 安卓下的数字保留小数位
        androidNum =
          options.maximumFractionDigits || options.minimumFractionDigits
            ? new Decimal(number).toFixed(
                options.maximumFractionDigits || options.minimumFractionDigits,
              )
            : number;
      }
      const finallyNumber = normalNumberFormat({
        lang: lang || currentLang,
        number: `${androidNum}`,
        isPositive,
        currency,
        options: {
          ...defaultOptions,
          ...options,
        },
      });
      return finallyNumber;
    }

    if (!needAbs) {
      result = NumberFormat({
        lang: lang || currentLang,
        number: `${number}`,
        isPositive,
        currency,
        options: {
          ...defaultOptions,
          ...options,
        },
      });
    } else {
      result = KuNumberFormat({
        lang: lang || currentLang,
        number,
        isPositive,
        currency,
        options: {
          ...defaultOptions,
          ...options,
        },
      });
    }

    return result;
  } catch (e) {
    console.log('e:', e);
    return number;
  }
};

const useKuxFormat = () => {
  return { dateTimeFormat, numberFormat, NumberFormat };
};

export default useKuxFormat;
