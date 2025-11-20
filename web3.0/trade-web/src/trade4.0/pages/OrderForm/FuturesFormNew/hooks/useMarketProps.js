/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回 market 表单下单参数
 */
import React, { useRef, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import Form from '@mui/Form';

import { useOrderBookClickEvent } from './useEvent';
import {
  getSymbolInfo,
  getOpenStash,
  useGetLeverage,
  useGetUnit,
  getUnit,
  useGetMarketPrice,
} from './useGetData';

import { getConvertSize } from './useGetUSDsUnit';

import {
  evtEmitter,
  dividedBy,
  CURRENCY_UNIT,
  tradeOrderAnalyse,
  ALL_DURATION,
} from '../builtinCommon';
import { useVerify, getMarginMode } from '../builtinHooks';

import { CONFIRM_DIALOG_EVENT_KEY, MARKET, useFuturesForm } from '../config';
import { tradeButtonSensors, transformValues } from '../utils';

const event = evtEmitter.getEvt();
const useMarketProps = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const orderStopRef = useRef(null);
  const sideRef = useRef(null);
  const qtyRef = useRef(null);

  // 监听买卖盘点击事件
  useOrderBookClickEvent(form);

  const { eventName } = useFuturesForm();
  // const isLogin = useGetIsLogin();
  const leverage = useGetLeverage();
  const { tradingUnit } = useGetUnit();
  const { checkVerify } = useVerify();

  const marketPrice = useGetMarketPrice();

  const handleSubmit = useCallback((side) => {
    sideRef.current = side;
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createMarketOrder = React.useCallback(
    async (values) => {
      const postValues = transformValues(values);

      const submitCreate = () => {
        dispatch({
          type: 'futuresForm/create',
          payload: {
            postValues,
          },
        });
      };

      submitCreate();

      // if 未开启保存，清空数量输入框
      const openStash = getOpenStash();
      if (!openStash) {
        form.resetFields(['size']);
        qtyRef?.current?.resetRate && qtyRef.current.resetRate();
      }
      // TIPS: Futures 埋点后续添加
      tradeOrderAnalyse.addTimer(ALL_DURATION);
    },
    [dispatch, form],
  );

  const handleSubmitFinish = useCallback(
    async (params) => {
      const values = { ...params };
      const side = sideRef.current;
      let validatePnl = false;
      // 校验止盈止损选择方向
      if (orderStopRef.current) {
        if (orderStopRef.current.typeValue && (values.stopProfitPrice || values.stopLossPrice)) {
          validatePnl = orderStopRef.current.handleShowOrderSideError(side);
        }
      }
      const { symbolInfo: contractObject, symbol } = getSymbolInfo();

      if (!validatePnl) {
        values.marginMode = getMarginMode(symbol);
        values.leverage = leverage;
        values.side = side;
        params.side = side;
        values.symbol = symbol;
        values.type = MARKET;
        values._type = MARKET;

        const { chooseUSDsUnit, contract } = getUnit();
        if (chooseUSDsUnit) {
          values.price = values.price || values.stopPrice;
          // 先将size 做一次 USDT 价格的转换
          values.size = getConvertSize({
            size: values.size,
            price: marketPrice,
            multiplier: contract.multiplier,
            tradingUnit,
            chooseUSDsUnit,
            isInverse: contract.isInverse,
          });

          values.visibleSize = getConvertSize({
            size: values.visibleSize,
            price: marketPrice,
            multiplier: contract.multiplier,
            tradingUnit,
            chooseUSDsUnit,
            isInverse: contract.isInverse,
          });
        }

        values.postSize =
          !contractObject.isInverse && tradingUnit === CURRENCY_UNIT
            ? dividedBy(values.size)(contractObject.multiplier).toString()
            : values.size;

        const submitCreate = () => {
          event.emit(`${CONFIRM_DIALOG_EVENT_KEY}`, {
            side,
            values,
            confirm: createMarketOrder,
          });
        };

        // 这里更新一波缓存值
        const openStash = getOpenStash();
        if (openStash) {
          dispatch({
            type: 'futuresForm/update',
            payload: {
              stashCache: { ...params },
            },
          });
        }

        // 提交的时候，校验一次密码
        checkVerify(() => {
          submitCreate();
        });
        // 埋点
        tradeButtonSensors(values);
      }
    },
    [checkVerify, createMarketOrder, dispatch, leverage, marketPrice, tradingUnit],
  );

  return {
    form,
    handleSubmitFinish,
    orderStopRef,
    handleSubmit,
    // isLogin,
    eventName,
    qtyRef,
  };
};

export default useMarketProps;
