/**
 * Owner: jesse.shao@kupotech.com
 */
import { isNil, isEmpty, isNumber } from 'lodash';
// import SVGA from 'svgaplayerweb';
import moment from 'moment';
import { M_KUCOIN_HOST, TRADE_HOST } from 'utils/siteConfig';
import { kcsensorsManualExpose } from 'utils/ga';
import { sensors } from 'utils/sensors';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { addLangToPath, _t } from 'utils/lang';
import { scrollToAnchor, formatNumber, isNilOrEmpty } from 'helper';
import Toast from './common/Toast';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import prizeBtc from 'assets/cryptoCup/prize-btc.png';
import prizeEth from 'assets/cryptoCup/prize-eth.png';
import prizeKcs from 'assets/cryptoCup/prize-kcs.png';
import prizeShib from 'assets/cryptoCup/prize-shib.png';
import prizeSol from 'assets/cryptoCup/prize-sol.png';
import prizeTrx from 'assets/cryptoCup/prize-trx.png';
import prizeUsdt from 'assets/cryptoCup/prize-usdt.png';
import prizeGg from 'assets/cryptoCup/prize-gg.svg'; // 杠杆体验金
import prizeHy from 'assets/cryptoCup/prize-hy.svg'; // 合约体验金

// export const SPLITER_WIDTH = 1024;
// 经与UI沟通，当>= 768时，中间只展示375宽度内容
export const SPLITER_WIDTH = 768;

export const CONTENT_WIDTH = 375;

export const PAGE_PADDING_WIDTH = 16;

const RULE_PAGE = {
  zh_CN: addLangToPath(`${KUCOIN_HOST}/announcement/ch-crypto-world-cup-2022`),
  en_US: addLangToPath(`${KUCOIN_HOST}/announcement/en-crypto-world-cup-2022`),
  pt_PT: addLangToPath(`${KUCOIN_HOST}/announcement/pt-crypto-world-cup-2022`),
  tr_TR: addLangToPath(`${KUCOIN_HOST}/announcement/tr-crypto-world-cup-2022`),
  vi_VN: addLangToPath(`${KUCOIN_HOST}/announcement/vn-crypto-world-cup-2022`),
  de_DE: addLangToPath(`${KUCOIN_HOST}/announcement/de-crypto-world-cup-2022`),
  ja_JP: addLangToPath(`${KUCOIN_HOST}/announcement/ja-crypto-world-cup-2022`),
  ko_KR: addLangToPath(`${KUCOIN_HOST}/announcement/ko-crypto-world-cup-2022`),
};

export const getRuleUrl = currentLang => {
  return RULE_PAGE[currentLang] || RULE_PAGE['en_US'];
};

// 曝光元素 blockid locationid
// cryptoCupExpose(['showDes', '1']);
export const cryptoCupExpose = arr => {
  console.log('cryptoCupExpose', arr);
  if (isNil(arr) || isEmpty(arr)) {
    return;
  }
  try {
    kcsensorsManualExpose({ kc_pageid: 'B3FirstWorldCup' }, arr);
  } catch (e) {
    console.log('cryptoCupExpose err:', e.message);
  }
};

// click:  blockid locationid
export const cryptoCupTrackClick = arr => {
  console.log('cryptoCupTrackClick', arr);
  if (isNil(arr) || isEmpty(arr)) {
    return;
  }

  try {
    sensors.trackClick(arr);
  } catch (e) {
    console.log('cryptoCupTrackClick err:', e.message);
  }
};

// export const DEFAULT_API_ERR_TEXT = '系统开小差了，请稍后～';
export const DEFAULT_API_ERR_TEXT = () => _t('qZFRkPGoMNCFAmMry8fXs1');

