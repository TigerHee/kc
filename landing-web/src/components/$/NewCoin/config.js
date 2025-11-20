/**
 * Owner: jesse.shao@kupotech.com
 */
import { addLangToPath, _t, _tHTML } from 'utils/lang';
import { LANDING_HOST, KUCOIN_HOST } from 'utils/siteConfig';
import { showDateTimeByZone } from 'helper';

// banner 配置
export const BANNER_CONFIG = {
  newCoinCarnival: {
    activityName: {
      one: 'KUCOIN_TREASURE_COIN_CARNIVAL',
      two: 'KUCOIN_TREASURE_COIN_CARNIVAL_2',
    },
    regToast: {
      NOT_START: _t('newCoin.toast.nostart'),
      OVER: _t('newCoin.toast.over'),
      SUCCESS: _t('newCoin.toast.joined'),
      '200200': _t('newCoin.toast.fail'),
    },
    loginBackUrl: {
      one: encodeURIComponent(
        addLangToPath(`${LANDING_HOST}/treasure-coin-carnival${window.location.search}`),
      ),
      two: encodeURIComponent(
        addLangToPath(`${LANDING_HOST}/treasure-coin-carnival-r2${window.location.search}`),
      ),
    },
    title: _t('newCoin.banner.title'),
    subTitle: _tHTML('newCoin.banner.subtitle'),
    newUser: _t('newCoin.banner.newUser'),
    joinText: {
      true: _t('newCoin.banner.joined'),
      false: _t('newCoin.banner.join'),
    },
    shareText: _t('newCoin.banner.share'),
  },
};

export const ACTIVITY_CONFIG = {
  newCoinCarnival: {
    status: {
      NOT_START: _t('newCoin.activity.nostart'),
      IN_PROGRESS: _t('newCoin.activity.progress'),
      OVER: _t('newCoin.activity.over'),
    },
    time: (startDate, endDate) =>
      _t('newCoin.activity.time', {
        time1: showDateTimeByZone(startDate, 'YYYY/MM/DD HH:mm:ss', 0),
        time2: showDateTimeByZone(endDate, 'YYYY/MM/DD HH:mm:ss', 0),
      }),
    info: _t('newCoin.activity.info'),
  },
};

export const RULES_CONFIG = {
  newCoinCarnival: {
    title: _t('newCoin.rules.title'),
    content: [
      'NEED_CONTACT',
      _t('newCoin.rules2'),
      _t('newCoin.rules3'),
      _t('newCoin.rules4'),
      _t('newCoin.rules5'),
      _t('newCoin.rules6'),
      _t('newCoin.rules7'),
    ],
  },
};

// 步骤配置
export const STEPS_CONFIG = {
  loginBackUrl: {
    one: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/treasure-coin-carnival${window.location.search}`),
    ),
    two: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/treasure-coin-carnival-r2${window.location.search}`),
    ),
  },
  list: [
    {
      title: _t('newCoin.step1'),
      text: _t('newCoin.step1.info'),
      buttonText: _t('newCoin.step.go'),
      webUrl: addLangToPath(`${LANDING_HOST}/register${window.location.search}`),
      h5Url: addLangToPath(`${LANDING_HOST}/register${window.location.search}`),
      appUrl: '/user/register',
      kcsensorsBlockId: 'goRegister',
    },
    {
      title: _t('newCoin.step2'),
      text: _t('newCoin.step2.info'),
      buttonText: _t('newCoin.step.go'),
      webUrl: addLangToPath(`${KUCOIN_HOST}/assets/coin`),
      h5Url: addLangToPath(`${KUCOIN_HOST}/assets/coin`),
      appUrl: `/account/deposit`,
      kcsensorsBlockId: 'goDeposit',
    },
    {
      title: _t('newCoin.step3'),
      text: _t('newCoin.step3.info'),
      buttonText: _t('newCoin.step.go'),
      webUrl: addLangToPath(`${KUCOIN_HOST}/trade`),
      h5Url: addLangToPath(`${KUCOIN_HOST}/trade`),
      appUrl: `/trade`,
      kcsensorsBlockId: 'goTrade',
    },
  ],
};
