/**
 * Owner: corki.bai@kupotech.com
 */

import { get } from '@tools/request';
import { useState, useEffect } from 'react';
import { safeJSONParse } from '@utils/index';
import storage from '@utils/storage';

/**
 * @description: 多站点兜底配置，确保没有合规风险
 * 未经产品确认，请勿修改
 */

export const MULTI_SITE_CONFIG = {
  KC: {
    accountConfig: {
      siteType: 'global', // 站点类型
      siteLogoUrl: '', // 站点logo
      bindingLimits: ['phone', 'email'], // 没有限制，可不读取
      accountTypes: ['email', 'phone'], // 账号类型，注册和登录时支持的账号类型
      supportExtAccounts: ['google', 'apple', 'telegram'], // 支持三方账号的类型
      supportSubAccount: true, // 是否支持子账号
      subUserPermissions: ['spot', 'margin', 'futures', 'option'], // 子账号支持的交易权限，给子账号列表使用
      supportRCode: true, // 是否支持邀请码
      subUserTypes: ['normal', 'hosted', 'oes'], // 支持的子账号类型，废弃了用subUserTypePermissionMap
      subUserTypePermissionMap: {
        // 支持创建的子账号类型和对应的权限
        OES: ['spot', 'futures'],
        NORMAL: ['spot', 'margin', 'futures', 'option'],
        HOSTED: ['spot', 'margin', 'futures', 'option'],
      },
    },
    // 注册配置
    registerConfig: {
      supportRegisterGuide: true, // 是否支持注册引导
      registerPageContextUrl: '', // 注册页的内容url
      serviceTermsUrl: '', // 用户服务协议 //废弃，用termConfig
      privacyTermsUrl: '', // 隐私协议 //废弃，用termConfig
    },
    // 登录配置
    loginConfig: {
      // 登录账号的类型
      loginAccountTypes: [
        'userpwd', // 账号密码登录
        'passkey', // passkey登录
        'extlogin', // 三方登录
      ],
      loginPageContextUrl: '', // 登录页的内容url
    },
    // 安全设置页
    securityConfig: {
      loginPwdOpt: true, // 是否支持登录密码的操作
      withdrawPwdOpt: true, // 是否支持交易密码的的操作
      phoneBindOpt: true, // 是否支持手机号的操作
      emailBindOpt: true, // 是否支持邮箱的操作
      extAccountBindOpt: true, // 是否支持三方账号的操作
      google2faOpt: true, // 是否支持google2fa的操作
      antiPhishingCodeOpt: true, // 是否支持防钓鱼码的操作
      biometricsOpt: true, // 是否支持生物识别的操作
      passkeyOpt: true, // 是否支持passkey的操作，不支持也不要出passke引导
    },
    myConfig: {
      // 个人中心页
      directoryConfig: {
        // 1.overview: 总览 2.accountsecurity: 账号安全 3.kyc: kyc 4.api:apikey 5.downloadcenter: 下载中心 6.myreward: 我的奖励 7.subuser: 子账号
        pageDirectorys: [
          'overview',
          'accountsecurity',
          'kyc',
          'api',
          'downloadcenter',
          'myreward',
          'subuser',
        ], // 目录配置
        // 头像下拉目录 accountinfo、 ratestandard、 accountsecurity、 kyc、 api、 subuser
        profilePhotoDirectorys: [
          'accountinfo',
          'ratestandard',
          'accountsecurity',
          'kyc',
          'api',
          'myreward',
          'subuser',
        ],
        // 费率跳转url
        rateStandardUrl: '/vip/privilege',
      },
      // 总览配置
      overviewConfig: {
        supportMyInfo: true, // 是否支持我的信息
        supportNewUserBenefits: true, // 是否支持新用户利益
        supportVipRate: true, // 是否支持vip费率
        // 资产配置
        assetFuncs: [
          'assetoverview', // 资产纵览
          'entrustedinquiry', // 委托查询
          'depositcoins', // 充币
          'withdrawalcoins', // 提币
          'buycoins', // 买币
        ],
        supportActivityEntry: true, // 是否支持活动入口
        supportList: true, // 是否支持榜单
        supportNotice: true, // 是否支持通知
        supportDownloadGuide: true, // 是否支持下载引导
        supportKcsRight: true, // 是否支持kcs权益
      },
    },
    // 基本配置
    baseConfig: {
      // 属于什么站点类型，共享站或者独立站
      siteConfigType: 'sharing',
    },
    termConfig: {
      // 用户协议
      userTermConfig: [
        {
          // 协议名称
          termCode: 'privacyUserTerm',
          // 协议 id
          termId: '47497300093764',
        },
        {
          termCode: 'agreementTerm',
          termId: '47185419968079',
        },
      ],
    },
  },
  TR: {
    accountConfig: {
      siteType: 'turkey',
      siteLogoUrl: '',
      bindingLimits: [],
      accountTypes: ['phone', 'email'],
      supportExtAccounts: [],
      supportSubAccount: false,
      supportRCode: false,
      subUserPermissions: [],
      subUserTypePermissionMap: {},
      subUserTypes: [],
    },
    registerConfig: {
      supportRegisterGuide: false,
      registerPageContextUrl: '',
      serviceTermsUrl: '', // 用户服务协议 //废弃，用termConfig
      privacyTermsUrl: '', // 隐私协议 //废弃，用termConfig
    },
    loginConfig: {
      loginAccountTypes: ['userpwd'],
      loginPageContextUrl: '',
    },
    securityConfig: {
      loginPwdOpt: true,
      withdrawPwdOpt: true,
      phoneBindOpt: true,
      emailBindOpt: true,
      extAccountBindOpt: false,
      google2faOpt: true,
      antiPhishingCodeOpt: false,
      biometricsOpt: false,
    },
    myConfig: {
      directoryConfig: {
        pageDirectorys: ['overview', 'accountsecurity', 'kyc', 'api'],
        profilePhotoDirectorys: ['accountinfo'],
        rateStandardUrl: '/privilege',
      },
      overviewConfig: {
        assetFuncs: ['assetoverview', 'depositcoins', 'entrustedinquiry', 'withdrawalcoins'],
        supportMyInfo: true,
        supportNewUserBenefits: false,
        supportVipRate: false,
        supportActivityEntry: false,
        // 多站点控制 个人页 -> 概览 -> 行情
        supportList: true,
        supportNotice: true,
        supportDownloadGuide: true,
        supportKcsRight: false,
      },
    },
    baseConfig: {
      siteConfigType: 'independent',
    },
    termConfig: {
      userTermConfig: [
        {
          termCode: 'frameworkTerm',
          termId: '10725249567119',
        },
        {
          termCode: 'privacyUserTerm',
          termId: '9704731146383',
        },
        {
          termCode: 'riskDisclosureTerm',
          termId: '10726804125839',
        },
        {
          termCode: 'marketingMsgAuthoriseTerm',
          termId: '47497300093724',
        },
        {
          termCode: 'personalDataAuthoriseTerm',
          termId: '47497300093725',
        },
        {
          termCode: 'cookieTerm',
          termId: '10779360444559',
        },
        {
          termCode: 'biologocalDataAuthroiseTerm',
          termId: '47497300093726',
        },
      ],
    },
  },
  TH: {
    accountConfig: {
      siteType: 'thailand',
      siteLogoUrl: '',
      bindingLimits: [],
      accountTypes: ['email', 'phone'],
      supportExtAccounts: [],
      supportSubAccount: false,
      supportRCode: false,
      subUserPermissions: [],
      subUserTypePermissionMap: {},
      subUserTypes: ['normal'],
    },
    registerConfig: {
      supportRegisterGuide: false,
      registerPageContextUrl: '',
      serviceTermsUrl: '', // 用户服务协议 //废弃，用termConfig
      privacyTermsUrl: '', // 隐私协议 //废弃，用termConfig
    },
    loginConfig: {
      loginAccountTypes: ['userpwd'],
      loginPageContextUrl: '',
    },
    securityConfig: {
      loginPwdOpt: true,
      withdrawPwdOpt: true,
      phoneBindOpt: true,
      emailBindOpt: true,
      extAccountBindOpt: false,
      google2faOpt: true,
      antiPhishingCodeOpt: false,
      biometricsOpt: false,
      passkeyOpt: false,
    },
    myConfig: {
      directoryConfig: {
        pageDirectorys: ['overview', 'accountsecurity', 'kyc', 'api'],
        profilePhotoDirectorys: ['accountinfo'],
        rateStandardUrl: '',
      },
      overviewConfig: {
        assetFuncs: [
          'assetoverview',
          'depositcoins',
          'entrustedinquiry',
          'withdrawalcoins',
          'downloadcenter',
        ],
        supportMyInfo: true,
        supportNewUserBenefits: false,
        supportVipRate: false,
        supportActivityEntry: false,
        supportList: true,
        supportNotice: true,
        supportDownloadGuide: true,
        supportKcsRight: false,
      },
    },
    baseConfig: {
      siteConfigType: 'independent',
    },
    termConfig: {
      userTermConfig: [
        {
          termCode: 'agreementTerm',
          termId: '10520403360271',
        },
        {
          termCode: 'privacyUserTerm',
          termId: '10520423046159',
        },
      ],
    },
  },
  CL: {
    accountConfig: {
      siteType: 'claim',
      siteLogoUrl: '',
      bindingLimits: [],
      accountTypes: ['email', 'phone'],
      supportExtAccounts: [],
      supportSubAccount: false,
      supportRCode: false,
      subUserPermissions: [],
      subUserTypePermissionMap: {},
      subUserTypes: [],
    },
    registerConfig: {
      supportRegisterGuide: false,
      registerPageContextUrl: '',
      serviceTermsUrl: '', // 用户服务协议 //废弃，用termConfig
      privacyTermsUrl: '', // 隐私协议 //废弃，用termConfig
    },
    loginConfig: {
      loginAccountTypes: ['userpwd'],
      loginPageContextUrl: '',
    },
    securityConfig: {
      loginPwdOpt: true,
      withdrawPwdOpt: false,
      phoneBindOpt: false,
      emailBindOpt: false,
      extAccountBindOpt: false,
      google2faOpt: true,
      antiPhishingCodeOpt: false,
      biometricsOpt: false,
      passkeyOpt: false,
    },
    myConfig: {
      directoryConfig: {
        pageDirectorys: [],
        profilePhotoDirectorys: [],
        rateStandardUrl: '',
      },
      overviewConfig: {
        supportMyInfo: false,
        supportNewUserBenefits: false,
        supportVipRate: false,
        assetFuncs: [],
        supportActivityEntry: false,
        supportList: false,
        supportNotice: false,
        supportDownloadGuide: false,
        supportKcsRight: false,
      },
    },
    baseConfig: {
      siteConfigType: 'independent',
    },
  },
  AU: {
    accountConfig: {
      siteType: 'australia',
      siteLogoUrl: '',
      bindingLimits: ['phone', 'email'],
      accountTypes: ['email', 'phone'],
      supportExtAccounts: ['google', 'apple', 'telegram'],
      supportSubAccount: true,
      subUserPermissions: ['spot', 'margin', 'futures', 'option'],
      supportRCode: true,
      subUserTypes: ['normal'],
      subUserTypePermissionMap: {
        NORMAL: ['spot', 'margin', 'futures', 'option'],
      },
    },
    registerConfig: {
      supportRegisterGuide: false,
      registerPageContextUrl: '',
      serviceTermsUrl: '',
      privacyTermsUrl: '',
    },
    loginConfig: {
      loginAccountTypes: ['userpwd', 'passkey', 'extlogin'],
      loginPageContextUrl: '',
    },
    securityConfig: {
      loginPwdOpt: true,
      withdrawPwdOpt: true,
      phoneBindOpt: true,
      emailBindOpt: true,
      extAccountBindOpt: true,
      google2faOpt: true,
      antiPhishingCodeOpt: true,
      biometricsOpt: true,
      passkeyOpt: true,
    },
    myConfig: {
      directoryConfig: {
        pageDirectorys: [
          'overview',
          'accountsecurity',
          'kyc',
          'api',
          'downloadcenter',
          'myreward',
          'subuser',
        ],
        profilePhotoDirectorys: [
          'accountinfo',
          'ratestandard',
          'accountsecurity',
          'kyc',
          'api',
          'myreward',
          'subuser',
        ],
        rateStandardUrl: '/vip/privilege',
      },
      overviewConfig: {
        supportMyInfo: true,
        supportNewUserBenefits: true,
        supportVipRate: true,
        assetFuncs: [
          'assetoverview',
          'entrustedinquiry',
          'depositcoins',
          'withdrawalcoins',
          'buycoins',
        ],
        supportActivityEntry: true,
        supportList: true,
        supportNotice: true,
        supportDownloadGuide: true,
        supportKcsRight: true,
      },
    },
    baseConfig: {
      siteConfigType: 'sharing',
    },
    termConfig: {
      userTermConfig: [
        { termCode: 'derivativeUserTerm1', termId: '47185419968068' },
        { termCode: 'derivativeUserTerm2', termId: '47185419968069' },
        { termCode: 'privacyUserTerm', termId: '47185419968070' },
        { termCode: 'agreementTerm', termId: '47185419968071' },
      ],
    },
  },
  EU: {
    accountConfig: {
      siteType: 'europe',
      siteLogoUrl: '',
      bindingLimits: ['phone', 'email'],
      accountTypes: ['email', 'phone'],
      supportExtAccounts: ['google', 'apple', 'telegram'],
      supportSubAccount: true,
      subUserPermissions: ['spot', 'margin', 'futures'],
      supportRCode: true,
      subUserTypes: ['normal'],
      subUserTypePermissionMap: {
        NORMAL: ['spot', 'margin', 'futures'],
      },
    },
    registerConfig: {
      supportRegisterGuide: false,
      registerPageContextUrl: '',
      serviceTermsUrl: '',
      privacyTermsUrl: '',
    },
    loginConfig: {
      loginAccountTypes: ['userpwd', 'passkey', 'extlogin'],
      loginPageContextUrl: '',
    },
    securityConfig: {
      loginPwdOpt: true,
      withdrawPwdOpt: true,
      phoneBindOpt: true,
      emailBindOpt: true,
      extAccountBindOpt: true,
      google2faOpt: true,
      antiPhishingCodeOpt: true,
      biometricsOpt: true,
      passkeyOpt: true,
    },
    myConfig: {
      directoryConfig: {
        pageDirectorys: [
          'overview',
          'accountsecurity',
          'kyc',
          'api',
          'downloadcenter',
          'myreward',
          'subuser',
        ],
        profilePhotoDirectorys: [
          'accountinfo',
          'ratestandard',
          'accountsecurity',
          'kyc',
          'api',
          'myreward',
          'subuser',
        ],
        rateStandardUrl: '/vip/privilege',
      },
      overviewConfig: {
        supportMyInfo: true,
        supportNewUserBenefits: true,
        supportVipRate: true,
        assetFuncs: [
          'assetoverview',
          'entrustedinquiry',
          'depositcoins',
          'withdrawalcoins',
          'buycoins',
        ],
        supportActivityEntry: true,
        supportList: true,
        supportNotice: true,
        supportDownloadGuide: true,
        supportKcsRight: true,
      },
    },
    baseConfig: {
      siteConfigType: 'sharing',
    },
    termConfig: {
      userTermConfig: [
        { termCode: 'derivativeUserTerm1', termId: '47185419968072' },
        { termCode: 'derivativeUserTerm2', termId: '47185419968073' },
        { termCode: 'privacyUserTerm', termId: '47185419968074' },
        { termCode: 'agreementTerm', termId: '47185419968075' },
      ],
    },
  },
};

