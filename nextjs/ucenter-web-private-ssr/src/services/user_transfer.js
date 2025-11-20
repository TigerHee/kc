/**
 * Owner: eli@kupotech.com
 */
import { post, postJson, pull } from 'tools/request';
// import { pullWrapper } from 'utils/pullCache';

// const pull = pullWrapper(originPull);

// const prefix = '/siteTransfer';
// /siteTransfer/web/siteTransfer/queryTransferStatus
// 获取用户迁移信息
{
  /**
  response:
  {
    "canTransfer": true,
    "originalSiteType": "global",
    "targetSiteType": "eu",
    "targetRegion": "US"
  }
*/
}

// 查询用户迁移信息
export async function pullUserCanTransfer() {
  return post('/user-dismiss-front/web/siteTransfer/queryUserCanTransfer');
}

// 查询用户迁移信息(灰度版)
export async function getUserTransferNotice(params = {}) {
  return post('/user-dismiss-front/web/siteTransfer/userTransferNotice', params);
}

// 查询迁移状态
export async function pullTransferStatus(targetSiteType) {
  const params = !!targetSiteType ? { targetSiteType } : {};
  return post('/user-dismiss-front/web/siteTransfer/queryTransferStatus', params);
}

// 查询迁移阻塞信息
export const queryTransferBlockingInfo = (params) => {
  return postJson('/user-dismiss-front/web/siteTransfer/queryTransferBlockingInfo', params);
  // return post(`/user-dismiss-front/web/siteTransfer/queryTransferBlockingInfo`, params);
};

// 查询迁移活动
export const queryTransferActivity = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/queryCampaign', params);
};

// 查询机器人、跟单、理财订单
export const queryTransferRobotCopyTradingEarn = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/queryCloudxCopyTradingEarn', params);
};

// 查询交易委托单
export const queryTransferBizOrders = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/queryBizOrders', params);
  // return post(
  //   `http://10.40.81.28:10240/web/siteTransfer/queryBizOrders`,
  //   params,
  // );
};

// 查询交易仓位
export const queryTransferBizPosition = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/queryBizPosition', params);
};

// 查询失效的卡券
export const queryTransferInvalidVoucher = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/queryVoucher', params);
};

// 查询资产
export const queryTransferAsset = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/queryAsset', params);
};

/* 一键处理 */
// 一键撤销合约、现货、杠杆等业务订单
export const closeBizOrders = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/closeBizOrders', params);
};

// 一键处理合约、杠杆等业务的仓位
export const closeBizPosition = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/closeBizPosition', params);
};

// 一键关闭机器人、跟单、理财订单
export const closeCloudxCopyTradingEarn = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/closeCloudxCopyTradingEarn', params);
};

// 失效卡券
export const expireVoucher = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/expireVoucher', params);
};

// 一键退出活动
export const quiteCampaign = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/quiteCampaign', params);
};

// 提交站点申请
export const submitSiteTransfer = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/submit', params);
};

/**
 * 提交写顶飘逻辑
 * @returns Promise<{
 *  data: false | true
 * }>
 */
export const writeDisplayed = () => {
  return post('/user-dismiss-front/web/siteTransfer/writeDisplayed', {});
};
/* ---------- */

/**
 * 获取用户资产填报信息
 */
export const queryUserAssetCost = (params) => {
  return pull('/user-dismiss-front/web/siteTransfer/queryUserAssetCost', params);
};

/**
 * 资产填报提交接口
 */
export const addUserAssetCost = (params) => {
  return post('/user-dismiss-front/web/siteTransfer/addUserAssetCost', params, false, true);
};
