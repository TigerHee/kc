/**
 * Owner: garuda@kupotech.com
 * 该组件管理 Form 表单的赋值逻辑
 */

import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Decimal from 'decimal.js';

import Form from '@mui/Form';

import { LONG_TYPE, SHORT_TYPE } from './TradePNL/config';

import { toNearest } from '../builtinCommon';
import { useSetTooltip } from '../builtinHooks';

import { BUY, CALC_BACK_FILL, useFuturesForm } from '../config';
import { getUnit, useGetIsLogin, useGetSymbolInfo, useGetActiveTab } from '../hooks/useGetData';
import { getConvertValue } from '../hooks/useGetUSDsUnit';

const { useFormInstance } = Form;
const SetRetentionData = ({ orderStopRef }) => {
  const dispatch = useDispatch();
  const form = useFormInstance();
  const futuresFormContext = useFuturesForm();
  const openStash = useSelector((state) => state.futuresForm.openStash);
  const stashCache = useSelector((state) => state.futuresForm.stashCache);
  const calcStashCache = useSelector((state) => state.futuresForm.calcStashCache);

  const isLogin = useGetIsLogin();
  const { orderType } = useGetActiveTab();
  const { symbolInfo } = useGetSymbolInfo();
  const { onSetTooltipClose } = useSetTooltip();

  const { multiplier, isInverse, tickSize = 1, symbol } = symbolInfo || {};

  const onLevChange = useCallback(
    (leverage) => {
      dispatch({ type: 'futuresForm/update', payload: { leverage } });
    },
    [dispatch],
  );

  // 状态变化，清空表单值
  useEffect(() => {
    form.resetFields();
    // form 方法不需要监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, symbol]);

  // 如果有计算器值，则清空下单缓存值
  useEffect(() => {
    if (calcStashCache) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          stashCache: null,
        },
      });
    }
  }, [dispatch, calcStashCache]);

  const handleFormSetRetentionData = useCallback(
    (data) => {
      const { chooseUsdsUnit, tradingUnit: submitUnit } = getUnit();

      const {
        price,
        size,
        leverage,
        side,
        stopLossPrice,
        stopProfitPrice,
        closeOnly,
        hidden,
        visibleSize,
        IOC,
        postOnly,
        stopPrice,
        stopPriceType,
      } = data;

      if (futuresFormContext.eventName.match('pluralForm') && side !== futuresFormContext.side) {
        return;
      }

      onSetTooltipClose([]);

      const setFieldsParams = {};

      if (leverage) {
        onLevChange && onLevChange(leverage);
      }

      if (price) {
        setFieldsParams.price = price;
      }

      if (stopPrice) {
        setFieldsParams.stopPrice = stopPrice;
      }

      if (stopPriceType) {
        setFieldsParams.stopPriceType = stopPriceType;
      }

      if (size) {
        let handleQty = Number(size);
        if (chooseUsdsUnit && multiplier && price && handleQty && !isInverse) {
          handleQty = getConvertValue({
            size,
            price,
            multiplier,
            tradingUnit: submitUnit,
            chooseUsdsUnit,
          });
        }
        setFieldsParams.size = handleQty;
      }

      // 如果有只减仓
      if (closeOnly) {
        setFieldsParams.closeOnly = closeOnly;
      }

      // 如果有隐藏单
      if (hidden) {
        setFieldsParams.hidden = hidden;
        setFieldsParams.visibleSize = visibleSize || 0;
      }

      // 如果有 IOC
      if (IOC) {
        setFieldsParams.IOC = IOC;
      }

      // 如果有被动委托
      if (postOnly) {
        setFieldsParams.postOnly = postOnly;
      }

      // 如果设置值存在，则设置一波表单值
      if (setFieldsParams && Object.keys(setFieldsParams).length) {
        setTimeout(() => {
          form.setFieldsValue(setFieldsParams);
        }, 400);
      }

      // 只减仓跟止盈止损互斥
      if (closeOnly) {
        return;
      }

      if (stopLossPrice || stopProfitPrice) {
        const pnlType = side === BUY ? LONG_TYPE : SHORT_TYPE;
        form.setFieldsValue({ closeOnly: false, pnlType });
        // 因为止盈止损开始有可能是隐藏的，所以需要延迟设置值
        setTimeout(() => {
          if (stopLossPrice) {
            const roundDownPrice = toNearest(stopLossPrice)(tickSize, Decimal.ROUND_DOWN)
              .toFixed()
              .toString();
            form.setFieldsValue({ stopLossPrice: roundDownPrice });
          }
          if (stopProfitPrice) {
            const roundDownPrice = toNearest(stopProfitPrice)(tickSize, Decimal.ROUND_DOWN)
              .toFixed()
              .toString();
            form.setFieldsValue({ stopProfitPrice: roundDownPrice });
          }
        }, 400);
      }
    },
    // 不需要监控 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      futuresFormContext.eventName,
      futuresFormContext.side,
      isInverse,
      multiplier,
      onLevChange,
      onSetTooltipClose,
      tickSize,
    ],
  );

  // 设置下单缓存值
  useEffect(() => {
    if (openStash && stashCache) {
      handleFormSetRetentionData(stashCache);
    }
  }, [handleFormSetRetentionData, openStash, stashCache]);

  // 计算器有值的时候，证明需要进行赋值操作
  useEffect(() => {
    if (!calcStashCache || !CALC_BACK_FILL.includes(orderType) || !isLogin) {
      return;
    }

    handleFormSetRetentionData(calcStashCache);
  }, [orderType, calcStashCache, handleFormSetRetentionData, isLogin, orderStopRef]);

  return null;
};

export default React.memo(SetRetentionData);
