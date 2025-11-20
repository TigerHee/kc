/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import { post, pull } from 'tools/request';

const prefix = '/intelligent-service';

// 自助服务不完全登陆
export function login(param) {
  return post(`/ucenter/aggregate-login`, param);
}

// 不完全登陆下的账户是否绑定手机号和谷歌等
export function getAccountInfo(param) {
  return post(`/ucenter/user/halflogin-info`, param);
}

// 查询充值未到账原因配置
export const getReasonConfig = () => {
  // 老接口
  // return pull(`${prefix}/dictionary/query`, { businessType: 'ASSERT_REFUND_TYPE' });
  // 新接口
  return pull(`${prefix}/dictionary/view`, { businessType: 'ASSERT_REFUND_TYPE' });
};

// 查询充值未到账原因历史申请记录
export const getReasonRecords = (params) => {
  return post(`${prefix}/assets/refund/history`, params, false, true);
};

// 申请校验接口
export const checkForm = (params) => {
  return post(`${prefix}/assets/refund/apply/check`, params, false, true);
};

// 提交充值未到账申请
export const submitApply = (params) => {
  return post(`${prefix}/assets/refund/apply`, params, false, true);
};

// 上传附件
export const uploadImg = (params) => {
  return post(`${prefix}/file/apply/unload`, params);
};

// 根据附件id 查询图片url
export const getImgurls = (params) => {
  return post(`${prefix}/file/query/url`, params, false, true);
};

// 获取充值未到账支持的币种
export const getCurrency = (params) => {
  return pull(`${prefix}/assets/refund/currency`, params);
};

// 取消申请
export const cancelApply = (params) => {
  return post(`${prefix}/assets/refund/cancel`, params, false, true);
};

// 缴纳手续费
export const payFee = (params) => {
  return post(`${prefix}/assets/refund/pay/fee`, params, false, true);
};

// 获取充值未到账的配置
export const getConfig = (params) => {
  // 老接口
  // return pull(`${prefix}/config/query/easy/kvConfig`, params);
  // 新接口
  return pull(`${prefix}/config/query/entrance/config`, params);
};

// 查询充值未到账的币种特别说明
export const getCoinDes = (params) => {
  return pull(`${prefix}/assets/refund/special/desc`, params);
};

/**
 * 获取空气币支持链，默认 AIR_COIN
 * @param {{
 *  type?: string
 * }} params
 */
export const getAirCoinChain = (params) => {
  return pull(`${prefix}/assets/refund/airCoinChain`, {
    type: 'AIR_COIN',
    ...params,
  });
};
