/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import { Text } from 'react-native';
import intl from 'intl';
import 'intl/locale-data/jsonp/ur-PK';
// import 'intl/locale-data/jsonp/ar-AE';
import 'intl/locale-data/jsonp/de-DE';
import 'intl/locale-data/jsonp/en-US';
import 'intl/locale-data/jsonp/es-ES';
import 'intl/locale-data/jsonp/fr-FR';
import 'intl/locale-data/jsonp/hi-IN';
import 'intl/locale-data/jsonp/id-ID';
import 'intl/locale-data/jsonp/it-IT';
import 'intl/locale-data/jsonp/ko-KR';
import 'intl/locale-data/jsonp/ms-MY';
import 'intl/locale-data/jsonp/nl-NL';
import 'intl/locale-data/jsonp/pt-PT';
import 'intl/locale-data/jsonp/ru-RU';
import 'intl/locale-data/jsonp/tr-TR';
import 'intl/locale-data/jsonp/vi-VN';
import 'intl/locale-data/jsonp/ja-JP';
import 'intl/locale-data/jsonp/th-TH';
import 'intl/locale-data/jsonp/bn-BD';
import 'intl/locale-data/jsonp/fil-PH';
import 'intl/locale-data/jsonp/pl-PL';
import 'intl/locale-data/jsonp/zh-Hant-HK';
import 'intl/locale-data/jsonp/uk-UA';

import { isRTLLanguage } from 'utils/config';

const defaultLang = 'en_US';

const numberFormat = ({
  lang = defaultLang,
  number: numberProps,
  isPositive,
  currency = '',
  options = {},
}) => {
  try {
    const number = numberProps ?? 0;

    const fraction = String(number).split('.')[1];
    let maximumFractionDigits = 2;
    if (fraction) {
      maximumFractionDigits = Math.min(fraction?.length, 18);
    }

    const isRtl = isRTLLanguage(lang);
    // 解决由于Intl插入国际化标识符引起的反转问题
    const absNumber = Math.abs(number);
    const _lang = (isRtl ? defaultLang : lang).replace('_', '-');
    // 得到带千分位的结果
    const formater = new intl.NumberFormat(_lang, { ...{ maximumFractionDigits }, ...options });
    const validNumber = formater.format(absNumber);

    // 判断符号
    const positive = +number < 0 ? '-' : isPositive ? '+' : '';
    // 需要反转的语言, % 单独处理
    if (options.style === 'percent') {
      if (isRtl) {
        const num = `${validNumber.replace('%', '')}`;
        return `%${num}${positive}`;
      }
      return `${positive}${validNumber}`;
    }
    return `${positive}${currency}${validNumber}`;
  } catch (e) {
    console.log('e:', e);
    return number;
  }
};

const NumberFormat = ({ style, children, ...otherProps }) => {
  return <Text style={style}>{numberFormat({ ...otherProps, number: children })}</Text>;
};

NumberFormat.numberFormat = numberFormat;

export default NumberFormat;
