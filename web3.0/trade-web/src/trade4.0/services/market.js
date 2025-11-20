/**
 * Owner: Clyne@kupotech.com
 */
import { pull, post } from 'utils/request';
// import { FAVOR_ENUM } from '../pages/NewMarkets/config';
import { isDisplayFutures } from '@/meta/multiTenantSetting';

const futuresAPI = '/_api_kumex';
/**
 * 币种nav
 */
export const pullCoinNav = () => {
  return pull('/discover-front/plate/plate-list');
};

/**
 * 现货nav查询
 */
export const pullSpotNav = () => {
  return pull('/currency/markets');
};

/**
 * 这个接口新的获取分类信息
 */
export const pullSpotNewNav = () => {
  return pull('/market-front/spot/category');
};

/**
 * 现货futures查询
 */
export const pullFuturesNav = () => {
  return pull(`${futuresAPI}/kumex-contract/contracts/tradeArea/getAvailableV2`);
};

/**
 * 获取全部nav
 */
export const pullAllNav = () => {
  const requests = [pullCoinNav(), pullSpotNav(), pullSpotNewNav()];
  if (isDisplayFutures()) {
    requests.push(pullFuturesNav());
  }
  return Promise.all(requests);
};

/**
 * 获取nav条件的列表
 */
export const pullNavList = (params) => {
  // return pull('/market-front/search', params);
  return pull('/market-front/trade/search', params);
};

/**
 * 获取收藏数据
 */
// export const pullCollectList = (type) => {
//   const coin = pullNavList({
//     currentPage: 1,
//     pageSize: 200,
//     subCategory: FAVOR_ENUM.COIN,
//     tabType: FAVOR_ENUM.FAVOR,
//   });
//   const spot = pullNavList({
//     currentPage: 1,
//     pageSize: 200,
//     subCategory: FAVOR_ENUM.SPOT,
//     tabType: FAVOR_ENUM.FAVOR,
//   });
//   const futures = pullNavList({
//     currentPage: 1,
//     pageSize: 200,
//     subCategory: FAVOR_ENUM.FUTURES,
//     tabType: FAVOR_ENUM.FAVOR,
//   });
//   return Promise.all([coin, spot, futures]);
// };

export const pullCollectList = (type) => {
  return pullNavList({
    currentPage: 1,
    pageSize: 150,
    returnAll: true,
    // tabType: FAVOR_ENUM.FAVOR,
  });
};

/**
 * 设置现货收藏（暂时杠杠也用这个）
 */
export const setSpotCollect = (params) => {
  return post('/ucenter/user/collect-symbol', params);
};

/**
 * 币种类型收藏
 */
export const setCoinCollect = (params) => {
  return post(`/quicksilver/user-config/set`, params, false, true);
};

/**
 * 合约类型收藏
 */
export const setFuturesCollect = (params) => {
  return post(`${futuresAPI}/ucenter/contract/collect`, params);
};
