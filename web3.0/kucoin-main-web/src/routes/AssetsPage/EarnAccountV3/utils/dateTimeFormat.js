/**
 * Owner: sasuke@kupotech.com
 */

import { currentLang as i18n, isRTLLanguage } from '@kucoin-base/i18n';

const defaultOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
};

const toMinute = { second: undefined }; // 年月日时分
const toHour = { ...toMinute, minute: undefined }; // 年月日时
const toDay = { ...toHour, hour: undefined }; // 年月日
const justMonthDay = {
  year: undefined,
  hour: undefined,
  minute: undefined,
  second: undefined,
};
const justHourMinute = {
  year: undefined,
  month: undefined,
  day: undefined,
  second: undefined,
};
const monthToMinute = {
  year: undefined,
  second: undefined,
};

const bizTypes = {
  toMinute,
  toHour,
  toDay,
  justMonthDay,
  justHourMinute,
  monthToMinute,
};
/**
 *
 *
 * @param {*} { date, options = {} }
 * @return {*}
 */
const dateTimeFormat = (date, param) => {
  try {
    const isStrParam = typeof param === 'string' || !param;
    let options = isStrParam ? {} : param;
    const { bizType = '', currentLang = i18n, ...otherOptions } = options;
    let newOptions = {};
    let _bizType = isStrParam ? param : bizType;
    if (_bizType && bizTypes[_bizType]) {
      newOptions = bizTypes[_bizType];
    }

    // RTL 语言使用英文的format
    const _lang = (
      isRTLLanguage(currentLang.replace('-', '_')) ? 'en-US' : currentLang || 'en_US'
    ).replace('_', '-');
    const dateTimeFormat = new Intl.DateTimeFormat(_lang, {
      ...defaultOptions,
      ...otherOptions,
      ...newOptions,
    });
    return dateTimeFormat.format(date);
  } catch (error) {
    return '--';
  }
};

export default dateTimeFormat;
