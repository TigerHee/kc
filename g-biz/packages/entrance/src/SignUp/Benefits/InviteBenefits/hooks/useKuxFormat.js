/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/hooks/useKuxFormat.js
 */
import storage from '@utils/storage';
import { numberFormat as KuNumberFormat } from '@kux/mui/utils';
import { isNaN, isNil } from 'lodash';
import { getIsAndroid, separateNumber, multiply } from '../../../../common/tools';

export const RTL_Langs = ['ar_AE', 'ur_PK']; // 翻转语种

export const NumberFormat = ({ lang, number, isPositive, options = {} }) => {
  try {
    const _lang = (lang || window._DEFAULT_LANG_).replace('_', '-');
    // 得到带千分位的结果
    const formater = new Intl.NumberFormat(_lang, { ...defaultOptions, ...options });
    const validNumber = formater.format(number);

    // 判断符号
    const positive = +number < 0 ? '-' : isPositive ? '+' : '';
    // 需要反转的语言, % 单独处理
    if (options.style === 'percent') {
      if (RTL_Langs.includes(lang)) {
        const num = `\u202D${validNumber.replace('%', '')}\u202C`;
        return `\u202E${positive}${num}%\u202C`; // -10.23%，页面上会自动转
      }
      return `${positive}${validNumber}`;
    }
    return `${positive}${validNumber}`;
  } catch (e) {
    console.log('e:', e);
    return number;
  }
};
// options isPositive
// 默认精度
const defaultOptions = { maximumFractionDigits: 20 };

// 只格式化千分位，不国际化格式化
const normalNumberFormat = ({ lang, number, isPositive, options = {} }) => {
  try {
    // 得到带千分位的结果
    const validNumber = separateNumber(number);
    // 判断符号
    const positive = +number < 0 ? '-' : isPositive ? '+' : '';
    // 需要反转的语言, % 单独处理
    if (options.style === 'percent') {
      if (RTL_Langs.includes(lang)) {
        const num = `\u202D${validNumber.replace('%', '')}\u202C`;
        return `\u202E${positive}${num}%\u202C`; // -10.23%，页面上会自动转
      }
      return `${positive}${validNumber}%`;
    }
    return `${positive}${validNumber}`;
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
  needAbs = true,
  defaultText = '--',
}) => {
  const _isAndroid = getIsAndroid();
  const currentLang = storage.getItem('kucoinv2_lang');
  try {
    if (isNil(number) || isNaN(number)) {
      return defaultText;
    }
    let result = number;

    if (_isAndroid) {
      return normalNumberFormat({
        lang: lang || currentLang,
        number:
          options?.style === 'percent'
            ? multiply(
                number,
                100,
                options?._ignoreFractionDigits ? undefined : options?.minimumFractionDigits || 0,
              )
            : number,
        isPositive,
        currency,
        options: {
          ...defaultOptions,
          ...options,
        },
      });
    }

    if (!needAbs) {
      result = NumberFormat({
        lang: lang || currentLang,
        number,
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
  return { numberFormat, NumberFormat };
};

export default useKuxFormat;
