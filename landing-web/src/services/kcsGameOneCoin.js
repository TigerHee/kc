/**
 * Owner: jesse.shao@kupotech.com
 */
/*
 * @Author: Chrise
 * @Date: 2021-08-10 10:26:12
 * @FilePath: /landing-web/src/services/kcsGameOneCoin.js
 */
import { post, pull } from 'utils/request';

const prefix = '/points-center';

// 获取首页Banner
export async function getBannerList(params = {}) {
  return pull(prefix + '/game/banner/list', params);
}

// 获取活动列表 - h5
export async function getProductList(params) {
  return pull(prefix + '/game/hunt/page', params);
}

// 获取活动列表 - web
export async function getProductListForWeb(params) {
  return pull(prefix + '/game/hunt/web/page', params);
}

// 获取参与记录 - h5
export async function getJoinRecord(id, params) {
  return pull(`${prefix}/game/hunt/order/page/${id}`, params);
}

// 获取参与记录 - web
export async function getJoinRecordForWeb(id, params) {
  return pull(`${prefix}/game/hunt/order/web/page/${id}`, params);
}

// 我的记录 - h5
export async function getMyRecord(params) {
  return pull(`${prefix}/game/hunt/sign/page`, params);
}

// 我的中奖记录 - h5
export async function getMyWinRecord(params) {
  return pull(`${prefix}/game/hunt/winSign/page`, params);
}

// 我的记录 - web
export async function getMyRecordForWeb(params) {
  return pull(`${prefix}/game/hunt/sign/web/page`, params);
}

// 我的中奖记录 - web
export async function getMyWinRecordForWeb(params) {
  return pull(`${prefix}/game/hunt/winSign/web/page`, params);
}

// 我的中奖记录
export async function getMyCarveRecord(params) {
  return pull(`${prefix}/game/carve/sign/page`, params);
}

// 获取热推活动
export async function getHotProduct(params) {
  return pull(prefix + '/game/hunt/recommend-list', params);
}

// 获取热推活动
export async function getHotProductForWeb(params) {
  return pull(prefix + '/game/hunt/web/recommend-list', params);
}

// 获取活动详情
export async function getProductDetail(params) {
  return pull(`${prefix}/game/hunt/detail/${params.id}`);
}

// 获取幸运播报
export async function getBroadcastList(params) {
  return pull(`${prefix}/game/broadcast/list`, params);
}

// 根据夺宝id查询我买的夺宝码
export async function getMyHuntCodeByHuntId(params) {
  return pull(`${prefix}/game/hunt/code-list/${params.huntId}`);
}

export async function getCheckLimitCountry() {
  return pull(`${prefix}/limit/country`);
}

export async function getCheckLimitLang() {
  return pull(`${prefix}/limit/lang`);
}

// 下单
export async function creatOrder(params) {
  return post(`${prefix}/game/hunt`, params, false, true);
}

// 获取币币用户余额(余额大于0.01)
export async function queryTradeAccount() {
  return pull(`/account-front/query/trade-account?baseCurrency=USDT&baseAmount=0`);
}

// 我的记录
export async function getRank() {
  return pull(`${prefix}/game/hunt/ranking/list`);
}

// 一币夺宝 - 更多夺宝
export async function getMoreHunt(id) {
  return pull(`${prefix}/game/more/hunt/page/${id}`);
}

// 幸运100 - 待开启活动分页
export async function getWaitOpenList(params) {
  return pull(`${prefix}/game/stay/guardian/page`, params);
}

// 幸运100 - 开启星盘
export async function openAstrolabe(params) {
  return post(`${prefix}/game/guardian/draw`, params, false, true);
}

// 幸运100 - 用户开奖商品列表
export async function getDrawList(orderId) {
  return pull(`${prefix}/game/guardian/draw/list/${orderId}`);
}
// 幸运100 - 活动列表分页
export async function getGuardianPage(params) {
  return pull(`${prefix}/game/guardian/page`, params);
}
// 幸运100 -  guardian star活动详情
export async function getGuardianDetail(params) {
  return pull(`${prefix}/game/guardian/detail/${params.id}`);
}
//幸运100 - 获取播报
export async function getGuardianBroadcastList(params) {
  return pull(`${prefix}/game/guardian/broadcast/list`, params);
}
//幸运100 - 获取带开启数量
export async function getGuardianStaySize(params) {
  return pull(`${prefix}/game/stay/guardian/size`, params);
}
//幸运100 - 抽奖
export async function guardianLottery(params) {
  return post(`${prefix}/game/guardian/lottery`, params, false, true);
}

// 幸运100 -  guardian star排行榜
export async function getGuardianRanking(id) {
  return pull(`${prefix}/game/guardian/ranking/list/${id}`);
}

