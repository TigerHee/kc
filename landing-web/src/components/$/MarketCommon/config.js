/**
 * Owner: jesse.shao@kupotech.com
 */
import { useMediaQuery } from 'react-responsive';
import qs from 'qs';
import { pickBy } from 'lodash';
import moment from 'moment';
import JsBridge from 'utils/jsBridge';
import { addLangToPath, _t } from 'utils/lang';
import { KUCOIN_HOST, LANDING_HOST } from 'utils/siteConfig';
import facebookSvg from 'assets/registration/facebook.svg';
import twitterSvg from 'assets/registration/twitter.svg';
import telegramSvg from 'assets/registration/telegram.svg';

const MAX_WIDTH = 768;
// 巴基斯坦活动code
export const PAKISTAN_CAMPAIGN_CODE = 'TRXPK';
export const TURKEY_UTM_SOURCE = 'turky_new';
export const PROMOTION_UTM_SOURCE = 'coindesk-5';

/**
 * 函数的作用:详见 https://jira.kupotech.com/browse/TOBC-325 和 https://jira.kupotech.com/browse/TOBC-328 的分享逻辑
 * @param    {String}  rcode            选填，当前用户的rcode
 * @param    {String}  utm_source       必填，活动默认utm_source码
 * @param    {String}  scene            必填，场景 'share' 分享;'gotoRegister' 去注册页
 * @param    {String}  needConvertedUrl 必填，形如：https://www.kucoin.com/land/sepa-lucky-draw?c=31&b=2
 * @return   {String}                   最终的链接,形如:https://www.kucoin.com/land/sepa-lucky-draw?rcode=33&c=31&b=2&utm_source=77
 */
export const getLinkByScene = ({ rcode, utm_source, scene, needConvertedUrl = '' } = {}) => {
  if (!needConvertedUrl || !scene || !utm_source) {
    return '';
  }
  try {
    const parsed = new URL(needConvertedUrl);
    const pageParams = qs.parse(parsed.search.slice(1));
    const utmSource = pageParams.utm_source || utm_source || '';
    let finalRcode = '';
    if (scene === 'share') {
      finalRcode = rcode;
    } else if (scene === 'gotoRegister') {
      finalRcode = pageParams.rcode || '';
    }
    const query = pickBy(
      {
        ...pageParams,
        utm_source: utmSource,
        rcode: finalRcode,
      },
      Boolean,
    );
    const link = `${parsed.origin}${parsed.pathname}?${qs.stringify(query)}`;
    return link;
  } catch {
    return needConvertedUrl;
  }
};

export const getNewcomeUrl = utm_source =>
  getLinkByScene({
    utm_source,
    scene: 'gotoRegister',
    needConvertedUrl: addLangToPath(`${LANDING_HOST}/newcomer-guide${window.location.search}`),
  });

export const getSignUpUrl = utm_source =>
  getLinkByScene({
    utm_source,
    scene: 'gotoRegister',
    needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/ucenter/signup${window.location.search}`),
  });

export const getHomeUrl = utm_source =>
  getLinkByScene({
    utm_source,
    scene: 'gotoRegister',
    needConvertedUrl: addLangToPath(`${KUCOIN_HOST}${window.location.search}`),
  });

export const useIsMobile = () => {
  const isMobile = useMediaQuery({ maxWidth: MAX_WIDTH });
  return isMobile;
};

export const handleSignUp = (isInApp, supportCookieLogin, signUpUrl) => {
  if (isInApp && supportCookieLogin) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/register',
      },
    });
    return;
  }

  const backUrl = encodeURIComponent(window.location.href);
  const currentSearch = window.location.search;
  const searchValue = currentSearch ? `${currentSearch}&backUrl=${backUrl}` : `?backUrl=${backUrl}`;

  const jumpUrl = signUpUrl
    ? addLangToPath(`${signUpUrl}&backUrl=${backUrl}`)
    : addLangToPath(`${KUCOIN_HOST}/ucenter/signup${searchValue}`);

  window.location.href = jumpUrl;
};

// notice文案
export const NOTICE_CONFIG = {
  luckydrawTurkey: {
    // tr-TR
    notice:
      `${window._BRAND_NAME_}, Forbes Advisor tarafından 2023'ün En İyi Borsalardan biri seçildi.`,
  },
  luckydraw: {
    notice: `${window._BRAND_NAME_} was named one of the Best Exchanges in 2023 by Forbes Advisor.`,
  },
  pakistanCampaign: {
    notice: `${window._BRAND_NAME_} was named one of the Best Exchanges in 2023 by Forbes Advisor.`,
  },
  asianCarnival: {
    notice: _t('kok.notice'),
  },
  luckydrawSepa: {
    notice: _t('spea.notice'),
  },
  newCoinCarnival: {
    notice: _t('register.notice'),
  },
  promotion: {
    notice: _t('register.notice'),
  },
  lego: {
    notice: _t('register.notice'),
  },
};

