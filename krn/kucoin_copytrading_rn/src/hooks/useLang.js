/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useMemoizedFn} from 'ahooks';
import {useCallback, useContext} from 'react';
import I18n from 'react-native-i18n';
import {tenant} from '@krn/toolkit';
import {DateTimeFormat, NumberFormat, useTheme} from '@krn/ui';

import {transformRTLShowNumber} from 'components/Common/NumberFormat/helper';
import {isUndef} from 'utils/helper';
import {reportIntlMissing} from 'utils/sentry';
import {BaseLayoutContext} from '../layouts';

const {numberFormat: krnNumberFormat} = NumberFormat;
const {dateTimeFormat: krnDateTimeFormat} = DateTimeFormat;

export default () => {
  const {lang, setLang} = useContext(BaseLayoutContext);
  const {isRTL} = useTheme();
  const _t = useCallback(
    (key, params) => {
      I18n.locale = lang;
      const target = I18n.t(key, {
        ...params,
        ...tenant.commonLangParams,
      });
      if (!target) {
        reportIntlMissing(key);
      }
      return target || `${key}`;
    },
    [lang],
  );

  const numberFormat = useMemoizedFn((number, params, placeholder = '--') => {
    if (isUndef(number)) {
      return placeholder;
    }
    if (+number === 0) {
      return params.options?.minimumFractionDigits === 2 ? '0.00' : '0';
    }
    const preResult = krnNumberFormat({
      ...params,
      number,
      lang,
    });

    if (isRTL) {
      return transformRTLShowNumber(preResult);
    }

    return preResult;
  });

  const dateTimeFormat = useMemoizedFn((date, params = {}) =>
    // replace 修复日期 部分西语 如德语 意大利语格式化后的问题 22/02.,14:20 =>  22/02,14:20
    krnDateTimeFormat({...params, date, lang})?.replace?.('.,', ','),
  );

  return {
    lang,
    setLang,
    _t,
    // 复写 intl 函数，简化使用，剩余参数去 krn/ui 里面看
    numberFormat,
    dateTimeFormat,
  };
};
