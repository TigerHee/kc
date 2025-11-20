/**
 * Owner: willen@kupotech.com
 */
import { pull as Opull, post as Opost } from 'tools/request';

const profix = '/payment';
const AccountFrontPrefix = '/account-front';

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
  return pull('/withdraw/list', {
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
export async function withdrawCoin({
  address,
  amount,
  currency,
  isInner,
  number,
  remark,
  memo,
  securityId,
  verificationCode,
  isFavoriteAddress,
  chainId,
}) {
  return post('/withdraw/apply', {
    address,
    amount,
    currency,
    isInner,
    number,
    remark,
    isFavoriteAddress,
    memo,
    securityId,
    verificationCode,
    client: 'WEB',
    chainId,
  });
}

/**
 *  获取钱包地址列表
 * @param coin
 * @returns {Promise<void>}
 */
export async function getWalletAddr(currency) {
  return pull('/withdraw-address/get', { currency }, '/payment');
}

/**
 * 添加常用地址
 * @param address
 * @param coin
 * @param name
 * @returns {Promise<void>}
 */
export async function addWalletAddr(wallets, coin) {
  const formData = new FormData();

  wallets.forEach((w, idx) => {
    formData.append(`address[${idx}].address`, w.address);
    formData.append(`address[${idx}].remark`, w.name);
    formData.append(`address[${idx}].memo`, w.memo);
    formData.append(`address[${idx}].chainId`, w.chainId);
  });
  formData.append('currency', coin);

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
export async function checkIfInnerAddr({ address, currency, memo = '' }) {
  return pull('/withdraw-address/validate/v2', {
    address,
    currency,
    memo,
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
