/**
 * Owner: willen@kupotech.com
 */
import { pull as Opull, post as Opost } from 'tools/request';

const profix = '/payment';
const AccountFrontPrefix = '/account-front';
const convertPrefix = '/speedy';
const pull = (url, data, _prefix) => {
  return Opull(`${_prefix || profix}${url}`, data);
};

const post = (url, data, _prefix) => {
  return Opost(`${_prefix || profix}${url}`, data);
};
/**
 * 获取提币记录列表
 * @param {*} param0
 */
export async function getWithdrawList({ currency, pageNum = 1, pageSize = 12 }) {
  return pull('/withdraw/list/v2', {
    currency,
    currentPage: pageNum,
    pageSize,
  });
}

/**
 *
 * 获取最近提现的币种
 */
export async function getRecentWithdrawCoins() {
  return pull('/withdraw/recent-currency-list');
}

/**
 * 取消提现
 * @param {} param0
 */
export async function cancelWithdraw({ withdrawId, remark }) {
  return post('/withdraw/cancel', {
    withdrawId,
    remark,
  });
}

/**
 * 获取用户提现配额
 * @param {*} currency  币种
 * @param {*} isInner   是否是站内地址
 */
export async function getUserQuota(query) {
  return pull('/withdraw/quota', query);
}

/**
 * 用户提现限额预校验
 * 依据用户kyc等级、国家类型、是否新老用户、端、app版本获取当前用户的提现额度
 * 如果提现额度为0，则添加对应的额度为0的原因code 前端根据额度为0拦截提现流程
 */

export async function getSimpleQuota(query) {
  return pull('/simple/withdraw/quota', query);
}

/**
 * 获取用户某币种下，所有链的提现配额
 * @param {*} query
 * @returns
 */
export async function getUserQuotaList(query) {
  return pull('/withdraw/fee', query);
}

/**
 *
 * 查询用户单个currency指定accountType、tag的账户信息
 * @param accountType
 * @param currency
 * @returns {Promise<void>}
 */
export async function getAccountCoinInfo({ accountType, currency, tag = 'DEFAULT' }) {
  return post(
    '/query/currency-balance',
    {
      accountType,
      currency,
      tag,
    },
    AccountFrontPrefix,
  );
}

/**
 * 申请提币
 *
 * @param address
 * @param amount
 * @param currency
 * @param isInner
 * @param number
 * @param remark
 * @param securityId 防伪图片标识id
 * @param verificationCode 6位验证码
 * @returns {Promise<void>}
 */
export async function withdrawCoin(params) {
  return post('/withdraw/apply', {
    ...params,
    client: 'WEB',
  });
}

// 通过发票提起提现，入参和 /withdraw/apply 相同
export async function withdrawCoinByInvoice({
  address,
  receivedAmount,
  currency,
  remark,
  securityId,
  chainId,
  accountTypeList,
  feeDeductType,
}) {
  return post(
    '/withdraw/apply',
    {
      currency,
      chainId,
      invoice: address,
      receivedAmount,
      remark,
      client: 'WEB',
      securityId,
      accountTypeList,
      feeDeductType,
    },
    '/payment-invoice',
  );
}

/**
 *  获取收藏钱包地址列表
 * @param coin
 * @returns {Promise<void>}
 */
export async function getWalletAddr(currency) {
  return pull('/withdraw-address/get', { currency }, '/payment');
}

/**
 * 获取收藏地址列表（普通地址、通用地址）
 * @param {*} currency
 */
export async function getFavAddr(currency) {
  return pull(`/withdraw-address/list`, { currency });
}

/**
 * 添加常用地址
 * @param address
 * @param coin
 * @param name
 * @returns {Promise<void>}
 */
export async function addWalletAddr(wallets, coin, type) {
  const formData = new FormData();

  wallets?.forEach((w, idx) => {
    formData.append(`address[${idx}].address`, w.address);
    formData.append(`address[${idx}].remark`, w.name);
    formData.append(`address[${idx}].memo`, w.memo);
    formData.append(`address[${idx}].chainId`, w.chainId);
  });
  if (coin) {
    formData.append('currency', coin);
  }
  formData.append('type', type);

  return post('/withdraw-address/add', formData, '/payment');
}

/**
 * 删除钱包地址
 * @param id
 * @returns {Promise<void>}
 */
export async function removeWalletAddr(ids) {
  return post(
    '/withdraw-address/delete',
    {
      ids,
    },
    '/payment',
  );
}

export async function getWithdrawFrozonTime() {
  return pull(
    '/user/forbidden/time-remaining',
    {
      operation: 'WITHDRAW',
    },
    '/ucenter',
  );
}

/**
 *
 * 检查提现地址
 * @param {*} address
 * @param {*} currency
 */
export async function checkIfInnerAddr({ address, currency, memo = '', ...rest }) {
  return pull('/withdraw-address/validate/v2', {
    address,
    currency,
    memo,
    ...rest,
  });
}

/**
 *
 * 检查提现地址v3,新增返回favoriteAddressId
 * @param {*} address
 * @param {*} currency
 */
export async function checkIfInnerAddrV3({ address, currency, memo = '', ...rest }) {
  return pull('/withdraw-address/validate/v3', {
    address,
    currency,
    memo,
    ...rest,
  });
}

/**
 *
 * 校验通用提现地址
 * @param {*} address
 */
export async function checkUniversalAddr({ address, memo = '', ...rest }) {
  return pull('/withdraw-address/universal-address/validate', {
    address,
    memo,
    ...rest,
  });
}

/**
 * 获取提币手续费折扣
 *
 * @param   {[type]}  {   getSafeImg      [{ description]
 * @param   {[type]}  address   [address description]
 * @param   {[type]}  memo      [memo description]
 * @param   {[type]}  currency  [currency description]
 * @param   {[type]}  }         [ description]}
 *
 * @return  {[type]}            [return description]
 */
export async function getWithdrawDiscount({ address, memo, currency }) {
  return pull('/fee-discount/get', {
    address,
    memo,
    currency,
  });
}

// 获取提币安全确认图片
export async function getSafeImg({ address, amount, memo, currency }) {
  return pull('/withdraw/safe-img', {
    address,
    amount,
    memo,
    currency,
    width: 800,
    fontSize: 34,
  });
}

/**
 * 获取当前用户杠杆交易的仓位状态与协议状态
 */
export async function getUserMarginPostion() {
  return Opull('/margin-position/position/status');
}

/**
 * 获取提现风控提示
 * 新用户注册一周内，没有进行币币交易和合约交易，如当天买币且当天单笔提币金额达到折合价值5万RMB的
 */
export async function getWithdrawToast() {
  return Opull('/kucoin-web-front/black-group/withdraw');
}

/**
 * 获取提币二次确认弹窗内容
 */
export async function getConfirmPrompt(params) {
  return pull('/withdraw/info-confirm', params);
}

// 获得提币详情按钮是否可以可以取消
export function getWithdrawInfo(params) {
  return pull(`/v2/withdraw/get`, params);
}

// 获取反算后的金额等
export function getFeeAndAmount(params) {
  return Opost(`/payment/withdraw/fee-and-amount/get`, params, false, true);
}