// 统一维护接口层异常code和文案关系
export const getMsgByErrCode = code => {
  // https://wiki.kupotech.com/pages/viewpage.action?pageId=76422977
  // const msgMap = {
  //   '500007': 'Rules limit', //不符合奖励发放条件
  //   '500020': 'The campaign season does not exist',
  //   '500021': 'The campaign team does not exist',
  //   '500022': 'The user does not permit to enter',
  //   '500023': 'The user have joined the season!!',
  //   '500024': 'The team is up to limit',
  //   '500025': 'The season of campaign has not started',
  //   '500026': 'The season of campaign not in progress',
  //   '500027': 'The Invitation code does not exist',
  //   '500012': 'The campaign has not started',
  //   '500019': 'The campaign not in progress',
  //   '500005': 'The campaign does not exist',
  //   '280007': 'unknown',
  //   '280000': 'success',
  //   '4001': '请求参数错误',
  // };

  const msgMap = {
    '500007': () => _t('sqk7izYQDk4NkRwYTMoL69'), //不符合奖励发放件
    '500020': () => _t('kWw6vHS8bhhRiTvyvZp48R'),
    '500021': () => _t('w1YT3WfwkiVXt8uPbSLq1g'),
    '500022': () => _t('ftUxxE9iacMNB1HyT8Mjdq'),
    '500023': () => _t('82CTmCpTioCSoCg8X2d9Ns'),
    '500024': () => _t('je1dkCpW9AosHYsQ4u3vnK'),
    '500025': () => _t('nVdJWHbEHkWPk9HxPvntAa'),
    '500026': () => _t('vdBuxp4CG9o3ZhwTBfut4M'),
    '500027': () => _t('9po3CFGSZ9HY6tsLsyxUBa'),
    '500012': () => _t('h9sH1P7zGamzYYSBEA3GEf'),
    '500019': () => _t('ppZZKfuNVWHWLaBvc5otXf'),
    '500005': () => _t('amTEQYpV8SephrrguFgbZe'),
    '280007': () => _t('vRHjMmfvQZsTTivQFByAti'),
    '280000': () => _t('mhC56ZyUNSZzKJfJkziqNz'),
    '4001': () => _t('97T6KjFmmWLkVsKMc4gfBa'),
  };

  return msgMap[code] ? msgMap[code]?.() : '';
};

export const toastDefaultError = () => {
  Toast(DEFAULT_API_ERR_TEXT?.());
};

export const toastByCode = code => {
  const text = getMsgByErrCode(code);
  if (text) {
    Toast(text);
    return;
  }
  toastDefaultError();
};

export const toastNoScore = () => {
  Toast(_t('jgqzPutt9anE7HURRUWken'));
};

export const toastByErrObj = errObj => {
  const text = getMsgByErrCode(errObj?.code) || errObj?.msg || errObj?.message;
  if (text) {
    Toast(text);
    return;
  }
  toastDefaultError();
};

// export const loadSVGAAssets = (svgaSrc, htmlId) => {
//   var player = new SVGA.Player(htmlId);
//   var parser = new SVGA.Parser(htmlId);
//   parser.load(svgaSrc, videoItem => {
//     player.setVideoItem(videoItem);
//     player.startAnimation();
//   });
// };

export const POINTS_LIST_TABS = [
  {
    title: () => _t('83oBZ1Whk8Pa6CTp8NjJUY'),
    getDesc: () => {
      return _t('huLTH7wpjaHhGLn2JHP248', { month: 11, day: 16, num: 100 });
    },
  },
  {
    title: () => _t('63ZT4Emx5BTERij4sqo498'),
    getDesc: () => {
      return _t('huLTH7wpjaHhGLn2JHP248', { month: 11, day: 16, num: 100 });
    },
  },
  {
    title: () => _t('2NB2yr91hjrP4BhpHFjmw2'),
    getDesc: () => {
      return _t('huLTH7wpjaHhGLn2JHP248', { month: 11, day: 16, num: 100 });
    },
  },
  {
    title: () => _t('mFrTjfveb2sHbHqNEwLnZ5'),
    getDesc: () => {
      return _t('huLTH7wpjaHhGLn2JHP248', { month: 11, day: 16, num: 100 });
    },
  },
];

export const SEASON_TABS = [
  {
    title: () => _t('tKrtGFBX3TUAZKju9mxJes'),
  },
  {
    title: () => _t('93qw1e1U2WWeJEixfBqTBG'),
  },
  {
    title: () => _t('ptMgnyXbChqpxdBmyGdk6x'),
  },
  {
    title: () => _t('xyWkuqn2Pk7GB2Z7T5Q4N4'),
  },
];

