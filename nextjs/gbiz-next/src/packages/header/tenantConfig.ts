/**
 * Owner: eli.xiang@kupotech.com
 */
import { useMemo } from 'react';
import { bootConfig, getOrigin } from 'kc-next/boot';
import { isFuturesNewEntryEnabled } from './util';

const futuresNewEntryEnabled = isFuturesNewEntryEnabled();

const defaultConfig = {
  useHeaderCL: false,
  showMarginFlag: true, // 展示币对后的杠杆标识
  showSearchBox: true, // 展示搜索框
  showAssetsDropDown: true, // 展示资产下拉菜单
  showFundingAccount: true, // assets资产 下面是否展示 资金账户 Funding Account
  showTradeAccount: true, // assets资产 下面是否展示 币币账户 Trading Account
  showDepositAccount: true, // assets资产 下面是否展示 充值账户 Deposit Account
  showTrSiteEntry: false, // 展示土耳其站引流入口
  showAffiliateHub: true, // 展示合伙人入口
  showRewardsHub: true, // 展示福利中心入口
  isFilterUserMenuConfig: false, // 将外部传入的 menuConfig 按照站点再过滤一次
  rateStandardUrlPath: '/vip/privilege', // 个人中心 fees&vip跳转链接路径，配置为空时，业务里自行添加路径
  feesVipI18Key: _t => _t('i8j5HNa6mdd8xsdhxtpdCV'), // 个人中心 fees&vip文案翻译
  ignoreShowDownloadCompliance: false, // header中下载入口忽略展业中台的配置
  currencyWhiteList: undefined, // 站点支持的汇率白名单，如果没有，就使用接口返回的汇率，如果有就用此白名单过滤接口响应。后续都改为接口控制
  isRestrictSiteLang: true, // 是否限制站点的语言，具体的限制逻辑在业务代码里面处理
  showHeaderNewTag: true, // 展示new标签
  // 合约交易地址 交易大厅版本
  // KUMEX_TRADE: `${origin}/trade/futures`,
  showOption: true, // 展示期权
  showWeb3EntranceTab: false, // 展示 WEB3 入口Tab
  filterCurrency: currencies => currencies, // 过滤货币
  showSiteRedirectDialog: false, // 展示站点切换弹窗，共享站需要
  // 机器人菜单配置
  // HACK: 特殊逻辑, 主站才展示A配置， 其他站点都展示B配置
  botGlobalListShow: () => bootConfig._BRAND_SITE_ === 'KC', // true 展示主站列表, false展示多站点列表
  // 机器人菜单配置
  downloadQrOneLinkUrl: '', // 下载浮窗二维码 onelink 链接
  futuresNewEntryEnabled: false, // 是否启用合约交易的新入口
  showKuCardVisa: false, // 展示 KuCard Visa 图标
  futuresPoweredBy: '', // url 包含 futures，则左上角展示的 powered by 文案
  // header 交易所 <=> 切换按钮文案
  getEntranceTabBrandName: _t => _t('cex_header_exchange_text'),
  // EU点 web3 要提示弹窗
  isNeedWeb3Confirm: false,
};

const KC = {
  ...defaultConfig,
  // 展示 WEB3 入口Tab
  showWeb3EntranceTab: true,
  showSiteRedirectDialog: true,
  futuresNewEntryEnabled,
  // KUMEX_TRADE: futuresNewEntryEnabled ? `${origin}/trade/futures` : `${origin}/futures/trade`,
  showTrSiteEntry: true,
  showKuCardVisa: true,
};

const TR = {
  ...defaultConfig,
  showSearchBox: true,
  showAssetsDropDown: false,
  showTrSiteEntry: false,
  showAffiliateHub: false,
  showRewardsHub: false,
  isFilterUserMenuConfig: true,
  rateStandardUrlPath: '',
  showHeaderNewTag: false,
  // 资产展示项
  feesVipI18Key: _t => _t('9fe872b930d44000a661'),
  ignoreShowDownloadCompliance: true,
  currencyWhiteList: ['TRY', 'USD'],
  isRestrictSiteLang: false,
  // TR合约交易地址 -> 合约交易大厅
  // KUMEX_TRADE: `${origin}/trade/futures`,
  showOption: false,
};

const TH = {
  ...defaultConfig,
  showMarginFlag: false,
  showTrSiteEntry: false,
  showAffiliateHub: false,
  showRewardsHub: false,
  rateStandardUrlPath: '',
  showHeaderNewTag: false,
  isRestrictSiteLang: false,
  // TH合约交易地址 -> 合约交易大厅
  // KUMEX_TRADE: `${origin}/trade/futures`,
  showOption: false,
  filterCurrency: currencies => currencies.filter(currency => currency === 'THB' || currency === 'USD'), // 过滤货币
  downloadQrOneLinkUrl: 'https://kucointh.onelink.me/AiYm/h4niawn1', // 下载浮窗二维码 onelink 链接
};

const CL = {
  ...defaultConfig,
  useHeaderCL: true,
};

const AU = {
  ...defaultConfig,
  showWeb3EntranceTab: true,
  showSiteRedirectDialog: true,
  showRewardsHub: false,
  filterCurrency: currencies => currencies.filter(currency => currency === 'AUD'), // 过滤货币
  futuresPoweredBy: 'Powered by Echuca Trading',
};
const EU = {
  ...defaultConfig,
  showWeb3EntranceTab: true,
  showSiteRedirectDialog: true,
  showRewardsHub: false,
  showKuCardVisa: true,
  currencyWhiteList: ['EUR', 'NOK', 'SEK', 'PLN', 'DKK', 'RON', 'CZK', 'BGN', 'CHF', 'GBP', 'USD', 'UAH', 'HUF', 'ISK'],
  isNeedWeb3Confirm: true,
  getEntranceTabBrandName: _t => bootConfig._BRAND_NAME_,
};

const tenantConfig = {
  KC,
  TR,
  TH,
  CL,
  AU,
  EU,
};

export const getTenant = () => bootConfig._BRAND_SITE_ || 'KC';

type TTenantCode = 'KC' | 'TR' | 'AU' | 'EU' | 'CL' | 'TH' | 'DEMO';

export const getTenantConfig = (tenant?: TTenantCode) => {
  const origin = getOrigin();
  const _tenant = tenant || bootConfig._BRAND_SITE_ || 'KC';
  let KUMEX_TRADE = `${origin}/trade/futures`;
  if (_tenant === 'KC' && !futuresNewEntryEnabled) {
    KUMEX_TRADE = `${origin}/futures/trade`;
  }
  return {
    ...(tenantConfig[_tenant] || KC),
    KUMEX_TRADE,
  };
};

export const useTenantConfig = (tenant?: TTenantCode) => {
  const tenantConfig = useMemo(() => getTenantConfig(tenant), [tenant]);
  return tenantConfig;
};
