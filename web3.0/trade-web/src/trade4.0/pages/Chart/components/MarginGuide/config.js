/**
 * Owner: jessie@kupotech.com
 */

import { replace } from 'lodash';
import { _t } from 'utils/lang';

export const GUIDE_CONFIG = {
  MARGIN_TRADE: {
    key: 'MARGIN_TRADE',
    getGuideHref: (lang) => {
      return lang === 'zh_CN'
        ? '/support/900005034163-新手必看：杠杆交易新手指引'
        : '/support/900005034163-How-to-Use-KuCoin-Cross-Margin';
    },
    transfer: {
      tip1: () => _t('marginGuide.transfer.desc'),
    },
    borrow: {
      tip1: () => _t('marginGuide.borrow.desc1'),
      tip2: () => _t('marginGuide.borrow.desc2'),
    },
    order: {
      tip1: () => _t('marginGuide.order.desc'),
    },
    repay: {
      tip1: () => _t('isolated.guide.repay'),
    },
  },

  MARGIN_ISOLATED_TRADE: {
    key: 'MARGIN_ISOLATED_TRADE',
    getGuideHref: (lang) => {
      return ['zh_CN', 'zh_HK'].includes(lang)
        ? '/support/4414443647769-逐倉槓桿交易新手指引（Web版本)-'
        : '/support/4414443647769-How-to-Use-Isolated-Margin-Trading(Web)';
    },
    transfer: {
      tip1: symbol => _t('isolated.guide.transfer1', {
        symbol: replace(symbol, '-', '/'),
      }),
      tip2: () => _t('isolated.guide.transfer2'),
    },
    borrow: {
      tip1: (symbol, leverage) => _t('isolated.guide.borrow1', {
        multi: leverage || 0,
        symbol: replace(symbol, '-', '/'),
      }),
      tip2: () => _t('isolated.guide.borrow2'),
    },
    order: {
      tip1: () => _t('isolated.guide.trade'),
    },
    repay: {
      tip1: () => _t('isolated.guide.repay'),
    },
  },
};
