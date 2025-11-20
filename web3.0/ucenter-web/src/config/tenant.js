/**
 * Owner: tiger@kupotech.com
 * 前端多租户配置
 * 使用：import { tenantConfig } from 'config/tenant';
 */
import merge from 'lodash/merge';
import { globallBillExportOptions, normalBillExportOptions } from 'src/constants/download';
import { addLangToPath } from 'src/tools/i18n';
import siteConfig from 'utils/siteConfig';

// 多租户默认配置 - 按页面分类
const defaultConfig = {
  siteRoute: 'KC_ROUTE',
  common: {
    useCLHeader: false, // 是否使用 claim 站点 header
    useCLLogin: false, // 是否使用 claim 站点 login
    showFooter: true,
    showSiteRedirectDialog: false, // 展示站点切换弹窗，共享站需要
    showCurrency: true, // 是否请求币服接口
    // app 客服机器人路径
    appBotPath: '/support/app/help',
  },
  signup: {
    isShowMktContent: true, // 是否提供 LottieProvider
    isBtnUseDefaultText: false, // 注册按钮是否用素文案
  },
  signin: {
    sloganTitle: (_t) => _t('new_version_guide_title_one'),
    sloganSubTitle: (_t) => _t('jFfRryspo7BhZ3nEzEWw97'),
    g2faCanNotUseJumpSelfService: false, // g2fa 不可用入口，是否有可能跳转到帮助中心的重置 2fa 页面
  },
  resetG2fa: {
    referenceUrl: '/support/31708226270873', // 文档链接
    tipsMsg: (_t) => _t('f356a25eb1674000a721'), // 重置 G2FA 绑定，提示文案
    content: (_t) => _t('d66711fd8bb24000a83e'), // 重置 G2FA, 确认弹窗内容
  },
  resetPhone: {
    countryCodeInitialValue: null, // 手机区号默认值
    isCountryCodeInit: false, // 手机区号是否初始化
    queryUserAreaForUpdateCountryCode: true, // 请求用户地区更新区号
    disabledCountrySelect: false, // 禁止区号选择
  },
  resetPwd: {
    alertMsg: (_t) => `1.${_t('f6eeae5330e94000ab1a')}`, // 重置交易密码提示文案
  },
  kyc: {
    namespace: 'kyc',
    isShowExitModal: true, // 是否展示挽留弹窗
    isShowKuCardBanner: true, // 是否请求 KuCard 引流相关接口并展示banner
    tgUrl: 'https://t.me/KucoinVerifyservice', // 电报群链接
    isShowAppScanQRCode: true, // 是否显示使用APP 扫码做流程的二维码
    KYCHomeComponent: 'KCKycHome', // KYC 主页组件
    KYBHomeComponent: 'KCKybHome', // KYB 主页组件
    isShowImAccount: true, // KYB 提交第二步是否需要 imAccount
    isOnlyKYB: false, // 是否只有KYB
    upgrade: true, // 新 KYC/KYB 流程，新站点默认走新的
    showKycRewardInfo: true, // 展示 kyc 福利信息
    isPriorityDealCacheCountry: false, // 首页判断进 KYC or KYB 是否优先读取国家缓存数据
    siteRegion: 'global', // 站点所属区域，用于渲染相应的合规站页面
    onlySupportCurrentRegion: false, // 仅支持当前区域，开启后 kyc 选其他站点会提示居住地更新
    appOneLink: '', // 集成下载和打开 app 的链接
  },
  account: {
    showUnbindEmail: false, // 是否展示解绑邮箱
    showUnbindPhone: false, // 是否展示解绑手机
    supportHideMarketByCompliant: false, // 是否支持通过展业隐藏概览中的行情模块
    marketActiveTab: 'favorites', // 个人概览 行情模块默认展示 tab
    showAssetDetail: false, // 个人概览资产详情入口是否打开
    securityVerifyTip: (_t) => _t('4d81852b72334000af51'), // 安全验证确认弹窗提示文案
    topTip: (_t) => _t('d02a34bd601c4000a8af'), // 修改邮箱、手机号、交易密码 顶部提示文案
    featureTradeUrl: '/trade/futures', // 合约交易链接，主站是专业版链接地址，其他站点都是交易大厅版本链接地址
    showGetStartDesc: true, // 隐藏新人奖励描述文案
    balanceOptions: () => [
      // 个人概览 资产单位
      { value: window._BASE_CURRENCY_, label: window._BASE_CURRENCY_ },
      { value: 'BTC', label: 'BTC' },
      { value: 'KCS', label: 'KCS' },
    ],
    subAccountShowUnified: false, // 子账号是否展示统一账户权限, 只有主站开启
  },
  freeze: {
    remindTitle: (_t) => _t('freeze.account.tip.1'), // 冻结账号提示标题
    remindTips: (_t) => _t('4oWWUJYdzyFJPBAPPu8VNL'), // 冻结账号提示内容
    subUserDesc: (_t) => _t('p2aFqifPuSrfNno7iWPjwT'), // 子账号冻结提示内容
    repaidDesc: (_t) => _t('2NeLNQc6DVRgkAuDmCJ1Zv'), // 账号冻结 平仓提示
  },
  api: {
    docsUrl: addLangToPath('/docs/beginners/introduction'),
    alertDesc: (_t) => _t('kRuyrgCDd75v4dBWvE47NK'), // API Key 提示文案
    isLeadTraderAccount: false, // 是否有带单权限
    bindThirdBroker: true, // 创建 API，是否支持绑定第三方应用
    noFutures: false, // 该配置是因为泰国站还没上线期货交易，为了展示无期货交易的文案设置的
    apiAuthMap: (_t) => {
      // 创建 API 权限
      return {
        API_COMMON: {
          name: _t('vGeoG6ES46EgfbizBCpK3C'),
          desc: _t('api.auth.common.intro'),
        },
        API_SPOT: {
          name: _t('qRMb6gjBoXKuUVxHim36DH'),
          desc: _t('pKdqLp4kR1F2Cm8Mq7wu8U'),
        },
        API_MARGIN: {
          name: _t('qMTZzCnx4j1piJvG25RDaD'),
          desc: _t('rxthXoDhUnUeQXfAtrWHtL'),
        },
        // 理财权限
        API_EARN: {
          name: _t('9b9a216191574000a54d'),
          desc: _t('5f8c13c328654000a806'),
          subAccountDisableLabel: _t('40b31590595b4000aa53'),
        },
        API_FUTURES: {
          name: _t('vD4iaWF9Efu86FmGYegrTr'),
          desc: _t('6fcxviY7Sw9RhwTtcHWd2t'),
        },
        API_WITHDRAW: {
          name: _t('api.withDraw'),
          desc: _t('api.auth.withdraw'),
        },
        // 万象划转
        API_TRANSFER: {
          name: _t('whfNqevXojjNkgtU4FMkw4'),
          desc: _t('gpYdsM8J4hi7JPy7EFYWLB'),
        },
        // 合约带单交易
        API_LEADTRADE_FUTURES: {
          name: _t('29b97ffb5b334000a16c'),
          desc: _t('1afae1da06b24000a59b'),
        },
      };
    },
  },
  download: {
    showFixedType: false, // 下载中心 账单类型是否固定写死
    generateStatus: (_t) => _t('generating'), // 账单导出处理中状态 文案
    showCoinType: true, // 税单导出是否显示币种
    showNormalDrawer: true, // 是否展示普通下载中心导出按钮
    showTaxInvoiceDrawer: false, // 是否展示税票导出按钮，功能和泰国站税票导出一样
    taxInvoiceExportTimeLimit: 15, // 税票导出时间范围，默认是不超过 15 天
    normalDrawAlertInfo: (_t) => [
      // 普通下载中心导出抽屉提示文案
      _t('hAA2mfeyfPAZHeh5Gxe5pR'),
      _t('vgjnQXJLMGgAKNoP7jTAQd'),
      _t('6K83T83Zdcd9Mh6gQV9UtL', { num: 20 }),
      _t('4JMdqJBv1sZvXDg3xV9AR3'),
      _t('tqaYpJxjbGFotQGSN9CbQ9'),
    ],
    taxInvoiceDrawAlertInfo: (_t, _tHTML, b) => [
      // 税票导出抽屉提示文案
      _t('67e35dbead014000afdf'),
      _tHTML('88f04a668d124000a67c', { b }),
      _t('a67091ebc6b74000a644'),
    ],
    accountStatementAlertInfo: (_t) => [
      // 账户结单导出抽屉提示文案
      _t('d8212ec0cda54800a4ef'),
      _t('2958c54faec14000ab52'),
      _t('30aa79ff82dd4800a28b'),
    ],
    taxInvoiceBillExportOptions: globallBillExportOptions,
    billExportOptions: normalBillExportOptions,
  },
  resetSecurity: {
    supportBot: true, // 是否支持通过 sdk 调起客服机器人
    notSupportBotUrl: '', // 不支持通过 sdk 调起客服机器人时，跳转的链接
    supportUrl: addLangToPath('/support/requests'),
  },
};

