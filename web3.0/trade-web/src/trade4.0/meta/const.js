/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-04-26 14:19:02
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-08-30 15:36:58
 * @FilePath: /trade-web/src/trade4.0/meta/const.js
 * @Description:
 */
import { _t } from 'utils/lang';
import sessionStorage from 'src/utils/sessionStorage';
import storage from 'utils/storage';
import { isDisplayFutures } from '@/meta/multiTenantSetting';

function getUserCustomVersion() {
  // 如果是新版用户，点击页面的返回老版按钮后，只在当前页面有效，不做本地保存。如果关闭页面后，下次进入还是新版界面。 规则是：每次进入页面都遵守神策abtest 策略；
  const CUSTOM_OLD_VERSION = sessionStorage.getItem('CUSTOM_OLD_VERSION');
  if (CUSTOM_OLD_VERSION !== null) {
    if (CUSTOM_OLD_VERSION === true) {
      return true; // 用户自定义返回老版本
    } else {
      return false;
    }
  }
  return null;
}

export const isABNew = () => {
  const customVersion = getUserCustomVersion();
  if (customVersion !== null) {
    if (customVersion === true) {
      return false; // 用户自定义返回老首页
    } else if (customVersion === false) {
      return window.TRADE_AB === 'new';
    }
  }
  return window.TRADE_AB === 'new';
};

// 下面方法注释，判断是否为abnew，都走isABNew方法，调用要收口到一个地方
// export const isABOld = () => {
//   return window.TRADE_AB === 'old';
// };

// export const ABValue = window.TRADE_AB;

// 交易类型枚举
export const SPOT = 'TRADE';
export const MARGIN = 'MARGIN_TRADE';
export const FUTURES = 'FUTURES';
export const ISOLATED = 'MARGIN_ISOLATED_TRADE';
export const STRATEGY = 'STRATEGY';
/**
 * 账户
 */
export const ACCOUNT_CODE = {
  MAIN: 'MAIN', // 储蓄账户
  TRADE: 'TRADE', // 币币账户
  TRADE_HF: 'TRADE_HF', // 高频账户
  MARGIN: 'MARGIN', // 杠杆账户
  ISOLATED: 'ISOLATED', // 逐仓杠杆账户
  CONTRACT: 'CONTRACT', // 合约账户
  POOL: 'POOL', // 矿池账户
};

// 页面生命周期
export const PAGE_ACTIVE = 'active'; // 激活
export const PAGE_PASSIVE = 'passive'; // 页面能看到，焦点不在该页面
export const PAGE_HIDDEN = 'hidden'; // 隐藏/最小化/标签页切换
export const PAGE_FROZEN = 'frozen'; // 页面冻结
export const PAGE_TERMINATED = 'terminated'; // 页面结束
export const PAGE_DISCARDED = 'discarded'; // 页面废弃
export const PAGE_NEED_RESET = [PAGE_HIDDEN, PAGE_FROZEN, PAGE_TERMINATED, PAGE_DISCARDED];

// 合约 ab localStorage key
export const FUTURES_STORAGE_AB_KEY = 'trade_futures_version';
export const FUTURES_STORAGE_AB_PREFIX = 'futures_ab';

// 合约 ab
export const isFuturesNew = () => {
  // 强制开启新版本
  // const enforceNew = storage.getItem('trade_futures_must_new', FUTURES_STORAGE_AB_PREFIX);
  // if (enforceNew === 'new') {
  //   return true;
  // }

  // 判断接口状态 ab，接口为 true 时，判断缓存，为 false，清空缓存返回 false
  // if (window.TRADE_FUTURES_AB && window.TRADE_FUTURES_AB === 'new') {
  //   const storageUser = storage.getItem(FUTURES_STORAGE_AB_KEY, FUTURES_STORAGE_AB_PREFIX);
  //   if (storageUser) {
  //     return storageUser === 'new';
  //   }
  //   storage.setItem(FUTURES_STORAGE_AB_KEY, 'new', FUTURES_STORAGE_AB_PREFIX);
  //   return true;
  // } else {
  //   storage.removeItem(FUTURES_STORAGE_AB_KEY, FUTURES_STORAGE_AB_PREFIX);
  //   return false;
  // }
  // return true;

  // 上面都是 abtest 的老代码，先保留，后续也可以继续接 abtest 开关合约功能
  // 2024.08.27 以后，此isFuturesNew 方法，用于多租户是否开启合约功能开关
  return isDisplayFutures();
};

