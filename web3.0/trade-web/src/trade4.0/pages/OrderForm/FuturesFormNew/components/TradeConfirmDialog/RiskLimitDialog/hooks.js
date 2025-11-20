/**
 * Owner: garuda@kupotech.com
 */
import { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { isEqual } from 'lodash';

import sentry from '@kc/sentry';

import {
  plus,
  greaterThan,
  lessThan,
  lessThanOrEqualTo,
  max,
  abs,
  minus,
  guid,
} from '../../../builtinCommon';

import {
  getRiskLimit,
  getActiveOrders,
  getPosition,
  useVerify,
  useRiskLimit,
  useOperatorRiskLimit,
} from '../../../builtinHooks';

import { BUY } from '../../../config';
import { getSymbolInfo } from '../../../hooks/useGetData';
import { getOrderValue } from '../../../hooks/useOrderValue';
import { transformValues } from '../../../utils';

// 返回 check 是否展示调整风险的 props
export const useCheckRiskLimitProps = () => {
  const dispatch = useDispatch();

  const updateExceedRiskLimitInfo = useCallback(
    ({ levelInfo, orderInfo }) => {
      const { symbolInfo } = getSymbolInfo();
      dispatch({
        type: 'futuresForm/update',
        payload: {
          riskLimitLevelInfo: {
            ...levelInfo,
            settleCurrency: symbolInfo?.settleCurrency || 'USDT',
          },
          riskLimitOrderInfo: { ...orderInfo },
        },
      });
    },
    [dispatch],
  );

  const checkExceedRiskLimit = useCallback(
    (orderInfo) => {
      const { riskLimits, userRiskLimit } = getRiskLimit();
      if (!riskLimits?.length || !userRiskLimit?.maxRiskLimit) return false;
      if (!orderInfo) return false;
      const { symbol, isTrialFunds, side, closeOnly, leverage, price, postSize, _type } = orderInfo;
      let allLongValue = 0;
      let allSellValue = 0;
      // 如果是只减仓订单，不进行后续判断
      if (closeOnly) return false;
      try {
        // 遍历所有的非体验金的当前仓位
        getPosition({
          condition: ({
            isOpen,
            symbol: itemSymbol,
            isTrialFunds: itemTrialFunds = false,
            posCost,
          }) => {
            if (itemSymbol === symbol && isOpen && !!isTrialFunds === !!itemTrialFunds) {
              allLongValue = plus(allLongValue)(posCost);
              allSellValue = plus(allSellValue)(posCost);
            }
          },
        });
        // TODO: 这里遍历的订单可能不全
        // 遍历所有的非体验金的当前订单
        getActiveOrders({
          condition: ({
            side: itemSide,
            symbol: itemSymbol,
            isTrialFunds: itemTrialFunds = false,
            value,
          }) => {
            if (itemSymbol === symbol && !!isTrialFunds === !!itemTrialFunds) {
              if (itemSide === BUY) {
                allLongValue = plus(allLongValue)(abs(value));
              } else {
                allSellValue = minus(allSellValue)(abs(value));
              }
            }
          },
        });
        const orderValue = getOrderValue({ price, symbol, postSize, orderType: _type });
        // 获取当前的订单价值
        if (side === BUY) {
          allLongValue = plus(allLongValue)(abs(orderValue));
        } else {
          allSellValue = minus(allSellValue)(abs(orderValue));
        }
        const maxValue = max(allLongValue, abs(allSellValue));
        let riskLimitInfo = null;
        // 是否超过当前档位
        if (greaterThan(maxValue)(userRiskLimit.maxRiskLimit)) {
          for (let i = 0; i < riskLimits.length; ++i) {
            if (
              lessThan(maxValue)(riskLimits[i]?.maxRiskLimit) &&
              lessThanOrEqualTo(leverage)(riskLimits[i]?.maxLeverage)
            ) {
              riskLimitInfo = riskLimits[i];
              break;
            }
          }
        }
        if (riskLimitInfo) {
          updateExceedRiskLimitInfo({ levelInfo: riskLimitInfo, orderInfo });
          return riskLimitInfo;
        }
        return false;
      } catch (err) {
        // 增加一个 sentry 上报
        sentry.captureEvent({
          message: `checkExceedRiskLimit-failed: ${err || '-'}`,
          level: 'warning',
          tags: {
            fatal_type: 'error',
          },
        });
        return false;
      }
    },
    [updateExceedRiskLimitInfo],
  );

  return {
    checkExceedRiskLimit,
  };
};

// 返回 引导调整风险的 props
export const useRiskLimitProps = () => {
  const dispatch = useDispatch();

  const riskLimitOrderInfo = useSelector((state) => state.futuresForm.riskLimitOrderInfo, isEqual);
  const riskLimitLevelInfo = useSelector((state) => state.futuresForm.riskLimitLevelInfo, isEqual);

  const levelRef = useRef(riskLimitLevelInfo);
  const orderInfoRef = useRef(riskLimitOrderInfo);
  const isClickAutoDialogRef = useRef(false); // 是否点击了自动调整的弹框

  levelRef.current = riskLimitLevelInfo;
  orderInfoRef.current = riskLimitOrderInfo;
  const { symbol } = getSymbolInfo();

  const { userRiskLimit } = useRiskLimit();
  const { checkVerify } = useVerify();
  const operatorRiskLimit = useOperatorRiskLimit();

  // 重置所有值
  const onResetInfo = useCallback(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        riskLimitLevelInfo: {},
        riskLimitOrderInfo: {},
      },
    });
    orderInfoRef.current = {};
    levelRef.current = {};
    isClickAutoDialogRef.current = false;
  }, [dispatch]);

  const onDialogClose = useCallback(() => {
    onResetInfo();
  }, [onResetInfo]);

  // 自动调整确认
  const onAutoDialogOK = useCallback(async () => {
    try {
      isClickAutoDialogRef.current = true;
      await operatorRiskLimit({
        level: levelRef.current?.level,
        symbol: levelRef.current?.symbol,
        bizNo: guid(24, 16),
      });
    } catch (err) {
      onDialogClose();
    }
  }, [onDialogClose, operatorRiskLimit]);

  // 修改成功，下单确认
  const onSuccessDialogOK = useCallback(async () => {
    // 保存一下当前值
    const saveInfo = { ...orderInfoRef.current };

    onResetInfo();

    const submitCreate = () => {
      // 发起下单
      dispatch({
        type: 'futuresForm/create',
        payload: {
          postValues: transformValues(saveInfo),
        },
      });
    };

    // 提交的时候，校验一次密码
    // TIPS: 进入页面就会校验交易密码，以目前的场景来说，不会存在这种情况
    // 但是下单需要携带一个 token 值，所以得发一遍接口
    checkVerify(() => {
      submitCreate();
    });
  }, [checkVerify, dispatch, onResetInfo]);

  return {
    onDialogClose,
    onAutoDialogOK,
    onSuccessDialogOK,
    userRiskLimit,
    riskLimitOrderInfo,
    riskLimitLevelInfo,
    showOrderDialog:
      orderInfoRef.current?.size &&
      isClickAutoDialogRef.current &&
      orderInfoRef.current?.symbol === symbol,
  };
};
