/**
 * Owner: jesse.shao@kupotech.com
 */
import { showDateTimeByZone } from 'helper';
import { addLangToPath, _t } from 'utils/lang';
import { LANDING_HOST } from 'utils/siteConfig';
import bannerImg from 'assets/asianCarnival/banner.png';
import remainSvg from 'assets/asianCarnival/remain.svg';

// banner 配置
export const BANNER_CONFIG = {
  asianCarnival: {
    activityName: 'KOK',
    regToast: {
      NOT_START: {
        type: 'info',
        msg: _t('kok.nostart.tips'),
      },
      OVER: {
        type: 'info',
        msg: _t('kok.over.tips'),
      },
      SUCCESS: {
        type: 'success',
        msg: _t('kok.join.tips'),
      },
    },
    loginBackUrl: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/kucoin-asian-carnival-kok${window.location.search}`),
    ),
    title: _t('kok.banner.title'),
    subTitle: `(${_t('kok.banner.sub')})`,
    joinText: {
      true: _t('kok.left'),
      false: _t('kok.join'),
    },
    shareText: _t('kok.share'),
    bannerBgImg: bannerImg,
  },
};

// rules 文案
export const RULES_CONFIG = {
  asianCarnival: {
    title: _t('kok.rules'),
    content: [
      _t('kok.rules8'),
      _t('kok.rules9'),
      _t('kok.rules1'),
      _t('kok.rules2'),
      _t('kok.rules3'),
      _t('kok.rules4'),
      _t('kok.rules5'),
      _t('kok.rules6'),
      _t('kok.rules7'),
      _t('kok.rules10'),
      _t('kok.rules11'),
    ],
  },
};

export const STATE_TEXT_CONFIG = {
  asianCarnival: {
    NOT_START: _t('kok.coming'),
    IN_PROGRESS: _t('kok.progress'),
    OVER: _t('kok.finished'),
  },
};

// 活动日期文案
export const TIME_TEXT_CONFIG = {
  asianCarnival: (startDate, endDate) =>
    _t('kok.activity.time', {
      time1: showDateTimeByZone(startDate, 'YYYY/MM/DD HH:mm:ss', 0),
      time2: showDateTimeByZone(endDate, 'YYYY/MM/DD HH:mm:ss', 0),
      utc: 'UTC',
    }),
};

// 活动介绍文案
export const INTRO_TEXT_CONFIG = {
  asianCarnival: {
    activity: [
      {
        title: _t('kok.activity1'),
        content: _t('kok.activity1.content'),
        info: [],
      },
      {
        title: _t('kok.activity2'),
        content: _t('kok.activity2.content'),
        info: [_t('kok.activity2.li1'), _t('kok.activity2.li2')],
      },
    ],
  },
};

// prize pool 文案
export const PRIZE_TEXT_CONFIG = {
  asianCarnival: {
    title: _t('kok.prize.pool'),
    remainImg: remainSvg,
    remain: num => _t('kok.remaining', { num }),
  },
};

// 进度条配置
export const PRIZE_CONFIG = [
  {
    top: 0,
    percent: '0%',
  },
  {
    top: 10000,
    percent: '16%',
  },
  {
    top: 20000,
    percent: '32%',
  },
  {
    top: 30000,
    percent: '48%',
  },
  {
    top: 50000,
    percent: '64%',
  },
  {
    top: 70000,
    percent: '81%',
  },
  {
    top: 100000,
    percent: '100%',
  },
];
