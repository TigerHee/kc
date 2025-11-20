/**
 * Owner: charles.yang@kupotech.com
 */
import { useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'dva';

import { getState } from 'helper';
import { isEqual, get } from 'lodash';
import { getStore } from 'src/utils/createApp';

import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

// 获取合约开通状态
export const useGetUserOpenFutures = () => {
  return useSelector((state) => state.openFutures.openContract);
};
// 获取合约开通状态
export const getUserOpenFutures = () => {
  return getStore().getState()?.openFutures?.openContract;
};
// 获取合约的偏好设置权限
export const useGetUserFuturesPermissions = ({ type }) => {
  const webNoticeConfig = useSelector((state) => state.futuresSetting.webNoticeConfig) || [];
  const confirmConfig = useSelector((state) => state.futuresSetting.confirmConfig) || [];
  return [...webNoticeConfig, ...confirmConfig].includes(type);
};
// 获取合约的偏好设置权限
export const getUserFuturesPermissions = ({ type }) => {
  const webNoticeConfig = getStore().getState()?.futuresSetting.webNoticeConfig || [];
  const confirmConfig = getStore().getState()?.futuresSetting.confirmConfig || [];
  return [...webNoticeConfig, ...confirmConfig].includes(type);
};

// 获取本地存储的偏好设置值
export const useGetLocalSetting = () => {
  const retentionData = useSelector((state) => state.futuresSetting.retentionData);
  const confirmModal = useSelector((state) => state.futuresSetting.confirmModal);

  return {
    retentionData,
    confirmModal,
  };
};

// 设置本地存储的偏好设置值
export const useSetLocalSetting = () => {
  const dispatch = useDispatch();

  const onSetLocalSetting = useCallback(
    (type, visible) => {
      dispatch({
        type: 'futuresSetting/updateLocalSetting',
        payload: {
          type,
          status: visible,
        },
      });
    },
    [dispatch],
  );

  return onSetLocalSetting;
};

/**
 * 获取用户费率
 * @returns
 */
export const useUserFee = (key) => {
  const info = useSelector((state) => {
    const { takerFeeRate, fixTakerFee } = state.futuresCommon;
    return { takerFeeRate, fixTakerFee };
  }, isEqual);
  return info;
};

/**
 * 静态获取userFee， takerFeeRate, fixTakerFee
 */
export const getUserFee = () => {
  const mainState = getStore().getState().futuresCommon || {};
  const { takerFeeRate, fixTakerFee } = mainState;
  return {
    takerFeeRate,
    fixTakerFee,
  };
};

// 获取用户最大杠杆
export const useUserMaxLeverage = (switchTrialFund) => {
  const userMaxLeverage = useSelector((state) => state.futuresCommon.userMaxLeverage);
  const trialFundUserMaxLeverage = useSelector(
    (state) => state.futuresCommon.trialFundUserMaxLeverage,
  );

  // 判断是否开启体验金
  const maxLeverage = useMemo(() => {
    if (switchTrialFund) {
      return trialFundUserMaxLeverage;
    }
    return userMaxLeverage;
  }, [switchTrialFund, trialFundUserMaxLeverage, userMaxLeverage]);

  return maxLeverage;
};

// 返回低频 maxLeverage
export const getUserMaxLeverage = (switchTrialFund) => {
  const globalState = getStore().getState();
  const userMaxLeverage = get(globalState, 'futuresCommon.userMaxLeverage');
  const trialFundUserMaxLeverage = get(globalState, 'futuresCommon.trialFundUserMaxLeverage');

  // 判断是否开启体验金
  if (switchTrialFund) {
    return trialFundUserMaxLeverage;
  }
  return userMaxLeverage;
};

const emptyObject = {};
// 获取用户风险限额
export const useRiskLimit = () => {
  const userRiskLimit = useSelector((state) => state.futuresSetting.userRiskLimit) || emptyObject;
  const riskLimits = useSelector((state) => state.futuresSetting.riskLimits) || [];

  return {
    userRiskLimit,
    riskLimits,
  };
};

// 风险限额请求
export const useGetRiskLimit = () => {
  const dispatch = useDispatch();

  const getRiskLimit = useCallback(
    (symbol) => {
      if (symbol && !isSpotTypeSymbol(symbol)) {
        dispatch({
          type: 'futuresSetting/getUserRiskLimit',
          payload: { symbol },
        });
        dispatch({
          type: 'futuresSetting/getRiskLimits',
          payload: symbol,
        });
      }
    },
    [dispatch],
  );

  return getRiskLimit;
};

// 操作风险限额
export const useOperatorRiskLimit = () => {
  const dispatch = useDispatch();

  const operatorRiskLimit = useCallback(
    async ({ level, symbol, bizNo }) => {
      return dispatch({
        type: 'futuresSetting/postChangeRiskLimit',
        payload: { level, symbol, bizNo },
      });
    },
    [dispatch],
  );

  return operatorRiskLimit;
};

// 低频更新
export const getRiskLimit = () => {
  const userRiskLimit = getState((state) => state.futuresSetting.userRiskLimit) || emptyObject;
  const riskLimits = getState((state) => state.futuresSetting.riskLimits) || [];

  return {
    userRiskLimit,
    riskLimits,
  };
};

export const useGetKycInfo = () => {
  return useSelector((state) => state.futuresCommon.kycInfo);
};
