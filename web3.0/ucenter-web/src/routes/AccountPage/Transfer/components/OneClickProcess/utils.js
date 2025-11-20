/**
 * Owner: john.zhang@kupotech.com
 */

import {
  queryTransferActivity,
  queryTransferAsset,
  queryTransferBizOrders,
  queryTransferBizPosition,
  queryTransferInvalidVoucher,
  queryTransferRobotCopyTradingEarn,
} from 'src/services/user_transfer';
import { _t } from 'src/tools/i18n';
import {
  CAN_RESOLVE_STATUS,
  DEFAULT_ONE_CLICK_PROGRESS,
  DONE_STATUS,
  FORBID_STATUS,
  RESOLVING_STATUS,
  SKIP_STATUS,
} from './constants';

/**
 * 判断卡片是否已经完成
 * @param {Object} data
 */
export const isDone = (data) => {
  if (!data) {
    return false;
  }
  const values = Object.values(data);
  // 如果所有值都是空数组，则认为已完成
  return values.every((value) => !value?.length);
};

export const getStatus = (progress, curOrderIndex, remoteData) => {
  if (!remoteData) return FORBID_STATUS;

  const preStatus = getLastCardStatus(curOrderIndex, progress);
  const curStatus = progress[curOrderIndex];

  if (preStatus === DONE_STATUS || preStatus === SKIP_STATUS) {
    if (isDone(remoteData)) return DONE_STATUS;
    else if (curStatus !== RESOLVING_STATUS) return CAN_RESOLVE_STATUS;
    else return curStatus;
  }
  return FORBID_STATUS;
};

/**
 * 前端本地维护的一键处理请求异常错误码
 */
export const ONE_CLICK_REQUEST_ERROR_CODE = -10;

/**
 * 用于返回一键处理请求异常时返回的对象，方便统一处理
 */
export const getFormatCommonError = () => {
  return {
    errorCode: ONE_CLICK_REQUEST_ERROR_CODE,
    message: _t('4ab24c06e7c04000a359'),
    data: null,
  };
};

/**
 * 获取一键处理的promise
 * @param {*} request
 * @param {*} params
 */
export const getOneClickWrapperPromise = async (request, params, formatData = null) => {
  const promise = new Promise(async (res) => {
    try {
      const result = await request(params);
      if (typeof formatData === 'function') {
        res(formatData(result));
      } else {
        res(result);
      }
    } catch (error) {
      console.error('request error:', error);
      res(getFormatCommonError());
    }
  });

  return promise;
};

/**
 *
 * @param {*} targetSiteType
 * @param {*} originalSiteType
 * @returns {{Promise}}
 */
export const getOneClickPromiseList = (targetSiteType, originalSiteType) => {
  // step1: Activity
  const activityPromise = getOneClickWrapperPromise(queryTransferActivity, {
    targetSiteType,
    originalSiteType,
  });

  // step2: BotCard
  const botPromise = getOneClickWrapperPromise(
    queryTransferRobotCopyTradingEarn,
    {
      targetSiteType,
    },
    (res) => {
      const data = res?.data || {};
      let leadTrading = data.leadTrading;
      if (!Array.isArray(leadTrading)) {
        leadTrading = data.leadTrading?.nickName ? [data.leadTrading] : [];
      }

      return {
        ...res,
        data: { ...data, leadTrading },
      };
    },
  );

  // step3: TradingOrderCard
  const tradingOrderPromise = getOneClickWrapperPromise(queryTransferBizOrders, {
    targetSiteType,
  });

  // step4: OtherOrderCard
  const otherOrderPromise = getOneClickWrapperPromise(queryTransferBizPosition, {
    targetSiteType,
  });

  // step5: ExpiredCard
  const expiredPromise = getOneClickWrapperPromise(queryTransferInvalidVoucher, {
    targetSiteType,
    originalSiteType,
  });

  // step6: AssetCard
  const assetPromise = getOneClickWrapperPromise(queryTransferAsset, {
    targetSiteType,
    originalSiteType,
  });

  return [
    activityPromise,
    botPromise,
    tradingOrderPromise,
    otherOrderPromise,
    expiredPromise,
    assetPromise,
  ];
};

/**
 * 获取上一个模块的状态
 */
export const getLastCardStatus = (currentStepIndex = 0, progress = DEFAULT_ONE_CLICK_PROGRESS) => {
  let resultStatus = SKIP_STATUS;

  progress.forEach((status, index) => {
    if (status !== SKIP_STATUS && index < currentStepIndex) {
      resultStatus = status;
    }
  });

  return resultStatus;
};

/**
 * 获取当前卡片模块的下标
 */
export const getCurrentCardOrderIndex = (
  currentStepIndex = 0,
  progress = DEFAULT_ONE_CLICK_PROGRESS,
) => {
  let resultIndex = currentStepIndex;

  progress.forEach((status, index) => {
    if (status === SKIP_STATUS && index < currentStepIndex) {
      resultIndex -= 1;
    }
  });

  return resultIndex;
};

/**
 * 获取当前卡片模块的序号
 */
export const getCurrentCardOrderNumber = (
  currentStepIndex = 0,
  progress = DEFAULT_ONE_CLICK_PROGRESS,
) => {
  return getCurrentCardOrderIndex(currentStepIndex, progress) + 1;
};

/**
 * 检查是否全部模块都完成
 */

export const checkIsAllComplete = (progress = DEFAULT_ONE_CLICK_PROGRESS) => {
  return progress.every((status) => status === DONE_STATUS || status === SKIP_STATUS);
};
