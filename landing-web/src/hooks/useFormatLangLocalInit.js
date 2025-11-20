/**
 * Owner: melon@kupotech.com
 */
import { useSelector } from 'dva';
import { formatLocalLangNumber, dateTimeFormat } from 'helper';
import { isNil, isNaN } from 'lodash';

const useFormatLangLocalInit = () => {
  const { currentLang } = useSelector((state) => state.app);
  /**
   * 国际化数字千分位,
   * @param {*} param0
   * @param lang 语言参数 默认是 'en_US'
   * @param data 需要转化的数据
   * @param options 可选选项
   * @param interceptDigits 截取位数 有的业务需要使用的是直接截取小数位数而不是直接四舍五入 就需要传递这个
   * 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   * 参考 https://kux.kucoin.net/#/intl
   * @returns
   * 举例 formatLangNumber({ data: 9999, lang: 'bn-BD' }) => ৯,৯৯৯
   * 举例 formatLangNumber({ data: '3212.12545', interceptDigits: 2 }) => 3,212.12
   * 举例 formatLangNumber({ data: '3212.12545', lang: 'bn-BD' }) =>  ৩,২১২.১২৫৪৫
   * 举例 formatLangNumber({ data: '3212.12545', lang: 'bn-BD', interceptDigits: 2 }) => ৩,২১২.১২
   * 举例 formatLangNumber({ data:  0.258789, lang: 'bn-BD', options:{ style: 'percent' } }) => ২৫.৮৭৮৯%
   * bn-BD国际化数字对应是 1234567890 =>  ১২৩৪৫৬৭৮৯০
   */
  const formatLangNumber = ({ lang, data, options = {}, interceptDigits = null }) => {
    const num = +data;
    if (isNil(data) || isNaN(data) || isNaN(num) || typeof num !== 'number') return data;
    const _lang = (lang || currentLang || window._DEFAULT_LANG_)?.replace('_', '-');
    const result = formatLocalLangNumber({ lang: _lang, data: num, options, interceptDigits });
    return result;
  };
  /**
   * 国际化日期
   * @param {*} param0
   * @param lang 语言参数 默认是 'en_US'
   * @param data 需要转化的数据
   * @param options 可选选项
   * 参考 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
   * 参考 https://kux.kucoin.net/#/intl
   * @returns
   * formatLocalLangNumber({ data: '2023-03-29 22:42:02', lang: 'bn-BD', }) =>  ২৯/৩/২০২৩, ২২:৪২:০২
   */
  const formatLangDate = ({ lang, data: time, options = {} }) => {
    const _lang = (lang || currentLang || window._DEFAULT_LANG_)?.replace('_', '-');
    const result = dateTimeFormat({ currentLang: _lang, ts: time, options });
    return result;
  };
  return {
    formatLangNumber,
    formatLangDate,
  };
};

export default useFormatLangLocalInit;
