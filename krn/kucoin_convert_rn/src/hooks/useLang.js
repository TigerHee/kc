/**
 * Owner: willen@kupotech.com
 */
import {useContext} from 'react';
import {BaseLayoutContext} from '../layouts';
import I18n from 'react-native-i18n';
import {NumberFormat, DateTimeFormat} from '@krn/ui';
const {numberFormat} = NumberFormat;
const {dateTimeFormat} = DateTimeFormat;
import * as site from '../site';

export default () => {
  const {lang, setLang} = useContext(BaseLayoutContext);
  return {
    lang,
    setLang,
    _t: (key, params) => {
      I18n.locale = lang;
      return I18n.t(key, {
        ...params,
        brandName: site._BRAND_NAME,
      });
    },
    // 复写 intl 函数，简化使用，剩余参数去 krn/ui 里面看
    numberFormat: (number, params = {}) =>
      numberFormat({
        ...params,
        number,
        lang,
      }),
    dateTimeFormat: (date, params = {}) =>
      dateTimeFormat({...params, date, lang}),
  };
};
