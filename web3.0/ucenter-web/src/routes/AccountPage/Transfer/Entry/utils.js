/**
 * Owner: eli@kupotech.com
 */

import * as serv from 'services/user_transfer';
import { addLangToPath } from 'src/tools/i18n';
import { getOriginSiteType } from '../utils/site';
import { GUIDE_LINK_MAP, LINK_TYPE, PRIVACY_LINK_MAP, TERMS_LINK_MAP } from './constants';

// 分批调用接口的参数
// 1）otc、kucard、kucoinPay、thirdParty、freezeFunds
// 2）payment、greyMarket、cryptoAssets、financial
// 3）migration
// 4）optionPosition

const batchStatTypeList = [
  ['otc', 'kucoinPay', 'thirdParty', 'ucenter'],
  ['financial', 'freezeFunds', 'kyc', 'cloudMining'],
  ['payment', 'cryptoAssets', 'kucard'],
  ['greyMarket'],
  ['migration'],
  ['optionPosition'],
];

export async function batchFetchBlockingInfo(userTransferInfo) {
  const blockingInfos = await Promise.all(
    batchStatTypeList.map(async (statType) => {
      const { data } = await serv.queryTransferBlockingInfo({
        targetSiteType: userTransferInfo?.targetSiteType,
        statTypeList: statType,
      });
      return data;
    }),
  );
  return blockingInfos;
}

export function checkBlockingInfo(blockingInfos) {
  return (
    blockingInfos?.some((blockingInfo) => {
      const entries = Object.entries(blockingInfo);

      return entries.some(([key, value]) => {
        if (Array.isArray(value) && value.length) return true;
        if (key === 'freezeFunds' && value) return true;
        if (key === 'userBindInfo' && (value?.needBindEmail || value?.needBindPhoneNo)) {
          return true;
        }
        if (key === 'kycBlockingInfo' && value?.needCompletionKycInfo) {
          return true;
        }
        return false;
      });
    }) || false
  );
}

// 法币充提订单的字段
const FaitCurrencyOrderType = ['fait_currency_recharge', 'fait_currency_withdraw'];
// 加密货币充提订单的字段
const CryptoCurrencyOrderType = ['crypto_assets_recharge', 'crypto_assets_withdraw'];
// 后端数据映射为前端状态数据
export function blockingsInfoToState(blockingInfos) {
  const accountBlockingInfo = [];
  const financialBlockingInfo = [];
  const assetBlockingInfo = [];
  const tradeBlockingInfo = [];
  const fiatBlockingInfo = [];
  const cryptoBlockingInfo = [];
  let kycBlockingInfo = {};
  let userBindInfo = {};

  blockingInfos?.forEach((blockingInfo) => {
    if (blockingInfo) {
      const {
        accountInfoList,
        financialProductsList,
        freezeFunds,
        merchantInfoList,
        orderInfoList,
      } = blockingInfo;
      if (blockingInfo.kycBlockingInfo) {
        kycBlockingInfo = blockingInfo.kycBlockingInfo;
      }
      if (blockingInfo.userBindInfo) {
        userBindInfo = blockingInfo.userBindInfo;
      }
      // 账户
      if (accountInfoList?.length > 0) {
        accountBlockingInfo.push(...accountInfoList);
        console.log('accountInfoList accountInfoList:', accountInfoList);
      }
      // 理财产品
      if (financialProductsList?.length > 0) {
        financialBlockingInfo.push(...financialProductsList);
        console.log('financialProductsList financialProductsList:', financialProductsList);
      }
      // 冻结资金
      if (freezeFunds) {
        assetBlockingInfo.push({
          ...freezeFunds,
          count: freezeFunds?.noSupportCurrencies?.length || 0,
        });
        console.log('freezeFunds freezeFunds:', freezeFunds);
      }
      // 商户信息
      if (merchantInfoList?.length > 0) {
        accountBlockingInfo.push(
          ...merchantInfoList.map((item) => ({
            ...item,
            accountType: item.merchantType,
          })),
        );
        console.log('merchantInfoList merchantInfoList:', merchantInfoList);
      }
      if (orderInfoList?.length > 0) {
        orderInfoList.forEach((item) => {
          if (FaitCurrencyOrderType.includes(item.orderType)) {
            fiatBlockingInfo.push(item);
          } else if (CryptoCurrencyOrderType.includes(item.orderType)) {
            cryptoBlockingInfo.push(item);
          } else {
            tradeBlockingInfo.push(item);
          }
        });
        console.log('orderInfoList orderInfoList:', orderInfoList);
      }
    }
  });

  return {
    accountBlockingInfo,
    financialBlockingInfo,
    assetBlockingInfo,
    tradeBlockingInfo,
    fiatBlockingInfo,
    cryptoBlockingInfo,
    kycBlockingInfo,
    userBindInfo,
  };
}

/**
 * 获取跳转的链接内容
 * @param {*} type
 * @param {*} targetSiteType
 * @returns
 */
export const getLinkURL = (type, targetSiteType) => {
  if (!type || !targetSiteType) {
    return '';
  }
  let result = '';
  const typeSite = targetSiteType.toLowerCase();
  const originalSiteType = getOriginSiteType()?.toLowerCase();
  if (type === LINK_TYPE.GUIDE) {
    result = GUIDE_LINK_MAP[originalSiteType]?.[typeSite] || '';
  }
  if (type === LINK_TYPE.PRIVACY) {
    result = PRIVACY_LINK_MAP[originalSiteType]?.[typeSite] || '';
  }
  if (type === LINK_TYPE.TERMS) {
    result = TERMS_LINK_MAP[originalSiteType]?.[typeSite] || '';
  }

  return addLangToPath(result);
};
