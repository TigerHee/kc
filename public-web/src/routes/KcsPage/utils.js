/**
 * Owner: chris@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { currentLang } from '@kucoin-base/i18n';
import numberFormatKux from '@kux/mui/utils/numberFormat';
import { Decimal, divide, dropZero, numberFixed } from 'helper';
import { _t } from 'src/tools/i18n';
import { push } from 'src/utils/router';
import HOST from 'utils/siteConfig';
import { levelsMap } from './config';

export const callJump = (params, url) => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: params,
    });
  } else {
    window.open(url, '_blank');
  }
};

export const percentFormat = (value, precision = 2) => {
  try {
    const _value = new Decimal(value);
    // 为0格式化为0%
    const isZero = _value.eq('0');
    // < 0.01
    if (_value.lt('0.0001') && !isZero) {
      return `< ${numberFormatKux({
        number: 0.0001,
        lang: currentLang,
        options: {
          style: 'percent',
          maximumFractionDigits: precision,
        },
      })}`;
    }
    return numberFormatKux({
      number: dropZero(numberFixed(`${value}`, 4)),
      lang: currentLang,
      options: {
        style: 'percent',
        maximumFractionDigits: precision,
      },
    });
  } catch (error) {
    return '--';
  }
};

export const numberFormat = (value, precision = 8) => {
  return numberFormatKux({
    number: value,
    lang: currentLang,
    options: { maximumFractionDigits: precision },
  });
};

const isInApp = JsBridge.isApp();

// 获取升级文案
export const getUpgradeLevelText = (level, withQuote = false) => {
  const mapConfig = levelsMap[level];
  // 兼容level为不支持的类型
  if (!mapConfig) return '--';
  const { maxPercent, minPercent, maxAmount, minAmount } = mapConfig;
  const _minPercent = percentFormat(divide(minPercent, 100));
  const _maxPercent = percentFormat(divide(maxPercent, 100));
  const percentRange =
    minPercent && maxPercent
      ? `${_minPercent} ~ ${_maxPercent}`
      : minPercent
      ? `> ${_minPercent}`
      : `≤ ${_maxPercent}`;
  const amountRange = `≥ ${numberFormat(minAmount)}`;
  const params = { amount: amountRange, percent: percentRange };
  // withQuote true 带符号
  if (withQuote) {
    return params;
  }
  let condition = _t('bf0ae100edec4000a2dc', params);
  return condition;
};

export const goLogin = () => {
  if (isInApp) {
    callJump({
      url: '/user/login',
    });
  } else {
    push('/ucenter/signin?backUrl=' + encodeURIComponent(window.location.href));
  }
};

// 去锁仓页面
export const goLock = ({
  demand_product_id,
  demand_product_type,
  currency,
  name,
  product_category,
}) => {
  const url = `${HOST.M_POOLX_HOST}/lock?type=${demand_product_type}&product_id=${demand_product_id}&currency=${currency}&name=${name}&category=${product_category}&needLogin=true&loading=2&appNeedLang=true&isBanner=1`;
  callJump(
    {
      url,
    },
    `${HOST.POOLX_HOST}/kcs?product_id=${demand_product_id}&category=${product_category}&type=${demand_product_type}&with_category_currency_group=1`,
  );
};

export const lottieStore = {};

export const getScene = () => {
  return {
    device_type: isInApp ? 'H5' : 'WEB',
  };
};
