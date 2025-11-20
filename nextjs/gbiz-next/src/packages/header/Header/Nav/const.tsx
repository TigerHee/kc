/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { BonusIcon } from '@kux/iconpack';
import { getSiteConfig } from '../siteConfig';
import partner_header_entry from '../../static/newHeader/partner_header_entry.svg';
import rewards_light from '../../static/newHeader/rewards/rewards_light.webp';
import rewards_dark from '../../static/newHeader/rewards/rewards_dark.webp';
import rewards_light_svg from '../../static/newHeader/rewards/light_rewards.svg';
import rewards_dark_svg from '../../static/newHeader/rewards/dark_rewards.svg';
import { kcsensorsClick } from '../../common/tools';
import trade from '../../static/newHeader/new_spot.svg';
import card from '../../static/newHeader/new_card.svg';
import fastCoin from '../../static/newHeader/new_fastcoin.svg';
import OTC from '../../static/newHeader/new_OTC.svg';
import margin_trade from '../../static/newHeader/new_margin.svg';
import lightning_trade from '../../static/newHeader/new_exchange.svg';
import KumexPro from '../../static/newHeader/new_pro.svg';
import KumexLite from '../../static/newHeader/new_lite.svg';
import reward from '../../static/newHeader/reward.svg';
import api_icon from '../../static/newHeader/api_icon.svg';
import { bootConfig } from 'kc-next/boot';
import addLangToPath from 'tools/addLangToPath';
// import header_1212 from '../../../static/newHeader/header_1212.png';
import styles from './styles.module.scss';
import { Tooltip } from '@kux/mui-next';
import type { FirstLevelNavigation } from './types';

export const DEFAULT_MENU_KEY = {
  MARKETS: 'markets',
  OTC: 'otc',
  TRADE: 'trade',
  KUMEX: 'kumex',
  FINANCING: 'financing',
  KUCHAIN: 'kuchain',
  MORE: 'more',
};