export const getTeamPeople = data => {
  const count = data?.count || 0;
  const limit = data?.limit || 0;

  return count > limit ? limit : count;
};

export const goToDomBlock = elId => {
  try {
    if (!elId) {
      return;
    }
    const dom = document.getElementById(elId);
    if (!dom) {
      return;
    }

    const selectTeamTop = dom.getBoundingClientRect()?.top;
    if (elId === 'CryptoCup-SelectTeam-Anchor' && Math.abs(selectTeamTop) <= 10) {
      // Toast('选择币种加入队伍');
      Toast(_t('kRdwMfAnjkHd6DJYNYD1Gp'));
      return;
    }
    scrollToAnchor(elId);
    // const header = document.querySelector('#CRYPTO_CUP_SCROLL_EL header');
    // const headerHeight = header.offsetHeight || 0;

    // setTimeout(() => {
    //   const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    //   window.scrollTo({
    //     top: scrollTop - headerHeight,
    //     // top: scrollTop,
    //     left: 0,
    //   });
    // }, 200);
    // let scrollEl = document.getElementById('CRYPTO_CUP_SCROLL_EL');
    // const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    // window.scrollTo({
    //   // top: scrollTop - headerHeight,
    //   top: scrollTop,
    //   left: 0,
    // });
  } catch (e) {
    console.log('goToDomBlock err:', e);
  }
};

// 去现货交易页面的跳转添加
export const TRADE_URL = {
  appUrl: `/trade`,
  pcUrl: `${TRADE_HOST}/BTC-USDT`,
  h5Url: `${M_KUCOIN_HOST}/trade/BTC-USDT`,
};

export const SHARE = {
  ar_AE: 'https://assets.staticimg.com/cms/media/8DZMzaNxYUKKlfW18udwJyTN7CX87bb8S6ww98GyX.jpg',
  bn_BD: 'https://assets.staticimg.com/cms/media/4HObOfQOuPAnxw1buYOrDUJKDZ902AzngKEaTW4VF.jpg',
  de_DE: 'https://assets.staticimg.com/cms/media/5duehPieoENTg2dxdW7Ws5IwcfYdW4bqW3PM7R5rG.jpg',
  en_US: 'https://assets.staticimg.com/cms/media/43IoTVL9x7zQjQG0cZct5M6rg1SSmD7KijQgPF2Sd.jpg',
  es_ES: 'https://assets.staticimg.com/cms/media/2lg2BB5dwg3crBH2gCLGd6MHBWD5EPU1JPNwR7R8Q.jpg',
  fil_PH: 'https://assets.staticimg.com/cms/media/6CpsIZ7LpONlKsaW3LoHpaZ4Af0j4GsjZgyEvBffW.jpg',
  fr_FR: 'https://assets.staticimg.com/cms/media/4cijrz6ypN4bSHOIfkMgk2UN8g0M5DUGZiedrHeCz.jpg',
  hi_IN: 'https://assets.staticimg.com/cms/media/6rJVnqXAHk111WvEFuEyNBmpTIURvFHa6Il0gN9KW.jpg',
  id_ID: 'https://assets.staticimg.com/cms/media/5IH73X9vK4kiZSRaJLTBncLNNr78IUu9wAQeqogtS.jpg',
  it_IT: 'https://assets.staticimg.com/cms/media/9OVracxc2WbdGddBgE1Z8BYyC8yx3MJLMZ7XeY7Ua.jpg',
  ja_JP: 'https://assets.staticimg.com/cms/media/6mnho7TsArzgQzIEfXCXUwfGdclJ0EX12B8mTTYa8.jpg',
  ko_KR: 'https://assets.staticimg.com/cms/media/3vSaZDQTv3onZRwyTWxnClpkZlHe9XbTHfj57UroI.jpg',
  ms_MY: 'https://assets.staticimg.com/cms/media/1d89Xa6qqXI9OK7PcRSYCBovMjy66j6hsn7A3PU7o.jpg',
  nl_NL: 'https://assets.staticimg.com/cms/media/4YzAYwCAqOXTfOLVfU2IZXde2OFcKU4tOoVBW9Q2h.jpg',
  pl_PL: 'https://assets.staticimg.com/cms/media/9VmHZMZSNViJicp5cPiENIgBTxsH09ESC33c6dueE.jpg',
  pt_PT: 'https://assets.staticimg.com/cms/media/8tTzNdpMGnQVCbutka2Hlu98sZGiLD59egnsfm2Ti.jpg',
  ru_RU: 'https://assets.staticimg.com/cms/media/5RS08aD8znSifCqRC5GNYu9u6wYoOO9akh03a00Z0.jpg',
  th_TH: 'https://assets.staticimg.com/cms/media/7ApKjb56817Zf5e9jrT8M9bDDIPJztf7YcnZ5ER8m.jpg',
  tr_TR: 'https://assets.staticimg.com/cms/media/8osGKCQXiJ4nnTihnhEYqKMaDImzl2njWoc4L3ZFG.jpg',
  vi_VN: 'https://assets.staticimg.com/cms/media/4VorLBpwIWxQm4sCO9BffCI9XhSx1FKSIf9p6UzZT.jpg',
  zh_CN: 'https://assets.staticimg.com/cms/media/1drAPQdVtlZr12jK557AP1RkSJcfPc8wh3LTDwHJL.jpg',
  zh_HK: 'https://assets.staticimg.com/cms/media/8ADT8kCYMbjNg5uRZ3NDESc71yAHZTsl9IOjpswpC.jpg',
};