// global 站配置
const KC = merge({}, defaultConfig, {
  common: {
    showSiteRedirectDialog: true,
  },
  signin: {
    g2faCanNotUseJumpSelfService: true,
  },
  resetG2fa: {
    tipsMsg: (_t) => _t('8G6dYe88zRkVC8AG1iy3Mh'),
    content: (_t) => _t('4SnZB6HQg1FMmjKPZMkTxr'),
  },
  resetPwd: {
    alertMsg: (_t) => _t('update.pwd.withdraw.tips1'),
  },
  account: {
    showUnbindEmail: true,
    showUnbindPhone: true,
    showAssetDetail: true,
    securityVerifyTip: (_t) => _t('71E31rY5a9V6mz5JArotLV'),
    topTip: (_t) => _t('ix7n4cgA7FRZRQQ5sZiUY9'),
    featureTradeUrl: '/futures/trade', // 专业版链接地址
    // 先关闭不展示，等统一账户11月15号上线之后再打开
    // subAccountShowUnified: true,
  },
  api: {
    docsUrl: '/docs-new/introduction',
    isLeadTraderAccount: true,
    apiAuthMap: (_t) => {
      return {
        API_COMMON: {
          name: _t('vGeoG6ES46EgfbizBCpK3C'),
          desc: _t('api.auth.common.intro'),
        },
        API_SPOT: {
          name: _t('qRMb6gjBoXKuUVxHim36DH'),
          desc: _t('pKdqLp4kR1F2Cm8Mq7wu8U'),
        },
        API_MARGIN: {
          name: _t('qMTZzCnx4j1piJvG25RDaD'),
          desc: _t('rxthXoDhUnUeQXfAtrWHtL'),
        },
        // 理财权限
        API_EARN: {
          name: _t('9b9a216191574000a54d'),
          desc: _t('5f8c13c328654000a806'),
          subAccountDisableLabel: _t('40b31590595b4000aa53'),
        },
        API_FUTURES: {
          name: _t('vD4iaWF9Efu86FmGYegrTr'),
          desc: _t('6fcxviY7Sw9RhwTtcHWd2t'),
        },
        API_WITHDRAW: {
          name: _t('api.withDraw'),
          desc: _t('api.auth.withdraw'),
        },
        // 统一账户权限 只支持 global 站
        API_UNIFIED: {
          name: _t('435204dc005e4800a5de'),
          desc: _t('7c89d621e4134800aa95'),
        },
        // 万象划转
        API_TRANSFER: {
          name: _t('whfNqevXojjNkgtU4FMkw4'),
          desc: _t('gpYdsM8J4hi7JPy7EFYWLB'),
        },
        // 合约带单交易
        API_LEADTRADE_FUTURES: {
          name: _t('29b97ffb5b334000a16c'),
          desc: _t('1afae1da06b24000a59b'),
        },
      };
    },
  },
  kyc: {
    upgrade: true,
    appOneLink: 'https://link.kucoin.com/iqEP/e4lg14k9?kcRoute=%2Fuser%2Fkyc',
    isShowAppScanQRCode: false,
  },
  download: {
    billExportOptions: globallBillExportOptions,
  },
});

