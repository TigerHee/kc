/**
 * Owner: borden@kupotech.com
 */
import { pull as Opull, post as Opost } from 'utils/request';

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
    withdrawId, remark,
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
 *
 * 查询用户单个currency指定accountType、tag的账户信息
 * @param accountType
 * @param currency
 * @returns {Promise<void>}
 */
export async function getAccountCoinInfo({ accountType, currency, tag = 'DEFAULT' }) {
  return post('/query/currency-balance', {
    accountType,
    currency,
    tag,
  }, AccountFrontPrefix);
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
 * @returns {Promise<void>}
 */
export async function withdrawCoin({ address,
  amount, currency, isInner, number, remark, memo,
  isFavoriteAddress }) {
  return post('/withdraw/apply', {
    address, amount, currency, isInner, number, remark, isFavoriteAddress, memo,
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
  return post('/withdraw-address/delete', {
    ids,
  }, '/payment');
}

export async function getWithdrawFrozonTime() {
  return pull('/user/forbidden/time-remaining', {
    operation: 'WITHDRAW',
  }, '/ucenter');
}


/**
 *
 * 检查提现地址
 * @param {*} address
 * @param {*} currency
 */
export async function checkIfInnerAddr({ address, currency, memo = '' }) {
  return pull('/withdraw-address/validate', {
    address,
    currency,
    memo,
  });
}
