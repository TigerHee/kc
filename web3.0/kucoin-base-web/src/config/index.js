export const marginPathsUrls = [
  '/margin/v2',
  '/leveraged-tokens',
  '/land/margin-data', // 老的杠杆借贷利率路由
  '/margin-data/loan-rates',
  '/margin-data/cross-risk-limit',
  '/margin-data/isolated-risk-limit',
  '/margin-data/collateral-ratio',
  '/margin-data/spot-index/:symbol?',
  '/margin-analysis/:type',
  '/option-simple/:symbol?',
];

export const publicWebPaths = [
  '/convert',
  '/convert/:tabType?',
  '/convert/:tabType?/:symbol?',
  '/download',
  '/kcs',
  '/information',
  '/gemvote',
  '/gemspace',
  '/gempool',
  '/cert',
  '/cert/qrcode/:id',
  '/spotlight-center',
  '/spotlight_r6',
  '/spotlight7',
  '/spotlight_r8',
  '/spotlight',
  '/user-guide',
  '/pre-market',
  // legal路由需要跳转到public-web，其他文章跳转到customer-web
  '/legal/requests',
];

export const tradePublicWebPaths = [
  '/markets',
  '/order',
  '/institution',
  '/institution/borrow',
  '/institution/marketMaker',
  '/privilege',
  '/vip/privilege',
  '/vip/level',
  '/api',
  '/broker',
  '/application',
  '/land/nft-info',
  '/land/price-protect',
  '/token-info/info',
  // 原生app编码地址写错了，对老版本多写一个斜杠做兼容，防止跳转404
  '/token-info//info',
];

export const seoSitemapWebPaths = ['/sitemap'];

export const briskWebPaths = [
  '/', // 首页
  '/judge',
  '/download-ad/land_page_v1',
  '/download-ad/land_page_v2',
  '/download-ad/land_page_v3',
];

export const assetsWebPaths = [
  '/assets',
  '/assets/analysis',
  '/assets/main-account',
  '/assets/trade-account',
  '/assets/trade-account/convertKCS',
  '/assets/trade-account/convertKCS/record',
  '/assets/margin-account',
  '/assets/margin-account/margin',
  '/assets/margin-account/convertKCS',
  '/assets/margin-account/isolated',
  '/assets/margin-account/convertKCS/record',
  '/assets-detail',
  '/assets/withdraw/:coin',
  '/assets/coin/:coin',
  '/assets/coin',
  '/assets/withdraw',
  '/assets/record',
  '/assets/bot-account',
  '/assets/earn-account',
  '/assets/earn-account/historical',
  '/earn-account/order',
  '/withdraw-addr-manage',
  '/withdraw-addr-manage/batch',
  '/assets/deposit-address/abandoned',
  '/assets/faq',
  // 合约资产路由
  '/assets/futures-account',
  '/assets/futures-account/assets-history',
  '/assets/futures-account/transfer-records',
  '/assets/futures-account/coupon-records',
  '/assets/futures-account/coupon-records/detail/:couponId',
  '/assets/options-account',
  '/assets/alpha-account',
  '/assets/travel-rule/info',
  // 美国用户清退
  '/claim/withdraw/:coin',
  '/claim/withdraw',
  '/claim',
  '/claim/record',
  '/assets/follow',
  '/assets/unified-account',
  '/assets/wht',
];

export const seoLearnWebPaths = ['/learn'];

export const newsWebPaths = ['/news', '/learn-and-earn', '/research', '/price-prediction'];
export const seoPriceWebPaths = ['/price'];

export const ucenterWebPaths = [
  '/account',
  '/account/security',
  '/account/kyc',
  '/account/api',
  '/account/api/activation',
  '/account/api/create',
  '/account/api/create/security',
  '/account/api/edit',
  '/account/api/edit/postsecurity',
  '/account/api/edit/presecurity',
  '/account/api/verify/:verifyId',
  '/account/download',
  '/account/sub',
  '/account/transfer',
  '/account/guidance-zbx',
  '/account/escrow-account',
  '/ucenter/reset-password',
  '/ucenter/signin',
  '/ucenter/signup',
  '/ucenter/reset-g2fa/:token',
  '/ucenter/rebind-phone/:token',
  '/ucenter/reset-security', // 重置安全项-登陆态
  '/ucenter/reset-security/token/:token', // 重置安全项-半登陆态
  '/ucenter/reset-security/address/:address', // 重置安全项-无登陆态
  '/utransfer',
  '/authorize-result',

  '/kyc-advance-result', // kyc advance 结果页面
  '/account/kyc/personal-kyc1',
  '/account/kyc/personal-kyc2', // kyc 人工审核页面
  '/account/kyc/institutional-kyc', // 机构kyb，老版
  '/account/kyc/tax', // pan num
  '/account/kyc/update', // 证件更新
  '/account/kyc/migrate', // 站点迁移的前 kyc
  '/account/kyc/setup/method', // 选择 kyc 认证方式
  '/account/kyc/setup/country-of-issue', // 选择 kyc 证件签发国家
  '/account/kyc/setup/ocr', // ocr相关
  '/account/kyc/setup/identity-type', // 选择 kyc 证件类型
  '/account/kyc/home', // kyc 落地页
  '/account/kyb/migrate', // 站点迁移的前 kyb
  '/account/kyb/setup', // 站点迁移的前 kyb
  '/account/kyb/home', // 站点迁移的前 kyb
  '/account/kyb/certification', // kyb 认证流程，新版
  '/restrict', // cdn封禁

  '/account/sub/history/:type',
  '/account-sub/api-manager/create/security/:sub',
  '/account-sub/api-manager/create/:sub',
  '/account-sub/api-manager/edit/postsecurity/:sub',
  '/account-sub/api-manager/edit/presecurity/:sub',
  '/account-sub/api-manager/edit/:sub',
  '/account-sub/api-manager/:sub',
  '/account-sub/assets/:sub',
  '/account/assets/:sub',
  '/account-compliance',
  '/oauth',
  '/account/security/phone',
  '/account/security/unbind-phone',
  '/account/security/g2fa',
  '/account/security/email',
  '/account/security/unbind-email',
  '/account/security/protect',
  '/account/security/forgetWP',
  '/account/security/updatepwd',
  '/account/security/deleteAccount',
  '/account/security/safeWold',
  '/account/security/:wordType',
  '/account/security/score',
  '/freezing',
  '/freeze',
  '/freeze/apply',
];