export const MarketsItem = (currentLang, t) => {
  return {
    key: DEFAULT_MENU_KEY.MARKETS,
    getTitle: () => t('nav.market'),
    ga: 'ind2_nav_mkt',
    subUrl: `/markets?lang=${currentLang}`,
    prefix: 'KUCOIN_HOST',
  };
};
// 交易下拉菜单配置
export const OtcItem = (visible, currentLang, currency, t) => {
  let items: any = [];

  // console.log('currentLang:', currentLang);

  if (currentLang === 'zh_CN') {
    return {
      key: DEFAULT_MENU_KEY.OTC,
      getTitle: () => t('nav.purchase.coin'),
      ga: 'ind_nav_otc',
      subUrl: `/otc?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
      items: [
        {
          icon: OTC,
          getTitle: () => t('newHeader.menu.otc'),
          getSubTitle: () => t('menu.otc.desc'),
          ga: 'ind_nav_otc',
          subUrl: `/otc?lang=${currentLang}`,
          prefix: 'KUCOIN_HOST',
        },
        {
          icon: fastCoin,
          getTitle: () => t('newHeader.menu.fastCoin'),
          getSubTitle: () => t('menu.fastCoin.desc'),
          ga: 'ind_nav_express',
          subUrl: `?lang=${currentLang}&currency=${currency}`,
          prefix: 'FASTCOIN_HOST',
          // flag: 'NEW',
        },
      ],
    };
  }

  const OTC_ITEMS = [
    {
      icon: card,
      getTitle: () => t('newHeader.menu.payment'),
      getSubTitle: () => t('menu.payment.desc'),
      ga: 'ind_nav_credit',
      subUrl: `/assets/payments?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
      stress: 'HOT',
    },
    {
      icon: OTC,
      getTitle: () => t('newHeader.menu.otc'),
      getSubTitle: () => t('menu.otc.desc'),
      ga: 'ind_nav_otc',
      subUrl: `/otc?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
    },
    {
      icon: fastCoin,
      getTitle: () => t('newHeader.menu.fastCoin'),
      getSubTitle: () => t('menu.fastCoin.desc'),
      ga: 'ind_nav_express',
      subUrl: `?lang=${currentLang}&currency=${currency}`,
      prefix: 'FASTCOIN_HOST',
      // flag: 'NEW',
    },
  ];

  if (visible) {
    items = [...OTC_ITEMS];
  } else {
    items = [...OTC_ITEMS.slice(0, 2)];
  }
  return {
    key: DEFAULT_MENU_KEY.OTC,
    getTitle: () => t('nav.purchase.coin'),
    items,
  };
};

// 理财下拉菜单配置
export const FinancingItems = (currentLang, t, isSub = false) => {
  let items = [
    {
      getTitle: () => t('margin.lend.out'),
      getSubTitle: () => t('margin.desc'),
      ga: 'ind2_nav_ledi',
      subUrl: `/margin/lend?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
      getFlag: () => t('nav.marginLend.flag.text'),
    },
    {
      title: 'Pool-X',
      getSubTitle: () => t('poolx.desc'),
      ga: 'ind2_nav_plx',
      subUrl: `?lang=${currentLang}`,
      prefix: 'POOLX_HOST',
      getFlag: () => t('nav.poolx.flag'),
      // getStress: () => t('nav.financing.mining'),
    },
    {
      getTitle: () => t('soft.staking'),
      getSubTitle: () => t('staking.desc'),
      ga: 'ind2_nav_stk',
      subUrl: `/staking/soft?lang=${currentLang}`,
      prefix: 'POOLX_HOST',
    },
    {
      getTitle: () => t('kucoin.bonus'),
      getSubTitle: () => t('ksc.desc'),
      ga: 'ind2_nav_bonus',
      subUrl: `/assets/bonus/encouragement?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
    },
    // {
    //   getTitle: () => t('nav.kucoin.partner'),
    //   getSubTitle: () => t('nav.kucoin.partner.desc'),
    //   ga: 'ind2_nav_partner',
    //   subUrl: `/partner?lang=${currentLang}`,
    //   prefix: 'LANDING_HOST',
    //   stress: 'NEW',
    // },
  ];

  if (currentLang.indexOf('zh_') !== 0) {
    items.push({
      getTitle: () => t('nav.drop.invitation'),
      getSubTitle: () => t('invitate.desc'),
      ga: 'ind2_nav_invt',
      subUrl: `/assets/bonus/referral?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
    });
  }

  if (isSub) {
    // 子账号只保留杠杆借出
    items = [
      {
        getTitle: () => t('margin.lend.out'),
        getSubTitle: () => t('margin.desc'),
        ga: 'ind2_nav_ledi',
        subUrl: `/margin/lend?lang=${currentLang}`,
        prefix: 'KUCOIN_HOST',
        getFlag: () => t('nav.marginLend.flag.text'),
      },
    ];
  }

  return {
    key: DEFAULT_MENU_KEY.FINANCING,
    getTitle: () => t('nav.financing'),
    // stress: () => t('nav.financing.mining'),
    items,
  };
};

export const KuchainItems = (currentLang, t) => {
  return {
    key: DEFAULT_MENU_KEY.KUCHAIN,
    getTitle: () => t('nav.kuchain'),
    items: [
      {
        getTitle: () => t('nav.kuchain.sub.kratos'),
        getSubTitle: () => t('nav.kuchain.sub.kratos.desc'),
        ga: 'ind2_nav_kratos',
        url: `https://kratos.network/?lang=${currentLang}`,
        flag: 'Hot',
      },
      {
        getTitle: () => t('nav.kuchain.sub.kuchain'),
        getSubTitle: () => t('nav.kuchain.sub.desc'),
        ga: 'ind2_nav_kuchain',
        url: `https://kuchain.network/?lang=${currentLang}`,
      },
      // 下线生态
      // {
      //   getTitle: () => t('nav.kuchain.sub.ecology'),
      //   getSubTitle: () => t('nav.kuchain.sub.ecology.desc'),
      //   ga: 'ind2_nav_ecology',
      //   url: `http://kcs.kucoin.com/?lang=${currentLang}`,
      // },
    ],
  };
};

