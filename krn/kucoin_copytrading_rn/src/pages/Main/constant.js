export const MAIN_TAB_KEYS = {
  home: 'homepage',
  myCopies: 'myCopy',
  myLeading: 'myLead',
};

/** main首页 app跳转导航 路由参数key  */
export const MAIN_NAVIGATION_ROUTER_KEY = 'uiStateValue';

/** 申请交易员后返回 跟单主页 我的带单 tab 锚点 路由值 */
export const APPLY_TRADER_SUCCESS_TO_LEAD_TAB =
  'copyTradingJump.ApplyTraderActiveMyLead';

/** APP跳跟单首页 定位导航锚点 */
export const APP2COPY_NAVIGATION_POINTS = {
  myCopy: 'copyTradingJump.myCopy',
  myLeading: 'copyTradingJump.myLeading',
  copyHome: 'copyTradingJump.copyHome',
};

export const APP2COPY_NAVIGATION_POINTS_2_MAIN_TAB_KEY_MAP = {
  [APP2COPY_NAVIGATION_POINTS.copyHome]: MAIN_TAB_KEYS.home,
  [APP2COPY_NAVIGATION_POINTS.myCopy]: MAIN_TAB_KEYS.myCopies,
  [APP2COPY_NAVIGATION_POINTS.myLeading]: MAIN_TAB_KEYS.myLeading,
  [APPLY_TRADER_SUCCESS_TO_LEAD_TAB]: MAIN_TAB_KEYS.myLeading,
};