export const BANNER = {
  ar_AE: 'https://assets.staticimg.com/cms/media/7eJOJXLNsHFX9d74OY6A7rDsABqzEECw0hKo495ej.jpg',
  bn_BD: 'https://assets.staticimg.com/cms/media/31xWoYMtlgzP4yLOySGcltgwrxcc4bIiLMPXY5JYe.jpg',
  de_DE: 'https://assets.staticimg.com/cms/media/2krKpK8CTJCTv6lIhAuW3ii7byAETutwFTBFp27iA.jpg',
  en_US: 'https://assets.staticimg.com/cms/media/37xIYwmacZqbJyOtPABCn4aWuz5AlTU5WJ2LBGy5V.jpg',
  es_ES: 'https://assets.staticimg.com/cms/media/3wP6WMCE90ObmbksQJzPwa0a0IGSsqdIX3xCXMAnv.jpg',
  fil_PH: 'https://assets.staticimg.com/cms/media/8AQWdhTYebgnohjfRasWFbpfcQEOwGooBha1LH6p5.jpg',
  fr_FR: 'https://assets.staticimg.com/cms/media/9Y4LfIR87nzGXsI4E25OBYATXd8sCJPvutVjsKE6Y.jpg',
  hi_IN: 'https://assets.staticimg.com/cms/media/2KQPRLBGywylNlTfLIMluAvpAoh7yEq0EUhiqU9qg.jpg',
  id_ID: 'https://assets.staticimg.com/cms/media/7IEcVtjcB6Q8PkZGjnuIqNxq9753sN6KERtnR6zQD.jpg',
  it_IT: 'https://assets.staticimg.com/cms/media/5pTtGn0vLgtceG6TMsmM6ARQzTbk5mDHxRhvsajFd.jpg',
  ja_JP: 'https://assets.staticimg.com/cms/media/2TwPH4cln8COsaYbwF3wq8aWtQXD4GObwOJbqvbcf.jpg',
  ko_KR: 'https://assets.staticimg.com/cms/media/3yJxZ4tvI5LeX9KhajSGm7w5rcbZkhEIRlKu9NFcj.jpg',
  ms_MY: 'https://assets.staticimg.com/cms/media/4rRvLl0L0HVICPhaM2QHEMi3QaQ0GjDnP7FECy9JN.jpg',
  nl_NL: 'https://assets.staticimg.com/cms/media/2Vlp3XWEEnlVodQ4GGKkA22QTstZTjlQZOViYZPuJ.jpg',
  pl_PL: 'https://assets.staticimg.com/cms/media/5NRLoFN3wDgGJz24syrlB15xFi1TebbmmY2NvcvbM.jpg',
  pt_PT: 'https://assets.staticimg.com/cms/media/2feFAePv72XndSZgukf7PiMK6rrxxxEbOG2OwgMdR.jpg',
  ru_RU: 'https://assets.staticimg.com/cms/media/9YQZUwKYessxg9HONZbKsZwaRgmrlyGglUDve9csm.jpg',
  th_TH: 'https://assets.staticimg.com/cms/media/3lMHEZF0OarVKQ4uTTiKnkJCNz9rc9oZN67TjnFPI.jpg',
  tr_TR: 'https://assets.staticimg.com/cms/media/17WeR4TCDaDUMu0G92t7knlNpKvEXd6DU37sNHHXh.jpg',
  vi_VN: 'https://assets.staticimg.com/cms/media/5QcebefYmhVYQjDqoqbBj0rI90h7ld6t1xN2UJS2d.jpg',
  zh_CN: 'https://assets.staticimg.com/cms/media/5g4O8ufSz7JzUADP9GemuRkMxXfiCWOEtHGo9Oohm.jpg',
  zh_HK: 'https://assets.staticimg.com/cms/media/4tXzJ0Ob5Se5eOT2tMr8oRgajI0qcKHEPHCzJ3T3n.jpg',
};

