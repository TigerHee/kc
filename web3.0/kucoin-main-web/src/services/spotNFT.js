/**
 * Owner: willen@kupotech.com
 */
import { del, post, pull } from 'tools/request';

const prefix = '/spot-nft';
// 获取项目列表
export async function getProjectList(params) {
  return pull(`${prefix}/projects`, params);
}

// 获取项目
export async function getProject(params) {
  return pull(`${prefix}/projects/${params.id}`);
}

// 获取列表
export async function getCategories(params) {
  const { id, ...otherParams } = params;
  return pull(`${prefix}/distributes/${id}/categories`, otherParams);
}
// 通过其他参数获取列表
export async function getCategoriesUseOther(params) {
  return pull(`${prefix}/categories/page`, params);
}
// 获取具体的category
export async function pullCategoryDetail(params) {
  const { id } = params;
  return pull(`${prefix}/categories/${id}`);
}

// 获取具体的category  08-24 新的获取
export async function pullTokenCategoryDetail(params) {
  return pull(`${prefix}/token/distribute`, params);
}

// 查询用户相应币种可用资产
export async function getAvailable(params) {
  return pull(`${prefix}/account/available`, params);
}

// 购买
export async function buyCategory(params) {
  return post(`${prefix}/buy/normal`, params, false, true);
}

// 购买token
export async function buyToken(params) {
  const { distributeId, size } = params;
  return post(`${prefix}/buy/token?distributeId=${distributeId}&size=${size}`, {}, false, true);
}

// 获取拍卖列表接口
export async function getAuctionRecords(params) {
  return pull(`${prefix}/auction/offeringRecords`, params);
}

// 获取我的拍卖列表接口
export async function getMyAuctionRecords(params) {
  return pull(`${prefix}/auction/myOfferingRecords`, params);
}
// 拍卖出价
export async function auctionOffering(params) {
  return post(`${prefix}/auction/offeringPrice`, params, false, true);
}
// 取消出价
export async function cancelAuctionOffering(params) {
  return del(`${prefix}/auction/offeringPrice`, params);
}
// 获取实时价格
export async function getAuctionPrice(params) {
  return pull(`${prefix}/auction/info`, params);
}

// 获取distribute下指定下表范围的
export async function getDistributeOfferPrice(params) {
  return pull(`${prefix}/categories/offering-price`, params);
}

// 获取我的nft列表
export async function getMyNFTList(params) {
  return pull(`${prefix}/nft/me`, params);
}
// 获取我的盲盒列表
export async function getMysteryBoxList(params) {
  return pull(`${prefix}/nft/mystery-box`, params);
}
// 获取购买记录列表
export async function getTradeRecords(params) {
  return pull(`${prefix}/nft/trade`, params);
}
// 获取我的提币记录列表
export async function getWithDrawRecords(params) {
  return pull(`${prefix}/withdraw/list`, params);
}
// walletWxId时，获取完整浏览地址
export async function getWalletWxIdBrowserAddr(params) {
  return pull(`${prefix}/nft/browserAddress`, params);
}
// 开盲盒
export async function openMysteryBox(data) {
  return post(`${prefix}/nft/mystery-box`, data, false, true);
}

// 读取apollo 配置
export async function getNFTConfig() {
  return pull(`${prefix}/project/config`);
}
/**
 * 校验极验
 *
 * @returns {Object}
 */
export async function captchaValidate(data) {
  return post(`${prefix}/captcha/validate`, {
    ...data,
  });
}

/**
 * 人机校验按钮点击
 * @param {{
 *  distributeId: string,
 * }} params
 */
export async function captchaStartValidate(params) {
  const { distributeId } = params || {};
  return post(`${prefix}/buy/token/${distributeId}/btn-click`, {}, false, true);
}

// 查询集合页banner
export async function getMainBanner() {
  return pull(`${prefix}/banners`);
}

// 查询集合页pro
export async function getMainPro(params) {
  return pull(`${prefix}/projectRefs`, params);
}

// 查询集合页视频
export async function getMainVideo(params) {
  return pull(`${prefix}/videos`, params);
}

// 获取token介绍页配置
export async function pullTokenConfig() {
  return pull(`${prefix}/project/token/config`);
}

/**
 * 获取spot-nft  nft-token/intro 的配置信息
 */
export const getMainPageConf = () => {
  return pull(`${prefix}/token/main-page`);
};