// bouns文案
export const BONUS_CONFIG = {
  luckydrawTurkey: {
    numInfo: num => (
      <span>
        Acele edin! Şimdi yalnızca <span>{num}</span> kaldı
      </span>
    ),
    welcome: 'Başlamak için hoşgeldin bonusu alın',
    signUp: 'Kaydol',
    newcomerUrl: () => '',
    signUpUrl: () => '',
  },
  luckydraw: {
    numInfo: num => (
      <span>
        Hurry! Only <span>{num}</span> left now
      </span>
    ),
    welcome: 'Get welcome bonus to start',
    signUp: 'Sign Up',
    newcomerUrl: () => '',
    signUpUrl: () => '',
  },
  pakistanCampaign: {
    numInfo: num => (
      <span>
        Remaining Gifts: <span>{num}</span>
      </span>
    ),
    welcome: 'Register to claim newbie gifts!',
    signUp: 'Sign Up',
    newcomerUrl: () => getNewcomeUrl(PAKISTAN_CAMPAIGN_CODE),
    signUpUrl: () => getSignUpUrl(PAKISTAN_CAMPAIGN_CODE),
  },
  asianCarnival: {
    numInfo: num => <span>{_t('kok.hurry', { num })}</span>,
    welcome: _t('kok.welcome'),
    signUp: _t('kok.sign.up'),
    newcomerUrl: () => '',
    signUpUrl: () => '',
  },
  luckydrawSepa: {
    numInfo: num => _t('spea.hurry', { num }),
    welcome: _t('spea.welcome'),
    signUp: _t('spea.signup'),
    newcomerUrl: () => '',
    signUpUrl: () => '',
  },
  newCoinCarnival: {
    numInfo: num => _t('register.prizes', { 1: num }),
    welcome: _t('register.signup.now'),
    signUp: _t('register.signup'),
    newcomerUrl: () => '',
    signUpUrl: () => '',
  },
  newTurkey: {
    numInfo: num => (
      <span>
        Acele edin! Şimdi yalnızca <span>{num}</span> kaldı
      </span>
    ),
    welcome: 'Başlamak için hoşgeldin bonusu alın',
    signUp: 'Kaydol',
    newcomerUrl: () => getNewcomeUrl(TURKEY_UTM_SOURCE),
    signUpUrl: () => getSignUpUrl(TURKEY_UTM_SOURCE),
  },
  promotion: {
    numInfo: num => _t('register.prizes', { 1: num }),
    welcome: _t('register.signup.now'),
    signUp: _t('register.signup'),
    newcomerUrl: () => getNewcomeUrl(PROMOTION_UTM_SOURCE),
    signUpUrl: () => getSignUpUrl(PROMOTION_UTM_SOURCE),
  },
  lego: {
    numInfo: num => _t('register.prizes', { 1: num }),
    welcome: _t('register.signup.now'),
    signUp: _t('register.signup'),
    newcomerUrl: channelCode => getNewcomeUrl(channelCode),
    signUpUrl: channelCode => getSignUpUrl(channelCode),
  },
};

const commonCommunity = [
  { url: 'https://www.facebook.com/KuCoinOfficial', icon: facebookSvg },
  { url: 'https://twitter.com/KuCoinCom', icon: twitterSvg },
  { url: 'https://t.me/Kucoin_Exchange', icon: telegramSvg },
];

// footer文案 和 社群链接
export const FOOTER_CONFIG = {
  luckydrawTurkey: {
    follow: 'Bizi takip edin',
    copyRight: 'TelifHakkı © 2017 - 2022 KuCoin.com. Her hakkı saklıdır.',
    community: commonCommunity,
    homeUrl: () => '',
  },
  pakistanCampaign: {
    follow: 'Follow Us',
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: () => getHomeUrl(PAKISTAN_CAMPAIGN_CODE),
  },
  luckydraw: {
    follow: 'Follow Us',
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: () => '',
  },
  asianCarnival: {
    follow: _t('kok.follow'),
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: () => '',
  },
  luckydrawSepa: {
    follow: _t('spea.follow'),
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: () => '',
  },
  newCoinCarnival: {
    follow: _t('register.follow'),
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: () => '',
  },
  newTurkey: {
    follow: 'Bizi takip edin',
    copyRight: 'TelifHakkı © 2017 - 2022 KuCoin.com. Her hakkı saklıdır.',
    community: commonCommunity,
    homeUrl: () => getHomeUrl(TURKEY_UTM_SOURCE),
  },
  promotion: {
    follow: _t('register.follow'),
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: () => getHomeUrl(TURKEY_UTM_SOURCE),
  },
  lego: {
    follow: _t('register.follow'),
    copyRight: _t('legao.copy.right', { endYear: moment().year() }),
    community: commonCommunity,
    homeUrl: channelCode => getHomeUrl(channelCode),
  },
};
