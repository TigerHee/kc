/**
 * Owner: garuda@kupotech.com
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getState } from 'helper';
import { get } from 'lodash';

import { getStore } from 'utils/createApp';
import storage from 'utils/storage';

import { useGetSymbolInfo, useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { MARGIN_MODE_CROSS } from '@/meta/futures';
import { useMarginMode } from '@/pages/Futures/components/MarginMode/hooks';

// 返回 是否存在体验金跟体验金切换的 function
export const useSwitchTrialFund = () => {
  const dispatch = useDispatch();
  const isHasTrialFund = useSelector((state) => state.futuresTrialFund.isHasTrialFund);
  const isAvailableTrialFund = useSelector((state) => state.futuresTrialFund.isAvailableTrialFund);
  const switchTrialFund = useSelector((state) => state.futuresTrialFund.switchTrialFund);

  const onSwitchTrialFund = useCallback(
    (visible) => {
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          switchTrialFund: visible,
        },
      });
      storage.setItem('switchTrialFund', visible);
    },
    [dispatch],
  );

  return { isHasTrialFund, isAvailableTrialFund, switchTrialFund, onSwitchTrialFund };
};

// 返回优惠券选择弹框
export const useTrialFundDialog = () => {
  const dispatch = useDispatch();

  const trialFundVisible = useSelector((state) => state.futuresTrialFund.trialFundVisible);

  const onTrialFundDialog = useCallback(
    (visible) => {
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          trialFundVisible: visible,
        },
      });
    },
    [dispatch],
  );

  return { trialFundVisible, onTrialFundDialog };
};

// 返回提示体验金激活弹框状态以及切换的 function
export const useTrialFundActivateDialog = () => {
  const dispatch = useDispatch();

  const trialFundActivateVisible = useSelector(
    (state) => state.futuresTrialFund.trialFundActivateVisible,
  );

  const onTrialFundActivateDialog = useCallback(
    (visible) => {
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          trialFundActivateVisible: visible,
        },
      });
    },
    [dispatch],
  );

  return { trialFundActivateVisible, onTrialFundActivateDialog };
};

// 返回保证金不足弹框状态以及切换的 function
export const useTrialFundInsufficientDialog = () => {
  const dispatch = useDispatch();

  const trialFundInsufficientVisible = useSelector(
    (state) => state.futuresTrialFund.trialFundInsufficientVisible,
  );

  const onTrialFundInsufficientDialog = useCallback(
    (visible) => {
      dispatch({
        type: 'futuresTrialFund/update',
        payload: {
          trialFundInsufficientVisible: visible,
        },
      });
    },
    [dispatch],
  );

  return { trialFundInsufficientVisible, onTrialFundInsufficientDialog };
};

const emptyObject = {};
// 返回当前使用的体验金详情
export const useTrialFundDetail = () => {
  const trialFundDetail = useSelector((state) => state.futuresTrialFund.trialFundDetail);
  return trialFundDetail || emptyObject;
};

// 返回当前合约是否支持体验金
export const useSymbolSupportTrialFund = (symbol) => {
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const trialFundDetail = useTrialFundDetail();

  const isSupportCurrentSymbol = useMemo(() => {
    if (!symbol) return false;
    // 如果不存在当前激活的体验金，则走合约里面去拿，看是否支持
    if (!trialFundDetail || !trialFundDetail.contractList) {
      return Boolean(symbolInfo?.isTrialFunds);
    }
    return trialFundDetail?.contractList?.includes(symbol);
  }, [symbol, symbolInfo, trialFundDetail]);

  return isSupportCurrentSymbol;
};

// 返回 hidden 隐藏委托的勾选状态
export const useWatchHidden = () => {
  const symbol = useGetCurrentSymbol();
  const { getMarginModeForSymbol } = useMarginMode();
  const marginMode = getMarginModeForSymbol(symbol);
  const isHidden = useSelector((state) => state.futuresTrialFund.isHidden);
  return isHidden || marginMode === MARGIN_MODE_CROSS;
};

// 返回低频更新的体验金券
export const getTrialFundDetail = () => {
  const globalState = getStore().getState();
  const trialFundDetail = get(globalState, `futuresTrialFund.trialFundDetail`);
  return trialFundDetail;
};

// 返回低频的体验金状态
export const getSwitchTrialFund = () => {
  const isHasTrialFund = getState((state) => state.futuresTrialFund.isHasTrialFund);
  const isAvailableTrialFund = getState((state) => state.futuresTrialFund.isAvailableTrialFund);
  const switchTrialFund = getState((state) => state.futuresTrialFund.switchTrialFund);

  return { isHasTrialFund, isAvailableTrialFund, switchTrialFund };
};

// 返回体验金 rule 信息
export const useTrialRuleInfo = () => {
  const detailData = useSelector((states) => states.futuresTrialFund.trialModalData) || emptyObject;
  const modalState = useSelector((states) => states.futuresTrialFund.trialModalState);
  const trialId = useSelector((states) => states.futuresTrialFund.trialId);

  return {
    detailData,
    modalState,
    trialId,
  };
};

// 体验金规则 dialog
export const useTrialRuleDialog = () => {
  const dispatch = useDispatch();

  const showModal = useCallback(
    ({ code }) => {
      const params = {
        trialId: code,
        trialModalState: true,
      };
      dispatch({
        type: 'futuresTrialFund/update',
        payload: { ...params },
      });
    },
    [dispatch],
  );

  const closeModal = useCallback(() => {
    const params = {
      trialModalState: false,
      trialId: undefined,
      trialModalData: {},
    };

    dispatch({
      type: 'futuresTrialFund/update',
      payload: { ...params },
    });
  }, [dispatch]);

  const getTrialFundDetailById = useCallback(
    (trialId) => {
      dispatch({ type: 'futuresTrialFund/pullTrialModalDetail', payload: { code: trialId } });
    },
    [dispatch],
  );

  return {
    showModal,
    closeModal,
    getTrialFundDetailById,
  };
};