export const seoWebPaths = ['/how-to-buy', '/converter', '/airdrop'];

export const paymentWebPaths = [
  '/fast-coin/order/:id',
  '/fast-coin/order-details/:id',
  '/assets/order',
  '/assets/payments',
  '/assets/payments/:channelId',
  '/assets/fiat-currency',
  '/assets/fiat-currency/*',
  '/otc',
  '/otc/*',
];
export const fastCoinWebPaths = [
  '/express',
  '/express/*',
  '/block-trade',
  '/buy',
  '/buy/*',
  '/sell',
  '/sell/*',
];

// tobc
export const marketingGrowthWebPaths = [
  '/affiliate-system',
  '/affiliate-system/overview',
  '/affiliate-system/first-level-invitee',
  '/affiliate-system/commission',
  '/affiliate-system/invite-code',
  '/affiliate-system/sub-affiliate',
  '/affiliate-system/activity', // 合伙人活动聚合页
  '/affiliate',
  '/affiliate-apply',
  // 多级返佣-邀请成为合伙人
  '/affiliate-invitation',
  '/referral',
  '/referral/refer-and-earn',
  '/referral/detail',
  // Broker 工作台 start 2025.02.14
  '/broker-system',
  '/broker-system/overview', // 总览
  '/broker-system/commission', // 我的佣金
  '/broker-system/api-user', // 我的经纪商
  '/broker-system/invited-user', // 我的直接邀请用户
  '/broker-system/user', // 我的客户
  '/broker-system/user-detail', // 我的客户详情
  '/broker-system/activity', // 合伙人活动聚合页
  '/broker-system/invite-code', // 专属邀请码
  // Broker 工作台 end 2025.02.14
  '/fixed-vip-limit',
];

export const platformOperationWebPaths = [
  '/land/KuRewards',
  '/land/KuRewards/detail',
  '/land/KuRewards/coupons',
  '/land/wealth-calender',
  '/land/wealth-calender/:id',
  '/account/vouchers', // 卡券中心
  '/account/vouchers/instruction',
  '/account/vouchers/history',
  '/land/market-movement', // 行情异动
  '/land/earn-crypto-rewards-by-referring', // m1 现金礼包
  '/land/earn-crypto-rewards-by-referring-m2', // m2 现金礼包
  //app内 福利中心用platform前缀
  '/platform/KuRewards',
  '/platform/KuRewards/detail',
  '/platform/KuRewards/coupons',
  '/platform/market-movement', // 行情异动
  '/platform/account/vouchers', // 卡券中心
  '/platform/account/vouchers/instruction',
  '/platform/account/vouchers/history',
  '/platform/wealth-calender',
  '/platform/wealth-calender/:id',
  '/platform/earn-crypto-rewards-by-referring', // m1 现金礼包
  '/platform/earn-crypto-rewards-by-referring-m2', // m2 现金礼包
  '/earn-crypto-rewards-by-referring', // m1 现金礼包
  '/earn-crypto-rewards-by-referring-m2', // m2 现金礼包
  '/kabt', // animoka-mint-sbt
  '/platform/kabt',
  '/forbidden', // IP 封禁页面
  '/forbidden/:lang',
  // app内 合约交易赛用platform前缀
  '/platform/trading-competition',
  '/platform/trading-competition/:id',
  // 合约交易赛中转页
  '/trading-competition-redirect',
  // 红包封面相关页面
  '/redpacket-cover/list',
  '/redpacket-cover',
];

/**
 * 营销增长活动
 */
export const cashbackReferralWebPaths = [
  '/invite-to-earn', // 20240411 砍一刀
  '/gemslot', // gemslot 2.0 首页
  '/gemslot/detail/code/:currency', // gemslot 2.0 详情页-旧版
  '/gemslot/:currency', // gemslot 2.0 详情页
  '/events-hub', // 活动中心
  '/usd1', // usd1活动
  '/usd1/points', // usd1积分
];

export const customerWebPaths = [
  '/support',
  '/selfservice',
  '/forms',
  '/web3/support',
  '/web3/support/*',
];

export const seoCmsWebPaths = ['/announcement', '/blog'];

export const kucoinpayWebPaths = ['/pay', '/pay/*'];
