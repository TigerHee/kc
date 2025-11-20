/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import { Text } from 'react-native';
import intl from 'intl';
import 'intl/locale-data/jsonp/ur-PK';
import 'intl/locale-data/jsonp/ar-AE';
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

const defaultOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h24',
  hour12: false,
};

const dateTimeFormat = ({ lang = 'en_US', date,  options = {} }) => {
  try {
    if (!date) {
      return date;
    }

    const _options = { ...defaultOptions, ...options };
    const datestring = new Date(date).valueOf();
    const _lang = (isRTLLanguage(lang) ? 'ar_AE' : lang).replace('_', '-');
    const dateTimeFormat = new intl.DateTimeFormat(_lang, _options);
    const _datestring = dateTimeFormat.format(datestring);
    if (lang === 'en_US' || isRTLLanguage(lang)) {
      return _datestring.replace(',', '');
    }
    return _datestring;
  } catch (e) {
    return date;
  }
};

const DateTimeFormat = ({ style, children, ...otherProps }) => {
  return <Text style={style}>{dateTimeFormat({...otherProps, date: children })}</Text>;
};

DateTimeFormat.dateTimeFormat = dateTimeFormat;

export default DateTimeFormat;