// 合约全仓 ab
export const isFuturesCrossNew = () => {
  // 强制开启新版本
  // const enforceNew = storage.getItem('trade_futures_must_new', FUTURES_STORAGE_AB_PREFIX);
  // if (enforceNew === 'new') {
  //   return true;
  // }

  // // 判断接口状态 ab，接口为 true 时，判断缓存，为 false，清空缓存返回 false
  // if (window.TRADE_FUTURES_CROSS_AB && window.TRADE_FUTURES_CROSS_AB === 'new') {
  //   const storageUser = storage.getItem(FUTURES_STORAGE_AB_KEY, FUTURES_STORAGE_AB_PREFIX);
  //   if (storageUser) {
  //     return storageUser === 'new';
  //   }
  //   storage.setItem(FUTURES_STORAGE_AB_KEY, 'new', FUTURES_STORAGE_AB_PREFIX);
  //   return true;
  // } else {
  //   storage.removeItem(FUTURES_STORAGE_AB_KEY, FUTURES_STORAGE_AB_PREFIX);
  //   return false;
  // }
  return true;
};

/**
 * 全仓新代码，内容单独控制开关
 */
export const isOpenFuturesCross = () => {
  // // 强制开启新版本;
  // const enforceNew = storage.getItem('trade_futures_cross_isOpen');
  // if (enforceNew === 'new') {
  //   return true;
  // }

  return true;
};
export const PLACEHOLDER_IMAGE =
  // eslint-disable-next-line max-len
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARkSURBVHgB1Vm7UttAFL2W5AcYJjyH12SYCUMmoSBVigRm0uUT6KmoqWhp+Qp6voI0pEkKUqWBDpjMBEwAG9vCJucYyyPLkqyVVjzOzFrySrs6d/fevXfvZkQDtre3jZmZmUKpVMrmcjnTMIxsuVw2LMvKOO/k8/nG3d0di12tVm1U1dHuThIiIzFB0gMDA0XTNPONRiMnMYD29sXFRVkSCKMsgEMcIznkHuGkaDabt7Va7VpVECUCOzs7w7qJ++B6a2vrOurLkYhgVKyxsbHR29vbrDwCaCu2bZ9HmY2+AqCTwWw2+yrlUe9BJpNpTk5OXq6vr1dD3wt7SJXBZVieFqEqFSjAMyHvIFAIw69yd3e3IM+HPDFMVfZ7YHoraLCVSmUczuhRdb4f4CBzKysr1f39/aa7vmcGRkZGxh/bYKPg/v7e4Erore8i+sz0Pghd9tBRIaoOlssxSQEIN97g8hVL41sUhh1/JCbQPgtVqkCV7vm/o0IItlIZeZJHmPAZt3SCRZRlkFiWmKAqMZTp9M8fjj5sZCRqJ7CRKXTEEX0PYy/j/krCyXsxhba8xpoJ9yy0ZgChsFI0ieiTpIrt8snvnRDyDmLPhHsWWgKcnZ0NiRqKrs5yIFJ0P4xA3kFsIRjGt65UH0ijpP8+H/2NYrc7DiL/C+UY5bWnPpY6YeDM1dXVsqGqPmEII48Pshzh/rvP82XY0jtRR8HgNlA0oB9550+YEKKIQqGQ5b5VhwALUcg78BMCdbYogvtv8LdMrCqSEH6j50veAYVo6z7bciH4gTpRATdYFvahpuhHF/m2en3kPYge4p5G78zEUfteVIHIIWOIfvSMPAh/kAdPzLKM/1oWDvqDNAToAT2n66PaVj3CwAZafe7C0eOcQPonLsz/2NR1LJl10QSrWCw2U7ADCiGOKgXpuss26rg/wGAqOTNmLwzsvhKn9+TBy3oRGiZ4o1TcfxFFMF2J2TR0CBDonPyE8HN6cfwA86zG6OiockM/hHlYtxBBHhsDeSiKYJLYQiRaRTAnOuByTt4Qu2UTIHkTQP4AzvRYFLG0tFQzEI02MSraVoWwmdBJnpnttbW1RssPoIOaSmOMZpfAIF32/A8SogtxyRPttPzDhgYxRVnRH5Bca10nCb8X+gmRhDxB9eG1k1ZJK6WC2VoQj00kJY8otLK5uXnZ6supjDELkdA27G/imrEk5Im5ublOXujFJ7a6gjk+0OTYUgFDB2+WuicanZ+fP09DlZKCnBYXF/9663sE4No6MTHxT54ZZmdnS+TmrffdD2xsbFRwiXzQ9gi4DjpqevFHTKE7MjbEvrP0FDbBb2Jpv+x35BrpIGNvb888PT2dSCkB0APGOdPT0xd+Ou+F8kG3pKhSHHWkeW60H3S7wdk4OTkZrtfrg6IJDnFGA4yOVdrGPgujIEhL5q+uroYQJlsSAwzjGQnHIe5Ay2GeIwzzrExVMtvntheOMJMHgI2Za3AXyI1UXNJu/AfaaXo2/mbKhwAAAABJRU5ErkJggg==';
