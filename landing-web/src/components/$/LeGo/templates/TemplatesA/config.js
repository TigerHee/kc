/**
 * Owner: jesse.shao@kupotech.com
 */
import { _t } from 'utils/lang';
import { dateTimeFormat } from 'helper';

// banner 配置
export const BANNER_CONFIG = {
  joinText: {
    true: _t('newCoin.banner.joined'),
    false: _t('newCoin.banner.join'),
  },
  shareText: _t('newCoin.banner.share'),
  regToast: {
    NOT_START: _t('newCoin.toast.nostart'),
    OVER: _t('newCoin.toast.over'),
    SUCCESS: _t('newCoin.toast.joined'),
    110020: _t('newCoin.toast.fail'),
  },
};

export const ACTIVITY_CONFIG = {
  status: {
    1: _t('newCoin.activity.nostart'),
    2: _t('newCoin.activity.progress'),
    3: _t('newCoin.activity.over'),
  },
  time: (startDate, endDate, currentLang) => {
    return _t('newCoin.activity.time', {
      time1: dateTimeFormat({
        currentLang,
        ts: startDate,
        options: {
          timeZone: 'UTC',
        },
      }),
      time2: dateTimeFormat({
        currentLang,
        ts: endDate,
        options: {
          timeZone: 'UTC',
        },
      }),
    });
  },
};
