// 多租户项目本地配置文件
// 需要在app.js中初始化了tenant.setInit({nativeInfo, storagePrefix});才能使用
import {tenant} from '@krn/toolkit';

// 多租户默认配置
const defaultConfig = {
  route: {
    // 路由配置
    // router文件中的路由名，路由显示是否， 路由设置成false，页面会显示fallback页面，这种情况是，异常进入了不该进入的页面；
    // 路由的跳转入口，可以根据下面字段做逻辑判断

    CopyTradeMain: true,
    MyFollows: true,
    JoinTelegram: true,
    TraderSearch: true,
    FillApplyTraderForm: true,
    ApplyTraderSelectAvatarPage: true,
    ApplyTrader: true,
    ApplySuccessResult: true,
    MyEarnProfit: true,
    MyTraderPositionSummary: true,
    FollowSetting: true,
    FollowSuccessResult: true,
    TraderProfile: true,
    NickName: true,
    Profile: true,
    UpdateAvatar: true,
    AccountTransfer: true,
    AccountTransferHistory: true,
    UndoIdentity: true,
    UndoIdentitySuccessResult: true,
    LeadTradeReSign: true,
  },
};

// interface Config {
//   nativeInfo: object;
//   currentSiteInfo: object; // 当前站点信息
//   operationInfo: object; // 展业配置
// }
// global 站配置
/**
 * @description: 站点配置可以是函数，或纯对象
 * @param {Config} Config 从app获取到的展业配置
 * @return {*}
 */
const globalSite = Config => ({
  ...defaultConfig,
  // rootComponentName: 'component_TH', // 情况是， 不同站点渲染不同组件，页面根据站点渲染，组件内拿名字匹配

  // showText: {
  //   // 多语言配置
  //   title: 'xxxx', // 直接是多语言key, rn _t需要在hook中使用
  //   subTitle: 'oooo',
  // },
  // imagePics: {
  //   // 资源配置
  //   // delete: require('assets/common/delete.png'),
  // },

  // config参数包含展业配置， 可以做一些动态的复杂的判断逻辑
});

// 土耳其站配置
const turkey = {
  ...defaultConfig,
};

// 泰国站配置
const thailand = {
  ...defaultConfig,
};
// 澳大利亚
const australia = {
  ...defaultConfig,
};
// 欧洲
const europe = {
  ...defaultConfig,
};

const getTenantConfig = () => {
  return tenant.setUpTenantConfig({
    global: globalSite,
    turkey,
    thailand,
    australia,
    europe,
  });
};

export default getTenantConfig;

// 初始化之后，直接使用
// 获取站点
export const getSiteType = tenant.getSiteType;
// 获取计价币种
export const getBaseCurrency = tenant.getBaseCurrency;