let targetMultiSiteConfig = null;

let currentPromise = null;

const getMultiSiteConfig = async () => {
  if (targetMultiSiteConfig) {
    return targetMultiSiteConfig;
  }

  if (currentPromise) {
    return currentPromise;
  }
  // uc 多租户配置 所有站点都发起请求
  currentPromise = get('/ucenter/site-config')
    .then((res) => {
      const { data, success } = res;
      if (success && data) {
        targetMultiSiteConfig = data;
        // 2.1:将配置存储到localStorage
        storage.setItem('$gbiz_multi_site_config', JSON.stringify(data));
        currentPromise = null;
        return data;
      }
      throw new Error('get site config failed1');
    })
    .catch(() => {
      // 3.如果从服务器的配置拉取失败，则使用localStorage中的配置
      // eslint-disable-next-line no-unused-vars
      currentPromise = null;
      const siteConfigString = storage.getItem('$gbiz_multi_site_config');
      if (siteConfigString && safeJSONParse(siteConfigString)) {
        targetMultiSiteConfig = JSON.parse(siteConfigString);
        return targetMultiSiteConfig;
      }
      // 4.如果没有缓存，则使用默认的配置
      targetMultiSiteConfig = MULTI_SITE_CONFIG[window._BRAND_SITE_] || MULTI_SITE_CONFIG.KC;
      return MULTI_SITE_CONFIG[window._BRAND_SITE_] || MULTI_SITE_CONFIG.KC;
    });
  return currentPromise;
};

export const useMultiSiteConfig = () => {
  const [multiSiteConfig, setMultiSiteConfig] = useState(targetMultiSiteConfig);

  useEffect(() => {
    getMultiSiteConfig().then((data) => {
      setMultiSiteConfig(() => data);
    });
  }, []);

  return { multiSiteConfig };
};

export default useMultiSiteConfig;