export const WIN_LIST = [
  { title: () => _t('jFhYX4NLoCBjbrWCQpx2Qy', { num: 500 }), icon: prizeUsdt },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 5, token: 'SHIB' }), icon: prizeShib },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 1, token: 'KCS' }), icon: prizeKcs },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 1, token: 'ETH' }), icon: prizeEth },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 1, token: 'BTC' }), icon: prizeBtc },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 0.1, token: 'TRX' }), icon: prizeTrx },
  { title: () => _t('qtB4RgSKLPnrbTPwXA6j58', { num: 10 }), icon: prizeHy },
  { title: () => _t('aBgfxg1w2BP3zrNBAbXesP', { num: 5 }), icon: prizeGg },
];

export const FAIL_LIST = [
  { title: () => _t('jFhYX4NLoCBjbrWCQpx2Qy', { num: 100 }), icon: prizeUsdt },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 1, token: 'SOL' }), icon: prizeSol },
  { title: () => _t('8G3kuh95kgPRNwhqwgYh3R', { num: 0.1, token: 'TRX' }), icon: prizeTrx },
  { title: () => _t('qtB4RgSKLPnrbTPwXA6j58', { num: 10 }), icon: prizeHy },
  { title: () => _t('aBgfxg1w2BP3zrNBAbXesP', { num: 5 }), icon: prizeGg },
];

export const getRecord = (data, key) => {
  if (isNilOrEmpty(data) || !key) return '-';
  if (isNumber(data[key])) return parseInt(data[key]);

  return '-';
};

// 帮好友助力结果配置
export const HELP_RESULT_CONFIG = {
  500028: 'ended',
  500029: 'joined',
  500030: 'helped',
  500031: 'limit',
  200: 'success',
};

// 帮好友助力失败码
export const HELP_FAIL_NAMES = ['joined', 'helped', 'limit', 'ended'];

// 帮好友助力失败文案
export const HELP_FAIL_TEXT_CONFIG = {
  joined: () => _t('i8garrVxcXucPGymaTusqr'),
  helped: () => _t('9Hm835hTeZwQa1fRxztZQR'),
  limit: () => _t('9t5Yhx9hqkwePX91agPDnY'),
  ended: () => _t('pejj1UEzK3S9htPMKGMJQm'),
};

