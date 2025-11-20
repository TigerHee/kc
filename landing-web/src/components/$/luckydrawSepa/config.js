/**
 * Owner: jesse.shao@kupotech.com
 */
import { showDateTimeByZone } from 'helper';
import { addLangToPath, _t, _tHTML } from 'utils/lang';
import { LANDING_HOST, KUCOIN_HOST } from 'utils/siteConfig';
import bannerImg from 'assets/luckydrawSepa/banner.png';
import Step1Icon from 'assets/luckydrawTurkey/step2.png';
import Step2Icon from 'assets/luckydrawSepa/step2.svg';
import Step3Icon from 'assets/luckydrawSepa/step3.svg';
import thumbImg from 'assets/luckydrawSepa/thumb.png';
import remainSvg from 'assets/asianCarnival/remain.svg';

// banner 配置
export const BANNER_CONFIG = {
  luckydrawSepa: {
    activityName: 'SEPA_LUCKY_DRAW',
    regToast: {
      NOT_START: {
        type: 'info',
        msg: _t('spea.nostart.toast'),
      },
      OVER: {
        type: 'info',
        msg: _t('spea.over.toast'),
      },
      SUCCESS: {
        type: 'success',
        msg: _t('spea.join.toast'),
      },
    },
    loginBackUrl: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/sepa-lucky-draw${window.location.search}`),
    ),
    title: _t('spea.banner.title1'),
    joinText: {
      true: _t('spea.joined'),
      false: _t('spea.join'),
    },
    shareText: _t('spea.invite'),
    bannerBgImg: bannerImg,
  },
};

export const STATE_TEXT_CONFIG = {
  luckydrawSepa: {
    NOT_START: _t('spea.activity.coming'),
    IN_PROGRESS: _t('spea.activity.progress'),
    OVER: _t('spea.activity.finished'),
  },
};

// 活动日期文案
export const TIME_TEXT_CONFIG = {
  luckydrawSepa: (startDate, endDate) =>
    _t('spea.activity.time', {
      time1: showDateTimeByZone(startDate, 'YYYY/MM/DD HH:mm:ss', 0),
      time2: showDateTimeByZone(endDate, 'YYYY/MM/DD HH:mm:ss', 0),
      utc: 'UTC',
    }),
};

// prize pool 文案
export const PRIZE_TEXT_CONFIG = {
  luckydrawSepa: {
    title: _t('spea.prize'),
    remainImg: remainSvg,
    imgLink:
      'https://docs.google.com/spreadsheets/d/1yUOCfgbo17T4DyZufHjjC1XyYCecqshaL7qVHPHI1hE/edit?usp=sharing',
  },
};

// 10个coin 位置
export const COIN_CONFIG = [
  { top: '25%', left: '60%', width: '40%', class: 'move1' },
  { top: '55%', left: '6%', width: '30%', class: 'move2' },
  { top: '70%', left: '55%', width: '30%', class: 'move3' },
  { top: '90%', left: '25%', width: '25%', class: 'move4' },
  { top: '5%', left: '21%', width: '30%', class: 'move1' },
  { top: '39%', left: '32%', width: '25%', class: 'move2' },
  { top: '-30%', left: '50%', width: '30%', class: 'move3' },
  { top: '-20%', left: '80%', width: '30%', class: 'move4' },
  { top: '-30%', left: 0, width: '30%', class: 'move1' },
  { top: '23%', left: '-13%', width: '30%', class: 'move2' },
];

// 步骤配置
export const STEPS_CONFIG = {
  luckydrawSepa: {
    title: _t('spea.part.title'),
    videoTitle: _t('spea.video.title'),
    activity1: _t('spea.part.title1'),
    activity1Item: [_tHTML('spea.part.li1'), _t('spea.part.li2')],
    activity2: coin => _t('spea.part.li3', { coin }),
    activity3: _t('spea.part.title2'),
    activity3Item: [_t('spea.part.li4'), _t('spea.part.li5')],
    deposit: _t('spea.step.how'),
    loginBackUrl: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/sepa-lucky-draw${window.location.search}`),
    ),
    thumbImg: thumbImg,
    list: [
      {
        icon: Step1Icon,
        title: _t('spea.step1.title'),
        text: _t('spea.step1'),
        buttonText: _t('spea.step.go'),
        webUrl: addLangToPath(`${KUCOIN_HOST}/account/kyc`),
        h5Url: addLangToPath(`${KUCOIN_HOST}/account/kyc`),
        appUrl: '/user/kyc',
      },
      {
        icon: Step2Icon,
        title: _t('spea.step2.title'),
        text: _t('spea.step2'),
        buttonText: _t('spea.step.go'),
        webUrl: addLangToPath(`${KUCOIN_HOST}/assets/fiat-currency/recharge?fiatCurrency=EUR`),
        h5Url: addLangToPath(`${KUCOIN_HOST}/assets/fiat-currency/recharge?fiatCurrency=EUR`),
        appUrl: `/otc/fiat/recharge?fiat=EUR`,
      },
      {
        icon: Step3Icon,
        title: _t('spea.step3.title'),
        text: _t('spea.stpe3'),
        buttonText: _t('spea.step.go'),
        webUrl: addLangToPath(`${KUCOIN_HOST}/express?currency=EUR`),
        h5Url: addLangToPath(`${KUCOIN_HOST}/express?currency=EUR`),
        appUrl: `/otc?type=2&fiat=EUR&market=USDT&mode=0`,
      },
    ],
  },
};

// rules 文案
export const RULES_CONFIG = {
  luckydrawSepa: {
    title: _t('spea.rules'),
    content: [
      _t('spea.rules1', { day: 7 }),
      _t('spea.rules2', {
        url: addLangToPath(
          `${KUCOIN_HOST}/blog/kucoin-integrates-sepa-for-simpler-fiat-on-ramp-services`,
        ),
      }),
      _t('spea.rules3'),
      _t('spea.rules4'),
      _t('spea.rules5'),
      _t('spea.rules6'),
    ],
  },
};