// 幸运100 -  guardian 参与记录
export async function getGuardianSignPage(id, params) {
  return pull(`${prefix}/game/guardian/sign/page/${id}`, params);
}
//幸运100 - 我的背包
export async function getGuardianBackpack(params) {
  return pull(`${prefix}/game/guardian/user/page/backpack`, params);
}

// 幸运100 - 回收
export async function recoverNft(params) {
  return post(`${prefix}/game/guardian/recover`, params, false, true);
}

// 一币夺宝 - 瓜分奖 - 瓜分奖列表
export async function getCarveUpList() {
  return pull(`${prefix}/game/carve/list`);
}

// 一币夺宝 - 瓜分奖 - 瓜分奖详情
export async function getCarveUpDetail(id) {
  return pull(`${prefix}/game/carve/detail/${id}`);
}

// 一币夺宝 - 瓜分奖 - 排行榜
export async function getCarveRank(id) {
  return pull(`${prefix}/game/carve/rank/${id}`);
}

// 一币夺宝 - 瓜分奖 - 更多夺宝活动
export async function getMoreCarveHuntList() {
  return pull(`${prefix}/game/carve/more/hunt`);
}

// 老虎机 - 老虎机列表
export async function getSlotList(params) {
  return pull(`${prefix}/game/slot/page`, params);
}

// 老虎机 - 老虎机奖励列表
export async function getSlotPrizeList(id, params) {
  return pull(`${prefix}/game/slot/award/page/${id}`, params);
}

// 老虎机 - 老虎机详情
export async function getSlotDetail(id) {
  return pull(`${prefix}/game/slot/detail/${id}`);
}

// 老虎机 - 下单
export async function slotDream(params) {
  return post(`${prefix}/game/slot/dream`, params, false, true);
}

// 代币 - 余额查询
export async function getDiamondBalance() {
  return pull(`${prefix}/diamond/query/balance`);
}

// 代币 - 待领取列表
export async function getDiamondGiftList() {
  return pull(`${prefix}/diamond/gift/list`);
}

// 代币 - 用户领取代币
export async function drawDiamondGift(params) {
  return post(`${prefix}/diamond/gift/draw`, params, false, true);
}

// 代币 - 代币充值
export async function rechargeDiamond(params) {
  return post(`${prefix}/v2/diamond/recharge`, params, false, true);
}

// 代币 - 钻石明细
export async function getDiamondDetailList(params) {
  return pull(`${prefix}/diamond/page/bill`, params);
}

// 代币 - 兑换
export async function sellDiamond(params) {
  return post(`${prefix}/diamond/exchange/digiccy`, params, false, true);
}

// 代币 - 余额查询
export async function getDiamondRate() {
  return pull(`${prefix}/diamond/query/rate`);
}

// 用户回馈活动 - 转盘奖品list
export async function getFeedbackDetail() {
  return pull(`${prefix}/game/feedback/detail`);
}
// 用户回馈活动 - 剩余抽奖次数
export async function getFeedbackLottery() {
  return pull(`${prefix}/game/feedback/lottery/count`);
}

// 用户回馈活动 - 用户回馈活动play
export async function playFeedback(params) {
  return post(`${prefix}/game/feedback/play`, params, false, true);
}
// 回馈活动 - 中奖记录
export async function getFeedbackWinRecord(params) {
  return pull(`${prefix}/game/feedback/win/page`, params);
}

// 用户回馈活动 - 转盘奖品list
export async function getFeedbackBroadcast() {
  return pull(`${prefix}/game/feedback/slideshow`);
}
// 代币 - 充值套餐列表
export async function getDiamondRecharge() {
  return pull(`${prefix}/diamond/recharge/query`);
}

// 彩票 - 获取活动
export async function getLotteryInfo() {
  return pull(`${prefix}/game/lottery/get`);
}

// 彩票 - 获取活动
export async function getLotteryPoolAmount() {
  return pull(`${prefix}/game/lottery/pool-amount`);
}

// 彩票 - 购买
export async function buyLottery(params) {
  return post(`${prefix}/game/lottery/buy`, params, false, true);
}

// 彩票 - 用户购彩历史记录
export async function lotteryBuyRecord(params) {
  return pull(`${prefix}/game/lottery/buy/record`, params);
}
// 彩票 - 用户购彩历史记录详情
export async function lotteryBuyRecordDetails(params) {
  return pull(`${prefix}/game/lottery/buy/record/details`, params);
}

// 彩票 - 开奖历史记录
export async function lotteryDrawRecord(params) {
  return pull(`${prefix}/game/lottery/draw/record`, params);
}

// 彩票 - 规则
export async function getLotteryDetail() {
  return pull(`${prefix}/game/lottery/detail`);
}

// 代币 - 获取用户token
export async function getUserToken() {
  return pull(`${prefix}/auth/user`);
}