// 查看更多下拉菜单配置
export const ViewMoreItems = (currentLang, t) => {
  const isCn = currentLang.indexOf('zh_') === 0;
  const items = [
    // 下线库币云
    // KuCloud 企业站首页跳转
    // {
    //   getTitle: () => t('kucloud'),
    //   getSubTitle: () => t('kucloud.desc'),
    //   ga: 'ind2_nav_kucloud',
    //   url: `http://www.kucloud.me/?lang=${currentLang}`,
    // },
    {
      getTitle: () => t('promotions'),
      getSubTitle: () => t('promotions.desc'),
      ga: 'ind2_nav_activ',
      subUrl: `/news/categories/promotion?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
    },
    {
      getTitle: () => t('menu.news'),
      getSubTitle: () => t('menu.news.desc'),
      ga: 'ind2_nav_news',
      subUrl: `/news?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
    },
    {
      getTitle: () => t('menu.support'),
      getSubTitle: () => t('menu.support.desc'),
      ga: 'ind2_nav_help',
      url: `https://kucoin.zendesk.com/hc/${isCn ? 'zh-cn' : 'en-us'}`,
    },
  ];
  if (!isCn) {
    const enItems = [
      // {
      //   getTitle: () => t('nav.drop.kcs'),
      //   getSubTitle: () => t('nav.drop.kcs.desc'),
      //   ga: 'ind2_nav_kcs',
      //   url: `http://kcs.kucoin.com/?lang=${currentLang}`,
      // },
      {
        getTitle: () => t('spot.light'),
        getSubTitle: () => t('spotlight.desc'),
        ga: 'ind2_nav_sptl',
        subUrl: `/spotlight-center?lang=${currentLang}`,
        prefix: 'KUCOIN_HOST',
        stress: 'HOT',
      },
      // {
      //   title: 'Arwen',
      //   getSubTitle: () => t('arwen.desc'),
      //   ga: 'ind2_nav_arwen',
      //   subUrl: `/page/arwen?lang=${currentLang}`,
      //   prefix: 'KUCOIN_HOST',
      // },
    ];
    items.splice(0, 0, ...enItems);
  }

  return {
    key: DEFAULT_MENU_KEY.MORE,
    getTitle: () => t('more'),
    items,
  };
};

