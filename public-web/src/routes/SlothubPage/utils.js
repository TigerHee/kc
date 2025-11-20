/*
 * @owner: borden@kupotech.com
 */
import { actions, bridge } from '@kc/telegram-biz-sdk';
import JsBridge from '@knb/native-bridge';
import history from '@kucoin-base/history';
import Decimal from 'decimal.js';
import { formatLocalLangNumber, transformParam } from 'helper';
import { startsWith } from 'lodash';
import { isRTLLanguage } from 'utils/langTools';
import { LINKS } from './constant';

// 跳转
export const jumpTo = ({ appUrl, webUrl, xkcRoute, xkcUrl }) => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: appUrl,
      },
    });
  } else {
    if (bridge.isTMA()) {
      if (xkcRoute) {
        const { pathname: UrlPath } = new URL(xkcRoute);
        actions.route({
          path: UrlPath,
        });
      } else if (xkcUrl) {
        const { pathname: UrlPath } = new URL(xkcUrl);
        bridge.postMessageTMA({
          action: 'webview',
          payload: {
            path: `${UrlPath}?tgtime=${Date.now()}`,
          },
        });
      }
      console.warn('jumpTo url not found!');
      return;
    }
    if (startsWith(webUrl, '/')) {
      history.push(webUrl);
    } else {
      const newTab = window.open(webUrl, '_blank');
      newTab && (newTab.opener = null);
    }
  }
};
// 退出活动
export const exit = (backupUrl = '/') => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'func',
      params: {
        name: 'exit',
      },
    });
  } else {
    history.push(backupUrl);
  }
};
// 去交易
export const jumpToTradeWithSymbol = (symbol) => {
  jumpTo(LINKS.trade(symbol));
};

export const list2map = (list, key = 'value', formatItem = (v) => v) =>
  list.reduce((a, b, i) => {
    a[typeof key === 'function' ? key(b) : b[key]] = formatItem(b, i);
    return a;
  }, {});

export const equals = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.equals(b);
  };
};

export const multiply = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    return a.times(b);
  };
};

export const dividedBy = (a) => {
  a = transformParam(a);
  return (b) => {
    b = transformParam(b);
    if (equals(b)(0)) {
      // 如果分母为0按0返回
      return new Decimal(0);
    }
    return a.dividedBy(b);
  };
};
/**
 * 当热度不足100时展示100+，
 * 实际超过200时展示200+（百的数字以此类推）
 * 实际超过1000的展示1K+，
 * 超过2k的2K+，10K，100K，1M+，2M+，10M+，20M+，1B+，2B+
 */
export const formatHotAmount = ({ value, lang, options, ...rest }) => {
  let calcRet;
  const points = [1000000000, 1000000, 1000];
  for (let i = 0, len = points.length; i < len; i++) {
    const point = points[i];
    if (value >= point) {
      calcRet = multiply(dividedBy(value)(point).toFixed(0, Decimal.ROUND_DOWN))(point).toFixed();
      break;
    }
  }
  if (!calcRet) {
    if (value >= 200) {
      calcRet = multiply(dividedBy(value)(100).toFixed(0, Decimal.ROUND_DOWN))(100);
    } else {
      calcRet = '100';
    }
  }
  const calcRetStr = formatLocalLangNumber({
    data: calcRet,
    options: {
      notation: 'compact',
      ...options,
    },
    ...rest,
  });
  return isRTLLanguage(lang) ? `+${calcRetStr}` : `${calcRetStr}+`;
};
