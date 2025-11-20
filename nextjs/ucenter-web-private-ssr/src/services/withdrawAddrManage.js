/**
 * Owner: willen@kupotech.com
 */
import { map } from 'lodash-es';
import { post as Opost, pull as Opull } from 'tools/request';
// import { isPrimitive } from 'util';

const profix = '/payment';
// const AccountFrontPrefix = '/account-front';

const pull = (url, data, _prefix) => {
  return Opull(`${_prefix || profix}${url}`, data);
};

const post = (url, data, _prefix) => {
  return Opost(`${_prefix || profix}${url}`, data);
};

/**
 * 获取收藏的地址
 * @param {} param0
 */
export async function getFavoriteAddrs(params) {
  return pull('/favorite-address/get', params);
}

/**
 * 获取收藏联系人
 * @param {} param0
 */
export async function getFavoriteContacts(params) {
  return pull('/inner-withdraw-contract/page', params);
}

/**
 * 获取是否开启api常用地址提现功能
 */
export async function getAddrWhiteListEnable({ type = 'API_WITHDRAW' }) {
  return pull('/whitelist/get', {
    type,
  });
}

export async function updateAddrWhiteListEnable({ isEnabled, type }) {
  return post('/whitelist/update', {
    isEnabled,
    type,
  });
}

export async function getContactList(params) {
  return pull('/inner-withdraw-contract/list', params);
}

export async function delContact(params) {
  return Opost(`${profix}/inner-withdraw-contract/batch-delete`, params, false, true);
}

export async function addContact(params) {
  return Opost(`${profix}/inner-withdraw-contract/batch-add`, params, false, true);
}

/**
 * 开启提现白名单
 *
 * @return  {[type]}  [return description]
 */
export async function enableApiWhiteList({ type }) {
  return post('/whitelist/enable', {
    type,
  });
}

/**
 * 添加收藏地址（普通地址、通用地址）前置校验
 * @param {*} params
 */
export async function addrPreValidate({ currency, type, address } = {}) {
  const params = {
    type,
  };
  if (currency) {
    params.currency = currency;
  }
  params.address = map(address, (w) => {
    return {
      address: w.address,
      remark: w.name,
      memo: w.memo,
      chainId: w.chainId,
    };
  });
  return Opost(`${profix}/withdraw-address/add-address/pre-validate`, params, false, true);
}
