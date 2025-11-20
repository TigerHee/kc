/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

// ?x-version=${_xVersion}

// 根据币种获取最佳交易对
export async function getBestSymbolByCoin({ coin }) {
  return pull(`/quicksilver/universe-currency/market/symbols/${coin}`);
}

// 根据币种获取交易对行情统计信息
export async function getStatsBySymbol({ symbol }) {
  return pull(`/quicksilver/universe-currency/symbols/stats/${symbol}`);
}

// 获取币种信息
export const getCoinInfo = (params) =>
  pull(`/quicksilver/universe-currency/symbols/info/${params.coin}`, params);

// 获取币种解释
export const getExplain = (params) =>
  pull(`/quicksilver/universe-currency/symbols/explain`, params);

//获取币种帖子详情
export async function getPostDetail(query) {
  return pull(`/reaper-social/currency/post-detail`, query);
}
//获取帖子评论列表
export async function getComments(params) {
  return pull('/reaper-social/currency/comment-list', params, false, true);
}

// 币种帖子列表
export const getPostList = (params) => {
  return pull(`/reaper-social/currency/post-list`, params);
};

// 用户发帖
export const addPost = (params) => {
  return post(`/reaper-social/currency/user-add-posts`, params, false, true);
};
// type 类型，1币种，2组合，3评论, 11帖子评论，10帖子
export function handleLike(itemId, type, zan, ownership, topComment = true) {
  return post(
    '/reaper/item-detail/like',
    { itemId, type, zan, ownership, topComment },
    false,
    true,
  );
}
// 获取用户禁言状态
export const getUserBannedStatus = (params) => pull('/reaper-social/api/user/banned', params);

//评论
export const postComment = (data) => {
  return post('/reaper/item-detail/comment-new', data, false, true);
};

// 获取profile详情
export const getProfileDetail = (params) => pull(`/reaper/user-profile/details`, params);

// 获取spl列表
export const getSplList = (params) => {
  return pull(`/discover-front/spl/list`, params);
};

// 竞猜
export const makeBet = (params) =>
  pull(`/quicksilver/currency-detail/symbols/guessing/${params.currency}`, params);

export const getBetResult = (params) =>
  pull(`/quicksilver/currency-detail/symbols/queryGuessing/${params}`);

// 获取币价走势信息
export const getTrendInfo = ({ symbol }) => {
  return pull(`/quicksilver/currency-detail/symbols/trend/${symbol}`);
};

// 获取临时币种K线
export const getNoLineCandles = (params) => {
  return pull(`/quicksilver/universe-currency/symbols/candles`, params);
};

// 获取未开售/临时币种价格数据
export const getNotSalePriceData = (symbol) => {
  return pull(`/quicksilver/universe-currency/notSale/priceData/${symbol}`);
};
