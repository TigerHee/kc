import Whistleblower from './components/Whistleblower';
// import SDK from './components/SDK';
import LogoImg from './static/logo.svg';
import { IS_PROD } from '../../../externals/utils/env';
import { tenantConfig } from './tenantConfig';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

export const LOGO_LINK = LogoImg;
// const siteConfig = window._WEB_RELATION_ || {};

export const guardianHiddenLangs = [
  'ru_RU',
  'pt_PT',
  'nl_NL',
  'de_DE',
  'fr_FR',
  'es_ES',
  'vi_VN',
  'tr_TR',
  'it_IT',
  'ms_MY',
  'id_ID',
  'hi_IN',
  'th_TH',
  'ar_AE',
  'bn_BD',
  'pl_PL',
  'fil_PH',
  'ur_PK',
];

export const KCglobalAmbassaVisibleLangs = [
  'ru_RU',
  'pt_PT',
  'nl_NL',
  'de_DE',
  'fr_FR',
  'es_ES',
  'vi_VN',
  'tr_TR',
  'it_IT',
  'ms_MY',
  'id_ID',
  'hi_IN',
  'th_TH',
  'ar_AE',
  'bn_BD',
  'pl_PL',
  'fil_PH',
  'ur_PK',
];

export const FOOTER_LINKS = ({ t }) => [
  {
    //  公司
    title: t('w3J5prt3N3mqf6PnLD7Sy2'),
    categoryKey: 'Company', // 一级分类（埋点使用）
    links: [
      // 关于我们
      { path: '/about-us', title: t('nq5czJoJjZghVBMbXJebnW') },
      // 加入我們
      { path: '/careers', title: t('97zexStmngwPy5sqCKMZE9') },
      // 博客
      {
        path: '/blog',
        title: t('kQJcNp74AZrCipYvvgCwSz'),
        isUKForbidden: true,
        hidden: !tenantConfig.showBlog,
      },
      {
        path: '/announcement',
        // 新聞與公告
        title: t('6QeK15y8c58XkPrVtxoRu5'),
        hidden: !tenantConfig.showAnnouncement,
      },
      // 媒體工具包
      {
        path: '/news/en-kucoin-media-kit',
        title: t('kEV6SMFTbKUXtdMF5nJBFq'),
        isUKForbidden: true,
        hidden: !tenantConfig.showMediaKit,
      },
      {
        path: '/adam-scott-ambassador',
        title: t('c8244a2210694000ad2e'),
        hidden: !tenantConfig.showAmbassador,
      },
      // KuCoin Labs
      {
        path: '/land/kucoinlabs',
        title: t('awLYFWz9yR992xZXK6e6hw'),
        isUKForbidden: true,
        hidden: !tenantConfig.showKucoinlabs,
      },
      // KuCoin Ventures
      {
        path: '/kucoin-ventures',
        title: t('7KUELV6LEovqKB8wivnD9P'),
        isUKForbidden: true,
        hidden: !tenantConfig.showVentures,
      },
      // 儲備證明 (PoR)
      {
        path: '/proof-of-reserves',
        title: t('kZsUg7gv3Fvwe7zrKHYcgj'),
        hidden: !tenantConfig.showPoR,
      },
      // 安全
      { path: '/land/security', title: t('5Degc1GAkjgRjCwKmvjNmZ') },
      // 使用條款
      {
        path: '/support/47185419968079',
        title: t('1fY5LbgC6BzipYyeEDAg4X'),
        hidden: !tenantConfig.showCompanyTerms,
      },
      // 隱私政策
      {
        path: '/support/47497300093764',
        title: t('cZhDMwbq1MGadJXVvCSBNr'),
        hidden: !tenantConfig.showCompanyPolicy,
      },
      // 風險披露聲明
      {
        path: '/support/47497300093765',
        title: t('1rkQwLhWXxPQ9H3FXiDPuw'),
        hidden: !tenantConfig.showRiskStatement,
      },
      {
        // AML & CFT
        path: '/support/47497300093766',
        title: t('h45xvsRH7TkH3xwpud1TTZ'),
        hidden: !tenantConfig.showAMLAndCFT,
      },
      // 執法請求指南
      {
        path: '/support/47497300093767',
        title: t('bhgZXPcaAD6rdta4Ku1Lxh'),
        hidden: !tenantConfig.showLawRequests,
      },
      {
        path: '',
        // 舉報通道
        title: t('bZMWZGPy2x9wj5DcBZrK8F'),
        hover: () => <Whistleblower key="_hover_Whistleblower_" />,
        hidden: !tenantConfig.showWhistleblower,
      },
      {
        path: '/support/categories/47134508281145',
        // 法律文件
        title: t('65194fced1244000acc3'),
        hidden: !tenantConfig.showCompanyLegal,
      },
      {
        path: '/legal/licences',
        // 法律文件
        title: t('7cded42622ad4000aa2a'),
        hidden: !tenantConfig.showLicenses,
      },
    ],
  },
  {
    // 產品
    title: t('fC5HTEHG1TDDV4XEJprVAU'),
    categoryKey: 'Product',
    links: [
      // 快捷买币 Fast Trade
      {
        path: '/express',
        title: t('5cecc144df7a4000a9c8'),
        hidden: !window._SITE_CONFIG_.functions.fast_trade,
      },
      // 閃兌
      {
        path: '/convert',
        title: t('rRy9gSPVNvPyKfRELzyisV'),
        hidden: !window._SITE_CONFIG_.functions.convert,
      },
      // KuCard
      {
        path: '/kucard',
        title: t('ed11460d3f404000a3d5'),
        hidden: !window._SITE_CONFIG_.functions.kucard,
      },
      // KuCoin Pay，不需要翻译。
      {
        path: '/pay',
        title: 'KuCoin Pay',
        // hidden: !tenantConfig.showKucoinPay,
        hidden: !window._SITE_CONFIG_.functions.kucoin_pay,
      },
      // 幣幣交易
      {
        path: '/trade',
        title: t('fCWmC8LaDTJGrVn7jXnZfS'),
        hidden: !window._SITE_CONFIG_.functions.spot,
      },
      // 合約交易
      {
        path: '/trade/futures',
        title: t('gjQ2yNC8XMHLsYxAhzVqcq'),
        hidden: !window._SITE_CONFIG_.functions.futures,
      },
      // 杠杆交易
      {
        path: '/trade/margin',
        title: t('tDXzFgZq9mzpuq29Ved9Pm'),
        hidden: !window._SITE_CONFIG_.functions.margin,
      },
      // ETF
      {
        path: '/leveraged-tokens',
        title: t('45a2aec83abd4000a0b7'),
        hidden: !window._SITE_CONFIG_.functions.etf,
      },
      // KuCoin 賺幣
      {
        path: '/earn',
        title: t('6fVt1h7VKhyG3P9pSFt1kz'),
        hidden: !window._SITE_CONFIG_.functions.financing,
      },
      // 借貸
      {
        path: '/margin/v2/lend',
        title: t('govVuuMQHJdpA2iu74WJE5'),
        hidden: !window._SITE_CONFIG_.functions.lend,
      },
      // 交易機器人
      {
        path: '/trade/strategy',
        title: t('reYejUEydTvkDjribM4zQB'),
        hidden: !window._SITE_CONFIG_.functions.trading_bot,
      },
      // 邀請好友
      {
        path: '/referral',
        title: t('6zYFBJmx4tGEnET27ZsNAT'),
        isUKForbidden: true,
        hidden: !window._SITE_CONFIG_.functions.invite_rebate,
      },
      // GemSpace
      {
        path: '/gemspace',
        title: t('2b4efc77f4da4000a6a9'),
        hidden: !tenantConfig.showGemSpace,
      },
      // KuCoin 學院
      { path: '/learn', title: t('mL6yKtWcHnLKQcPqRm31Hx') },
      // News 预留占位

      // 幣價換算器
      {
        path: '/converter',
        title: t('kBQmBqXa2APXVWZiRRqNBu'),
        hidden: tenantConfig.showConverter === false,
      },
      // Spotlight
      { path: '/spotlight-center', title: 'Spotlight', hidden: !tenantConfig.showSpotlight },
      // OTC Trading
      { path: '/block-trade', title: t('5d3094a5686e4800a6be') },
    ],
    isUKForbidden: true,
  },
  {
    // 服務
    title: t('r7DtYVS3vczXnZGyaYzAJ2'),
    categoryKey: 'Serve',
    links: [
      // 新手指南
      { path: '/support/categories/360001255374', title: t('ijd4b6W4CqcNCQPGNqzXcK') },
      // 幫助中心
      { path: '/support', title: t('pfSsgCiCNd697pBKKkGfHt') },
      // 提交工單
      {
        path: '/support/requests',
        title: t('1XGkx6H1YVkSP27mmdS8p8'),
        rel: 'nofollow',
      },
      // 提交客诉（eu/au要求）
      {
        path: tenantConfig.raiseComplaintPath,
        title: t('bd5d1e19d5f94000ad4e'),
        hidden: !tenantConfig.showRaiseCompliant,
      },
      {
        // 技術支持
        path:
          '/news/en-kucoin-launches-the-technical-support-channel-to-help-users-find-the-solution',
        title: t('3DPso8UYbEAPrY38pnoDCy'),
      },
      {
        // 漏洞賞金活動
        path: '/announcement/KuCoin-New-Bug-Bounty-Program-Announcement',
        title: t('jxgbaGWspPHKFygpFkJ4xD'),
      },
      // 工單(身份)驗證通道
      { path: '/forms/verify', title: t('aEXxrFqRCGoZsWzxkFCwJt') },
      // KuCoin 官方驗證中心
      { path: '/cert?lang=en_US', title: t('4nXLsUXUpHgN7ToU2SM5Vj') },
      // 費用及VIP
      { path: '/vip/privilege', title: t('i8j5HNa6mdd8xsdhxtpdCV') },
      {
        // 守護計畫
        path: '/land/guardian',
        title: t('uPMDip5LsfBZ5r8e1hhgdY'),
        hiddenLangs: guardianHiddenLangs,
      },
      // ST 規則
      { path: '/legal/special-treatment', title: t('sM3dUXuds8xDvru2uCKC6D') },
      // 下線項目
      {
        path: tenantConfig.delistingsPath,
        title: t('ro6i1JwPaAz5z6WjDPc5fs'),
        hidden: !tenantConfig.delistingsPath,
      },
      // 網站地圖
      {
        path: tenantConfig.siteMapPath,
        title: t('wvDutVAGgsYdoLrkcQPJ4C'),
        hidden: !tenantConfig.siteMapPath,
      },
    ],
  },
  {
    // 商務
    title: t('sBv4NN2Yt3MGbcbNMM35tC'),
    categoryKey: 'Business',
    links: [
      // license
      {
        path: tenantConfig.licensePath,
        title: t('23678262b6b74800aafa'),
        hidden: !tenantConfig.licensePath,
      },
      // 合夥人計劃
      { path: '/affiliate', title: t('gj5BtGFdcJ7f18nA5FjcQc'), isUKForbidden: true },
      // 经纪商
      { path: '/broker', title: t('cd20118a93f84000afc9') },
      // 机构
      { path: '/institution', title: t('594c637f62704000a840') },
      // API 服务
      { path: '/api', title: t('025ab5f21f5b4000a5d8') },
      {
        // 上幣申請
        path: '/listing',
        title: t('bYiZh5EVbjkycMtGmaneFB'),
      },
      // P2P 商戶申請
      {
        path: '/express/merchant',
        title: t('qRtqjeJRsR3jqA7tc6GYRZ'),
        hidden: !tenantConfig.showP2pMerchant,
      },
      {
        // KuCoin 全球大使計劃
        path: '/news/en-kucoin-global-ambassador-program',
        title: t('if5mv6gTEHNe7PzXb76tx9'),
        visibleLangs: KCglobalAmbassaVisibleLangs,
      },
      {
        path: tenantConfig.payMerchantPath,
        title: t('3bb8ccfcb6894800af7e'),
        hidden: !tenantConfig.payMerchantPath,
      },
    ],
  },
  {
    // 加密貨幣價格
    title: t('6AVPEzD6rFRjMUtJvwcYXJ'),
    categoryKey: 'TokenPrice',
    links: [
      // Bitcoin (BTC) 價格
      { path: '/price/BTC', title: t('pFZP6dWzEmFMDeRWKcDEWs') },
      // Ethereum (ETH) 價格
      { path: '/price/ETH', title: t('wZ3KWDgJUSQnhBPFr6wnJ8') },
      // Ripple (XRP) 價格
      { path: '/price/XRP', title: t('f4AXCZ8zEXwKfJXmK9qqdf') },
      // KuCoin Token (KCS) 價格
      { path: '/price/KCS', title: t('7Gjo1ZqCTc2oSYDsHNiKFA') },
      // 更多加密貨幣價格
      { path: '/price', title: t('ojkZKsxjo3KbnMRuXRTLrb') },
    ],
    isUKForbidden: true,
  },
  {
    // 學習
    title: t('tteTJQ4PJAfm7dVwwQY5xD'),
    categoryKey: 'Learn',
    links: [],
    dynamicDataId: 'kc_howTobuy',
    isUKForbidden: true,
    hidden: tenantConfig.showLearnHowToBuy === false,
  },
  {
    // 開發者
    title: t('qfQwJRY2GX8d66aTWY2kVS'),
    categoryKey: 'Developer',
    links: [
      {
        // API 文檔
        path: tenantConfig.apiDocsPath,
        title: t('raigWXzp4w8559ePvj48AD'),
      },
      {
        // SDK
        path: tenantConfig.sdkDocsPath,
        title: t('dD19jtYjENiz5oqVd8VYc6'),
      },
      {
        // 歷史數據下載
        path: '/markets/historydata',
        title: t('moa4DgYgbEK47a7T9Fg1nm'),
      },
    ],
    // 合并为同一列的导航列表（数据格式与一级分类一致）
    mergeNavList: null,
  },
  // {
  //   // 合作夥伴
  //   title: t('28c2179be1b94000a8ce'),
  //   categoryKey: 'Partner',
  //   links: [
  //     {
  //       // Halo 錢包
  //       path: 'https://halo.social/?utm_source=kucoin_web',
  //       title: t('5d050a23043b4000a26c'),
  //       rel: 'nofollow',
  //     },
  //   ],
  //   isUKForbidden: true,
  // },
  {
    // APP 下載
    title: t('w2xubVRedhbxN1PACaJQ7u'),
    categoryKey: 'AppDownload',
    links: [
      // Android 下載
      { path: '/download', title: t('3sfSXgJ9P7ULRqe9KFxywt') },
      // iOS 下載
      { path: '/download', title: t('rRA2wkUkKc41vbLyFMDHx3') },
    ],
    isUKForbidden: true,
  },
  {
    // 社群
    title: t('tDeS6rF9Fvw7EYbE3LQ6bX'),
    categoryKey: 'Community',
    association: true,
    links: [
      {
        path: 'https://x.com/KuCoinCom',
        title: 'X(Twitter)',
        img: 'https://assets.staticimg.com/cms/media/10Od6t5ammiCVnd52DCYyCtGArkgA80rBTysVPcxi.svg',
        imgProps: { alt: 'X(Twitter)', 'aria-label': 'X(Twitter)' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://t.me/Kucoin_Exchange',
        title: 'Telegram',
        img: 'https://assets.staticimg.com/cms/media/4qUnZHTHJ0Tbb2mjJyM9Qb4vYBkqeP6DYdDbZkQdx.svg',
        imgProps: { alt: 'Telegram', 'aria-label': 'Telegram' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://www.youtube.com/c/KuCoinExchange',
        title: 'youtube',
        img: 'https://assets.staticimg.com/cms/media/5IegGYISdX4Tlp4NQ0t2m3QqpQU5WERUkdFQ2UJpR.svg',
        imgProps: { alt: 'youtube', 'aria-label': 'youtube' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://discord.com/invite/kucoinofficialserver',
        title: 'discord',
        img: 'https://assets.staticimg.com/cms/media/8DPboei054vWXAK0eza6FzwR74dpbIiNasH0shcsj.svg',
        imgProps: { alt: 'discord', 'aria-label': 'discord' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://www.reddit.com/r/kucoin/',
        title: 'Reddit',
        img: 'https://assets.staticimg.com/cms/media/5Kh7qnUWP84dRb8uBkMP6xBrXqsIdLw8zQrMBLl6b.svg',
        imgProps: { alt: 'reddit', 'aria-label': 'reddit' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://www.linkedin.com/company/kucoin/',
        title: 'linkin',
        img: 'https://assets.staticimg.com/cms/media/62PGFqwGrRPu92xdy0XM6Vz5XjxNTILnXjGGxINcu.svg',
        imgProps: { alt: 'linkin', 'aria-label': 'linkin' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://www.instagram.com/kucoinexchange/',
        title: 'Instagram',
        img: 'https://assets.staticimg.com/cms/media/5GeiTSs0zapCEumOfTVLrHO0zV3pu4CcIl9lJ3NEm.svg',
        imgProps: { alt: 'Instagram', 'aria-label': 'ins' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://coinmarketcap.com/exchanges/kucoin/',
        title: 'coinmark',
        img: 'https://assets.staticimg.com/cms/media/7FrX3cTqcJIDYxenJCHZEtVoL3mBzbzMSvYNu1Apr.svg',
        imgProps: { alt: 'coinmark', 'aria-label': 'coinmark' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://www.coingecko.com/en/exchanges/kucoin',
        title: 'coin',
        img: 'https://assets.staticimg.com/cms/media/7gp38Hy1Y4sNmQhwEL2Befbfjr0Ed6aaZVk8mhKo8.svg',
        imgProps: { alt: 'coin', 'aria-label': 'coin' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
    ],
    isUKForbidden: true,
  },
  /* {
    // 條款
    title: t('4UagjShjQDLMxv4zGfvBRN'),
    categoryKey: 'Terms',
    links: [


    ],
  }, */
];

export const TR_FOOTER_LINKS = ({ t }) => [
  {
    //  Support
    title: t('24eaef0a352c4000abca'),
    categoryKey: 'Support', // 一级分类（埋点使用）
    links: [
      // 关于我们
      { path: '/privilege', title: t('b7c0253069964000a0e5') },
      // API 服务
      { path: '/docs/beginners/introduction', title: t('6627755dc6274000a0a9') },
      // 幫助中心
      { path: '/support', title: t('1c0a37ad33744000a299') },
      // 新聞與公告
      { path: '/announcement', title: t('c674637baf0d4000ade5') },
      // 工单身份认证-客服
      { path: '/forms/verify', title: t('aEXxrFqRCGoZsWzxkFCwJt') },
      // 提交工单-客服
      {
        path: '/support/requests',
        title: t('1XGkx6H1YVkSP27mmdS8p8'),
        rel: 'nofollow',
      },
      // 投诉建议
      {
        path: '/support/requests?ticket_form_id=89',
        title: t('7a39f5b96a5e4000a969'),
        rel: 'nofollow',
      },
      // 媒體工具包 TODO: 后期补充土耳其的 cert 路径
      // { path: 'https://www.kucoin.com/cert', title: t('69df221f59cc4000acbd') },
    ],
  },
  {
    // 加密貨幣價格
    title: t('6AVPEzD6rFRjMUtJvwcYXJ'),
    categoryKey: 'TokenPrice',
    links: [
      // Bitcoin (BTC) 價格
      { path: '/price/BTC', title: t('pFZP6dWzEmFMDeRWKcDEWs') },
      // Ethereum (ETH) 價格
      { path: '/price/ETH', title: t('wZ3KWDgJUSQnhBPFr6wnJ8') },
      // Ripple (XRP) 價格
      { path: '/price/XRP', title: t('f4AXCZ8zEXwKfJXmK9qqdf') },
      // KuCoin Token (KCS) 價格
      { path: '/price/KCS', title: t('7Gjo1ZqCTc2oSYDsHNiKFA', { brandName: 'KuCoin' }) },
      // 更多加密貨幣價格
      { path: '/price', title: t('ojkZKsxjo3KbnMRuXRTLrb') },
    ],
  },
  {
    // 交易
    title: t('trade'),
    categoryKey: 'Trade',
    links: [
      { path: '/trade/BTC-USDT', title: t('56c885kctfxDcKff9N66kG', { name: 'BTC' }) },
      { path: '/trade/ETH-USDT', title: t('56c885kctfxDcKff9N66kG', { name: 'ETH' }) },
      { path: '/trade/XRP-USDT', title: t('56c885kctfxDcKff9N66kG', { name: 'XRP' }) },
      { path: '/trade/LTC-USDT', title: t('56c885kctfxDcKff9N66kG', { name: 'LTC' }) },
      { path: '/trade/SOL-USDT', title: t('56c885kctfxDcKff9N66kG', { name: 'SOL' }) },
    ],
  },
  {
    // 產品
    title: t('fC5HTEHG1TDDV4XEJprVAU'),
    categoryKey: 'TRProduct',
    links: [
      { path: '/blog', title: t('kQJcNp74AZrCipYvvgCwSz') },
      { path: '/news', title: t('news') },
      { path: '/download', title: t('w2xubVRedhbxN1PACaJQ7u') },
    ],
  },
  {
    // Legal Information
    title: t('c569f3649ad14000a053'),
    categoryKey: 'Legal',
    links: [
      //
      {
        path: '/support/9704731146383',
        title: t('426dd4da41534000a9ca'),
      },
      //
      {
        path: '/support/10725249567119',
        title: t('37f2e066ddb54800a368'),
      },
      //
      {
        path: '/support/10726804125839',
        title: t('18385ab58ec04000a458'),
      },
      //
      {
        path: '/support/10779360444559',
        title: t('ca12a80e7c434000a1dc'),
      },
    ],
  },
  {
    // Company info
    title: t('6a35515ff7fb4000a2e4'),
    categoryKey: 'Company',
    links: [
      {
        title: t('ee4573ddc6ba4000ab0d'),
        isStaticText: true,
      },
      {
        title: t('37e46321d60a4000ac9b'),
        isStaticText: true,
      },
      {
        title: t('5b77801ab0454000aaf6'),
        isStaticText: true,
      },
      { title: 'Email:destek@kucoin.tr', isStaticText: true },
    ],
  },
  {
    // 社群
    title: t('tDeS6rF9Fvw7EYbE3LQ6bX'),
    categoryKey: 'Community',
    association: true,
    links: [
      {
        path: 'https://x.com/KuCoinTurkey',
        title: 'X(Twitter)',
        img: 'https://assets.staticimg.com/cms/media/10Od6t5ammiCVnd52DCYyCtGArkgA80rBTysVPcxi.svg',
        imgProps: { alt: 'X(Twitter)', 'aria-label': 'X(Twitter)' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://t.me/kucointurkiye',
        title: 'Telegram',
        img: 'https://assets.staticimg.com/cms/media/4qUnZHTHJ0Tbb2mjJyM9Qb4vYBkqeP6DYdDbZkQdx.svg',
        imgProps: { alt: 'Telegram', 'aria-label': 'Telegram' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
    ],
  },
];

export const TH_FOOTER_LINKS = ({ t, currentLang, isH5 }) => {
  const baseList = [
    {
      //  公司
      title: t('w3J5prt3N3mqf6PnLD7Sy2'),
      categoryKey: 'Company', // 一级分类（埋点使用）
      customCls: 'newFooterLinkMarginBottom48',
      links: [
        // 关于我们
        { path: '/about-us', title: t('nq5czJoJjZghVBMbXJebnW') },
        {
          path: '/announcement',
          // 新聞與公告
          title: t('6QeK15y8c58XkPrVtxoRu5'),
        },
        // 博客
        { path: '/blog', title: t('kQJcNp74AZrCipYvvgCwSz') },
        {
          path: '/support/12208340300687',
          title: t('bf6e7e1cad2e4000a378'),
        },
        // 安全
        { path: '/security', title: t('5Degc1GAkjgRjCwKmvjNmZ') },
        {
          path: '/support/12208024212623',
          title: t('51231b0b4ca34000a4e2'),
        },
        // 使用條款
        { path: '/support/10520403360271', title: t('ecd90fd1cc9a4000a87f') },
        // 隱私政策
        { path: '/support/10520423046159', title: t('cZhDMwbq1MGadJXVvCSBNr') },
      ],
    },
    {
      // 產品
      title: t('fC5HTEHG1TDDV4XEJprVAU'),
      categoryKey: 'Product',
      customCls: 'newFooterLinkMarginBottom48',
      links: [
        // 閃兌 Convert(泰国站屏蔽闪兑)
        // { path: '/convert', title: t('rRy9gSPVNvPyKfRELzyisV') },
        // 幣幣交易 Spot Trading
        {
          path: '/trade',
          title: t('fCWmC8LaDTJGrVn7jXnZfS'),
          hidden: !window._SITE_CONFIG_.functions.spot,
        },
        {
          path: '/assets/fiat-currency/recharge',
          title: t('19795e5684434000ad87'),
        },
        {
          path: '/account/vouchers',
          title: t('68137bccded44800a2ca'),
        },
        {
          path: '/research',
          title: t('34b04a081ee34800aea1'),
        },
      ],
    },
    {
      // 服務
      title: t('r7DtYVS3vczXnZGyaYzAJ2'),
      categoryKey: 'Serve',
      customCls: 'newFooterLinkMarginBottom48',
      links: [
        // 新手指南
        { path: '/support/10284942877327', title: t('ijd4b6W4CqcNCQPGNqzXcK') },
        // 幫助中心
        { path: '/support', title: t('pfSsgCiCNd697pBKKkGfHt') },
        // 工单身份认证-客服
        { path: '/forms/verify', title: t('aEXxrFqRCGoZsWzxkFCwJt') },
        // 提交工单-客服
        {
          path: IS_PROD
            ? 'https://kucoin-th.zendesk.com/hc/requests/new'
            : 'https://kucoin1659412122.zendesk.com/hc/en-us/requests/new',
          title: t('1XGkx6H1YVkSP27mmdS8p8'),
          rel: 'nofollow',
        },
        // KuCoin 官方驗證中心 KC_SITE_HOST
        // {
        //   path: `${siteConfig.KC_SITE_HOST ?? ''}/cert?lang=en_US`,
        //   title: t('4nXLsUXUpHgN7ToU2SM5Vj'),
        // },
        // Fees
        { path: '/privilege', title: t('b7c0253069964000a0e5') },
      ],
    },
    {
      // 加密貨幣價格
      title: t('6AVPEzD6rFRjMUtJvwcYXJ'),
      categoryKey: 'TokenPrice',
      customCls: 'newFooterLinkMarginBottom48',
      links: [
        // Bitcoin (BTC) 價格
        { path: '/price/BTC', title: t('pFZP6dWzEmFMDeRWKcDEWs') },
        // Ethereum (ETH) 價格
        { path: '/price/ETH', title: t('wZ3KWDgJUSQnhBPFr6wnJ8') },
        // TRX 價格
        { path: '/price/TRX', title: t('4bf347bbf7214800a0eb') },
        // KuCoin Token (KCS) 價格
        { path: '/price/WLD', title: t('c286049213634000a310') },
        // 更多加密貨幣價格
        { path: '/price', title: t('5968de6efbad4000a47d') },
      ],
    },
    {
      // 交易
      title: t('trade'),
      customCls: 'newFooterLinkMarginBottom48',
      categoryKey: 'Trade',
      links: [
        { path: '/trade/USDT-THB', title: t('56c885kctfxDcKff9N66kG', { name: 'USDT' }) },
        { path: '/trade/USDC-THB', title: t('56c885kctfxDcKff9N66kG', { name: 'USDC' }) },
        { path: '/trade/BTC-THB', title: t('56c885kctfxDcKff9N66kG', { name: 'BTC' }) },
        { path: '/trade/ETH-THB', title: t('56c885kctfxDcKff9N66kG', { name: 'ETH' }) },
        { path: '/trade/TRX-THB', title: t('56c885kctfxDcKff9N66kG', { name: 'TRX' }) },
        { path: '/trade/WLD-THB', title: t('56c885kctfxDcKff9N66kG', { name: 'WLD' }) },
        { path: '/markets', title: t('27c32c01e6be4800a19f') },
      ],
    },
    {
      // 政策
      title: t('d309c479c9ed4800ae68'),
      customCls: 'newFooterLinkMarginBottom48',
      categoryKey: 'Policies',
      links: [
        {
          // Quality of Service Report
          path:
            currentLang === 'en_US'
              ? 'https://kucoin-th.zendesk.com/hc/en-us/articles/12208291506703'
              : 'https://kucoin-th.zendesk.com/hc/th/articles/12208291506703',
          title: t('ae21c0eb36b44000a67e'),
        },
        {
          // Improper Trading Practices
          path:
            currentLang === 'en_US'
              ? 'https://kucoin-th.zendesk.com/hc/en-us/articles/12200255854607'
              : 'https://kucoin-th.zendesk.com/hc/th/articles/12200255854607',
          title: t('1e5bf75fe8874800ab2b'),
        },
        {
          // trading policy
          path:
            currentLang === 'en_US'
              ? 'https://kucoin-th.zendesk.com/hc/en-us/articles/12208305976719'
              : 'https://kucoin-th.zendesk.com/hc/th/articles/12208305976719',
          title: t('b092573465854800a10d'),
        },
        {
          // listing policy
          path:
            currentLang === 'en_US'
              ? 'https://kucoin-th.zendesk.com/hc/en-us/articles/12208438388751'
              : 'https://kucoin-th.zendesk.com/hc/th/articles/12208438388751',
          title: t('51573700a9fc4000a0b2'),
        },
        {
          // Coin information
          path:
            currentLang === 'en_US'
              ? 'https://kucoin-th.zendesk.com/hc/en-us/articles/12208137923343'
              : 'https://kucoin-th.zendesk.com/hc/th/articles/12208137923343',
          title: t('bedede12e3c34000a486'),
        },
      ],
    },
  ];

  const socialMod = {
    // 社群
    title: t('c47820c22d584800a8ad'),
    categoryKey: 'Community',
    customCls: 'newFooterLinkMarginBottom48',
    association: true,
    links: [
      {
        path: 'http://facebook.com/KuCoinThailand',
        title: 'Facebook',
        img: 'https://assets.staticimg.com/cms/media/9hPCPymGXw2zpBwv3HKLKKZs07PwzidCXpDkPTKHQ.png',
        imgProps: { alt: 'Facebook', 'aria-label': 'Facebook' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://page.line.me/345qxpkp?openQrModal=true',
        title: 'Line',
        img: 'https://assets.staticimg.com/cms/media/CGc9tQSLDn2IspPAJxmiJXoRCiPoLtQWaGD8xSpwl.png',
        imgProps: { alt: 'Line', 'aria-label': 'Line' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://t.me/KuCoinTH_Official',
        title: 'Telegram',
        img: 'https://assets.staticimg.com/cms/media/4qUnZHTHJ0Tbb2mjJyM9Qb4vYBkqeP6DYdDbZkQdx.svg',
        imgProps: { alt: 'Telegram', 'aria-label': 'Telegram' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
      {
        path: 'https://x.com/KuCoinThailand',
        title: 'X(Twitter)',
        img: 'https://assets.staticimg.com/cms/media/10Od6t5ammiCVnd52DCYyCtGArkgA80rBTysVPcxi.svg',
        imgProps: { alt: 'X(Twitter)', 'aria-label': 'X(Twitter)' },
        rel: 'nofollow',
        className: 'newFooterAssociationItem newFooterHover',
      },
    ],
  };

  const devMod = {
    // 開發者
    title: t('qfQwJRY2GX8d66aTWY2kVS'),
    categoryKey: 'Developer',
    customCls: 'newFooterLinkMarginBottom48',
    links: [
      {
        // API 文檔
        path: `/docs/beginners/introduction`,
        title: t('raigWXzp4w8559ePvj48AD'),
      },
    ],
    // 合并为同一列的导航列表（数据格式与一级分类一致）
    mergeNavList: null,
  };

  const appDownloadMod = {
    // APP 下載
    title: t('w2xubVRedhbxN1PACaJQ7u'),
    categoryKey: 'AppDownload',
    customCls: 'newFooterLinkMarginBottom48',
    links: [
      // Android 下載
      { path: '/download', title: t('3sfSXgJ9P7ULRqe9KFxywt') },
      // iOS 下載
      { path: '/download', title: t('rRA2wkUkKc41vbLyFMDHx3') },
    ],
  };

  const corpInfoMod = {
    // Company Information
    title: t('c046d1e75edd4000a3c7'),
    customCls: 'newFooterLinkMarginBottom48',
    categoryKey: 'CompanyInfo',
    links: [
      {
        title: t('59d194d849f74000ac5b'),
        isStaticText: true,
      },
      {
        title: t('acb96c2d6f554800aa74'),
        isStaticText: true,
      },
      {
        title: t('8b36f8da94154000a7b7'),
        isStaticText: true,
      },
      {
        title: t('f61866e7b05e4800a364'),
        isStaticText: true,
      },
      {
        title: t('923b78bc993a4800a990'),
        isStaticText: true,
      },
      {
        title: (
          <span style={{ fontWeight: 500, lineHeight: '160%', margin: '8px 0' }}>
            {`${t('447d22f5ce774800acfa')}:`}
          </span>
        ),
        isStaticText: true,
      },
      {
        title: `310180130003`,
        isStaticText: true,
      },
      {
        title: `310280090003`,
        isStaticText: true,
      },
    ],
  };

  const pcRestList = [socialMod, devMod, appDownloadMod, corpInfoMod];

  const h5RestList = [devMod, appDownloadMod, corpInfoMod, socialMod];

  return [...baseList, ...(isH5 ? h5RestList : pcRestList)];
};