export const NFT_LIST = [
  {
    title: 'BTC KuCup',
    url: 'https://assets.staticimg.com/cms/media/2SyJSV4I0nd1nUjsN04caLM6Wk7cNtI4gHOu9kdn5.jpg',
  },
  {
    title: 'ETH KuCup',
    url: 'https://assets.staticimg.com/cms/media/9OgNsyqdxDQES85q7uPW96YUNvZXCTiRo5n0q4Gpq.jpg',
  },
  {
    title: 'DOGE KuCup',
    url: 'https://assets.staticimg.com/cms/media/3Y99nbsmUd6keccwgJQAOjlVS5K8cOrFCWM4AwI8V.jpg',
  },
  {
    title: 'SHIB KuCup',
    url: 'https://assets.staticimg.com/cms/media/1XEn3lZynADz2kVBqOZ8sbJIVKRGsn1trqFnl1Lsi.jpg',
  },
  {
    title: 'VRA KuCup',
    url: 'https://assets.staticimg.com/cms/media/1fW2MIQCpkBO9XrVoN958pvBrmB41mJmN4e4rz1Gm.jpg',
  },
  {
    title: 'KLAY KuCup',
    url: 'https://assets.staticimg.com/cms/media/3VymG0h2mexy7HCQGMnrReF4vct1VXI3YeWdkdNIM.jpg',
  },
  {
    title: 'NEAR KuCup',
    url: 'https://assets.staticimg.com/cms/media/79SJPGn3QfySCyEx8TeG6YyBXwof3ngA0lAQk2Euj.jpg',
  },
  {
    title: 'OP KuCup',
    url: 'https://assets.staticimg.com/cms/media/8E6VJkd59iOBBn7iPubxmgxWVu2SJIAqizdeA0X8o.png',
  },
];

// 助力方法2的开始时间
export const HELP_WAY2_START_TIME = moment.utc('2022-11-07 02:00:00').valueOf();

// 判断是否是决赛
export const isFinalRaceFunc = (seasonNameEn, seasonStatus) => {
  return seasonNameEn === '2TO1' && seasonStatus === 3;
};

// 这些语言文案会很长
export const isLongTextLang = [
  'hi_IN',
  'bn_BD',
  'de_DE',
  'fr_FR',
  'id_ID',
  'ja_JP',
  'ms_MY',
  'fil_PH',
  'ru_RU',
  'pt_PT',
  'nl_NL',
  'tr_TR',
  'pl_PL',
];

// 赛制的名称映射
export const SEASON_NAME_MAP = {
  '16TO8': () => _t('tKrtGFBX3TUAZKju9mxJes'),
  '8TO4': () => _t('93qw1e1U2WWeJEixfBqTBG'),
  '4TO2': () => _t('ptMgnyXbChqpxdBmyGdk6x'),
  '2TO1': () => _t('xyWkuqn2Pk7GB2Z7T5Q4N4'),
};

// 赛制的下一阶段名称
export const SEASON_NEXT_MAP = {
  '16TO8': () => _t('93qw1e1U2WWeJEixfBqTBG'),
  '8TO4': () => _t('ptMgnyXbChqpxdBmyGdk6x'),
  '4TO2': () => _t('xyWkuqn2Pk7GB2Z7T5Q4N4'),
  '2TO1': () => null,
};

export const convertIndex = groups => {
  const mapIndex = {
    8: {
      0: 0,
      1: 2,
      2: 4,
      3: 6,
      4: 1,
      5: 3,
      6: 5,
      7: 7,
    },
    4: {
      0: 0,
      1: 2,
      2: 1,
      3: 3,
    },
  };

  const indexs = mapIndex[(groups?.length)];
  if (!indexs) {
    return groups;
  }

  const list = [];
  groups.forEach((g, i) => {
    const finalIndex = indexs[i];
    list[finalIndex] = g;
  });
  return list.filter(el => !isNil(el));
};

export const getAppLoginParams = () => {
  const rcode = queryPersistence.getPersistenceQuery('rcode');
  const appLoginParams = rcode ? `?rcode=${rcode}` : '';
  return appLoginParams;
};

// 奖品名称和价值
export const genPrizeNameAndValue = (awardNameEn = '', valueOfUsdt = '') => {
  if (awardNameEn) {
    return `${awardNameEn} ${formatNumber(valueOfUsdt, 2)}${window._BASE_CURRENCY_}`;
  }
  return null;
};

/**
 * 获取 平台 对应的 url key 标识
 * @param {*} isInApp
 * @param {*} isMobile
 * @returns
 */
export const getPlatformUrlKey = (isInApp, isMobile) => {
  if (isInApp) return 'appUrl';
  if (isMobile) return 'h5Url';
  return 'pcUrl';
};