export const TradeItems = (currentLang, t) => {
  const items = [
    {
      icon: trade,
      getTitle: () => t('newHeader.menu.exchange'),
      getSubTitle: () => t('menu.exchange.desc'),
      ga: 'ind2_nav_trad',
      subUrl: `/spot/BTC-USDT?lang=${currentLang}`,
      prefix: 'TRADE_HOST',
    },
    {
      icon: lightning_trade,
      getTitle: () => t('menu.lightning'),
      getSubTitle: () => t('menu.lightning.desc'),
      ga: 'ind_nav_lightning',
      subUrl: `/lightning-exchange?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
      getFlag: () => t('menu.lightning.mark'),
      isMore: true,
    },
    {
      icon: margin_trade,
      getTitle: () => t('menu.margin'),
      getSubTitle: () => t('menu.margin.desc'),
      ga: 'ind2_nav_marg',
      subUrl: `/margin/BTC-USDT?lang=${currentLang}`,
      prefix: 'TRADE_HOST',
      getFlag: currentLang.indexOf('zh_') === 0 ? null : () => t('nav.drop.times'),
    },
    {
      icon: api_icon,
      getTitle: () => t('menu.api'),
      getSubTitle: () => t('menu.api.desc'),
      ga: 'ind2_nav_api',
      subUrl: `/api?lang=${currentLang}`,
      prefix: 'KUCOIN_HOST',
    },
  ];
  return {
    key: DEFAULT_MENU_KEY.TRADE,
    getTitle: () => t('trade'),
    items,
  };
};

export const KumexItems = (currentLang, t) => {
  const items = [
    {
      icon: KumexLite,
      getTitle: () => t('nav.contract.lite'),
      getSubTitle: () => t('nav.contract.lite.desc'),
      ga: 'ind2_nav_kumexlite',
      subUrl: `?lang=${currentLang}`,
      prefix: 'KUMEX_BASIC_HOST',
    },
    {
      icon: KumexPro,
      getTitle: () => t('nav.contract.pro'),
      getSubTitle: () => t('nav.contract.pro.desc'),
      ga: 'ind2_nav_kumexpro',
      subUrl: `/trade?lang=${currentLang}`,
      prefix: 'KUMEX_HOST',
    },
    {
      icon: reward,
      getTitle: () => t('menu.battle.title'),
      getSubTitle: () => t('menu.battle.desc'),
      ga: 'landingpageentrance_kucoin_navigationbar_click',
      subUrl: `/brawl/XBTUSDTM?lang=${currentLang}`,
      prefix: 'KUMEX_BASIC_HOST',
    },
    // {
    //   icon: header_1212,
    //   getTitle: () => t('menu.double12.title'),
    //   getSubTitle: () => t('menu.double12.desc'),
    //   ga: 'web_12_kucoin_navigationbar_click',
    //   subUrl: `/super-week?lang=${currentLang}&utm_source=KuCoinKM&utm_medium=header&utm_campaign=To1212`,
    //   prefix: 'LANDING_HOST',
    // },
  ];
  return {
    key: DEFAULT_MENU_KEY.KUMEX,
    getTitle: () => t('news.kumex'),
    // stress: () => `${t('menu.battle.mark')}`,
    items,
  };
};

// 帮助中心语言参数做特殊映射
export const getHelpLang = {
  de_DE: 'de',
  en_US: 'en-us',
  es_ES: 'es',
  fr_FR: 'fr',
  hi_IN: 'hi',
  id_ID: 'id-id',
  it_IT: 'it',
  ja_JP: 'ja',
  ko_KR: 'ko-kr',
  ms_MY: 'en-us',
  nl_NL: 'nl',
  pt_PT: 'pt',
  ru_RU: 'ru',
  th_TH: 'en-us',
  tr_TR: 'tr',
  vi_VN: 'vi',
  zh_CN: 'zh-cn',
  zh_HK: 'zh-cn',
  bn_BD: 'bn',
  pl_PL: 'en-us',
  fil_PH: 'en-us',
};

// 新人专区入口
export const NEWBIE_ZONE_ENTRY = 'newbiezone';
export const complianceSPM = 'compliance.header.marketingHeader.1';
// ip 是英国，删除福利中心和邀请有礼链接
export const HEADER_REFERRAL_KUREWARDS_SPM = 'compliance.header.referralAndKuRewards.1';
// ip 是土耳其，展示土耳其入口
export const HEADER_TURKEY_ENTRY_SPM = 'compliance.header.turkeyEntry.1';
// ip 是土耳其、英国，隐藏福利中心入口
export const HEADER_KUREWARDS_SPM = 'compliance.header.kurewards.1';

// 福利中心入口
export const REWARDS_HUBS_ENTRY = 'KuRewards';
export const genRewardsHubItem = (t, host, theme) => {
  return {
    id: REWARDS_HUBS_ENTRY,
    name: t('vDvWFPENu1ofVwJrsY6FMk'),
    uri: addLangToPath(`${host}/KuRewards`),
    buttonName: 'KuRewards',
    // 在小比例下以icon形态展示
    showTooltip: children => (
      <Tooltip placement="bottom" className={styles.rewardsTooltip} title={t('f60b73fc915d4800ad14')}>
        {children}
      </Tooltip>
    ),
    simpleIcon:
      theme === 'dark' ? (
        <picture>
          <source srcSet={rewards_dark} type="image/webp" />
          <img src={rewards_dark_svg} alt="rewards" className={styles.rewards} />
        </picture>
      ) : (
        <picture>
          <source srcSet={rewards_light} type="image/webp" />
          <img src={rewards_light_svg} alt="rewards" className={styles.rewards} />
        </picture>
      ),
    onClick: () => {
      kcsensorsClick(['B2frontpage', '13'], { ButtonName: 'KuRewards' });
    },
    complianceSPM,
  };
};

export const genRewardsHubItemV2 = (t, host, theme): FirstLevelNavigation => {
  return {
    navigationDetail: {
      id: REWARDS_HUBS_ENTRY,
      level: 1,
      textMap: {
        name: t('vDvWFPENu1ofVwJrsY6FMk'),
      },
      uri: addLangToPath(`${host}/KuRewards`),
      // buttonName: 'KuRewards',
      // 在小比例下以icon形态展示
      showTooltip: children => (
        <Tooltip placement="bottom" className={styles.rewardsTooltip} title={t('f60b73fc915d4800ad14')}>
          {children}
        </Tooltip>
      ),
      simpleIcon:
        theme === 'dark' ? (
          <img src={rewards_dark} alt="rewards" className={styles.rewards} />
        ) : (
          <img src={rewards_light} alt="rewards" className={styles.rewards} />
        ),
      onClick: () => {
        kcsensorsClick(['B2frontpage', '13'], { ButtonName: 'KuRewards' });
      },
      complianceSPM,
    },
  };
};

/**
 * 合伙人入口
 */
export const AFFILIATE_HUBS_ENTRY = 'KuAffiliate';
const newAffPath = `/affiliate-system/overview`;
export const genAffiliateHubItem = (t, host) => ({
  id: AFFILIATE_HUBS_ENTRY,
  name: t('jbhR9Z1WXwVEptqnCj5hmQ'),
  uri: addLangToPath(`${host}${newAffPath}`),
  buttonName: 'KuAffiliate',
  // 在小比例下以icon形态展示
  simpleIcon: <img src={partner_header_entry} alt="" width={16} height={16} />,
  onClick: () => {
    kcsensorsClick(['BarAffiliate', '1'], { ButtonName: 'KuAffiliate' });
  },
  complianceSPM,
});

export const genAffiliateHubItemV2 = (t, host): FirstLevelNavigation => ({
  navigationDetail: {
    id: AFFILIATE_HUBS_ENTRY,
    level: 1,
    textMap: {
      name: t('jbhR9Z1WXwVEptqnCj5hmQ'),
    },

    uri: addLangToPath(`${host}${newAffPath}`),
    // buttonName: 'KuAffiliate',
    // 在小比例下以icon形态展示
    simpleIcon: <img src={partner_header_entry} alt="" width={16} height={16} />,
    onClick: () => {
      kcsensorsClick(['BarAffiliate', '1'], { ButtonName: 'KuAffiliate' });
    },
    complianceSPM,
  },
});

/**
 * 土耳其站入口
 */
export const TURKEY_HUBS_ENTRY = 'KuTurkey';

export const genTurkeyHubItem = () => {
  const siteConfig = getSiteConfig();
  const newTurkeyPath = `${siteConfig.TR_SITE_HOST ?? 'https://www.kucoin.tr'}/`;
  return {
    id: TURKEY_HUBS_ENTRY,
    name: (
      <span dir="ltr">
        {bootConfig._BRAND_NAME_}
        <span className={styles.tr}>TR</span>
      </span>
    ),
    uri: newTurkeyPath,
    // zhUri 为站点域名非.com时兜底链接
    zhUri: newTurkeyPath,
    buttonName: TURKEY_HUBS_ENTRY,
    onClick: () => {
      kcsensorsClick(['BarTurkey', '1'], { ButtonName: TURKEY_HUBS_ENTRY });
    },
    complianceSPM,
  };
};

export const genTurkeyHubItemV2 = (): FirstLevelNavigation => {
  const siteConfig = getSiteConfig();
  const newTurkeyPath = `${siteConfig.TR_SITE_HOST ?? 'https://www.kucoin.tr'}/`;
  return {
    navigationDetail: {
      id: TURKEY_HUBS_ENTRY,
      level: 1,
      textMap: {
        name: (
          <span dir="ltr">
            {bootConfig._BRAND_NAME_}
            <span className={styles.tr}>TR</span>
          </span>
        ),
      },
      uri: newTurkeyPath,
      // // zhUri 为站点域名非.com时兜底链接
      // zhUri: newTurkeyPath,
      // buttonName: TURKEY_HUBS_ENTRY,
      onClick: () => {
        kcsensorsClick(['BarTurkey', '1'], { ButtonName: TURKEY_HUBS_ENTRY });
      },
      complianceSPM,
    },
  };
};

// 菜单配置常量
export const MENU_CONFIG = {
  MAX_NAV_CONTAINER_WIDTH: 1200, // 容器最大的宽度
  // MIN_NAV_COLUMN_WIDTH: 300, // 每列最小宽度
  MAX_NAV_GROUP_ITEMS: 6, // 每列最多6个二级菜单
  MAX_COLUMNS: 4, // 最多4列
  MARKET_SEARCH_LIMIT: 1, // 每个一级菜单只保留第一个行情搜索模块
} as const;