// 土耳其站配置
const TR = merge({}, defaultConfig, {
  siteRoute: 'TR_ROUTE',
  signup: {
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
  resetG2fa: {
    referenceUrl: '/support/10021546537359',
  },
  resetPhone: {
    countryCodeInitialValue: {
      mobileCode: '90',
      title: 'Turkey',
      value: 'TR',
    },
    isCountryCodeInit: true,
    queryUserAreaForUpdateCountryCode: false,
    disabledCountrySelect: true,
  },
  kyc: {
    isShowExitModal: false,
    isShowKuCardBanner: false,
    tgUrl: 'https://t.me/kucointurkiye ',
    isShowAppScanQRCode: false,
    KYCHomeComponent: 'TRKycHome',
    KYBHomeComponent: 'TRKybHome',
    isShowImAccount: false,
    isOnlyKYB: true,
    upgrade: false,
    showKycRewardInfo: false,
  },
  api: {
    alertDesc: (_t) => _t('e566ec0734d64000adca'),
  },
});

// 泰国站配置
const TH = merge({}, defaultConfig, {
  siteRoute: 'TH_ROUTE',
  common: {
    appBotPath: '/support',
  },
  signup: {
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
  resetG2fa: {
    referenceUrl: '/support/10367839602191',
  },
  kyc: {
    isShowKuCardBanner: false,
    tgUrl: 'https://t.me/KuCoinThailand',
    KYCHomeComponent: 'THKycHome',
    KYBHomeComponent: 'THKybHome',
    isShowImAccount: false,
    isOnlyKYB: false,
    upgrade: false,
  },
  account: {
    supportHideMarketByCompliant: true,
    marketActiveTab: 'hot', // 个人概览 行情模块 泰国站默认展示热门
    balanceOptions: () => [
      { value: window._BASE_CURRENCY_, label: window._BASE_CURRENCY_ },
      { value: 'BTC', label: 'BTC' },
    ],
  },
  freeze: {
    remindTitle: (_t) => _t('5855320dbf8c4000a816'),
    remindTips: (_t) => _t('afdc433c3ff44000aa66'),
    subUserDesc: (_t) => _t('37b8b102276f4000ad52'),
    repaidDesc: (_t) => _t('9d4fab0793304000a5fc'),
  },
  api: {
    bindThirdBroker: false,
    alertDesc: (_t) => _t('5800b48d77494800abc6'),
    noFutures: true,
  },
  download: {
    showFixedType: true,
    generateStatus: (_t) => _t('9a6ecfa0461a4000a569'),
    showCoinType: false,
    showNormalDrawer: false,
    showTaxInvoiceDrawer: true,
  },
  resetSecurity: {
    supportBot: false,
    notSupportBotUrl: addLangToPath('/support'),
    supportUrl: 'https://kucoin-th.zendesk.com/hc/th/requests/new',
  },
});

// 清退站点配置
const CL = merge({}, defaultConfig, {
  siteRoute: 'CL_ROUTE',
  common: {
    useCLHeader: true,
    useCLLogin: true,
    showFooter: false,
    showCurrency: false,
  },
  resetSecurity: {
    supportBot: false,
    // 申领站没有客服页面，跳到主站的客服页面
    notSupportBotUrl: siteConfig.KUCOIN_HOST + addLangToPath('/support'),
    supportUrl: siteConfig.KC_SITE_HOST + addLangToPath('/support/requests'),
  },
});

// 澳大利亚站点配置
const AU = merge({}, defaultConfig, {
  common: {
    showSiteRedirectDialog: true,
  },
  signin: {
    g2faCanNotUseJumpSelfService: true,
    sloganTitle: (_t) => _t('e04df0dae72b4800acbb'),
    sloganSubTitle: (_t) => _t('39517a340e614000aa1f'),
  },
  signup: {
    isShowMktContent: false,
    isBtnUseDefaultText: true,
  },
  resetG2fa: {
    tipsMsg: (_t) => _t('8G6dYe88zRkVC8AG1iy3Mh'),
    content: (_t) => _t('4SnZB6HQg1FMmjKPZMkTxr'),
  },
  resetPwd: {
    alertMsg: (_t) => _t('update.pwd.withdraw.tips1'),
  },
  account: {
    securityVerifyTip: (_t) => _t('71E31rY5a9V6mz5JArotLV'),
    topTip: (_t) => _t('ix7n4cgA7FRZRQQ5sZiUY9'),
    showAssetDetail: true,
    showGetStartDesc: false,
  },
  api: {
    docsUrl: '/docs-new/introduction',
  },
  kyc: {
    namespace: 'kyc_au',
    KYCHomeComponent: 'AUKycHome',
    KYBHomeComponent: 'AUKybHome', // KYB 主页组件
    isPriorityDealCacheCountry: true, // 首页判断进 KYC or KYB 是否优先读取国家缓存数据
    siteRegion: 'australia',
    onlySupportCurrentRegion: true,
    appOneLink: 'https://link.kucoin.com/iqEP/e4lg14k9?kcRoute=%2Fuser%2Fkyc',
  },
  download: {
    showNormalDrawer: true,
    showTaxInvoiceDrawer: true,
    taxInvoiceExportTimeLimit: 180,
    taxInvoiceDrawAlertInfo: (_t, _tHTML, b) => [
      _t('67e35dbead014000afdf'),
      _t('a67091ebc6b74000a644'),
    ],
  },
});

// 欧洲站点配置
const EU = merge({}, defaultConfig, {
  common: {
    showSiteRedirectDialog: true,
  },
  signin: {
    g2faCanNotUseJumpSelfService: true,
    sloganSubTitle: (_t) => _t('62a13718bed34000afde'),
  },
  resetG2fa: {
    tipsMsg: (_t) => _t('8G6dYe88zRkVC8AG1iy3Mh'),
    content: (_t) => _t('4SnZB6HQg1FMmjKPZMkTxr'),
  },
  resetPwd: {
    alertMsg: (_t) => _t('update.pwd.withdraw.tips1'),
  },
  account: {
    securityVerifyTip: (_t) => _t('71E31rY5a9V6mz5JArotLV'),
    topTip: (_t) => _t('ix7n4cgA7FRZRQQ5sZiUY9'),
    showAssetDetail: true,
    showGetStartDesc: false,
  },
  api: {
    docsUrl: '/docs-new/introduction',
  },
  kyc: {
    namespace: 'kyc_eu',
    KYCHomeComponent: 'EUKycHome',
    siteRegion: 'europe',
    onlySupportCurrentRegion: true,
    appOneLink: 'https://link.kucoin.com/iqEP/e4lg14k9?kcRoute=%2Fuser%2Fkyc',
    isPriorityDealCacheCountry: true, // 首页判断进 KYC or KYB 是否优先读取国家缓存数据
  },
});

const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
    AU,
    EU,
  }[tenant] || KC;

export { tenantConfig, tenant };
