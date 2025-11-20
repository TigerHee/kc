/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回 limit 表单下单参数
 */
import React, { useRef, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import Form from '@mui/Form';

import { useOrderBookClickEvent } from './useEvent';
import {
  getOpenStash,
  getSymbolInfo,
  getUnit,
  useGetIsLogin,
  useGetLeverage,
  useGetUnit,
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

import { CONFIRM_DIALOG_EVENT_KEY, LIMIT, useFuturesForm } from '../config';
import { tradeButtonSensors, transformValues } from '../utils';

const event = evtEmitter.getEvt();
const useLimitProps = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const orderStopRef = useRef(null);
  const qtyRef = useRef(null);
  const sideRef = useRef(null);
  const isLogin = useGetIsLogin();

  // 监听买卖盘点击事件
  useOrderBookClickEvent(form);

  const { eventName } = useFuturesForm();
  const leverage = useGetLeverage();
  const { tradingUnit } = useGetUnit();
  const { checkVerify } = useVerify();

  const handleSubmit = useCallback((side) => {
    sideRef.current = side;
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createLimitOrder = React.useCallback(
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

      console.log('futures submit --->');
      submitCreate();
      // if 未开启保存，清空数量输入框
      const openStash = getOpenStash();
      if (!openStash) {
        form.resetFields(['size']);
        qtyRef?.current?.resetRate && qtyRef.current.resetRate();
      }
      tradeOrderAnalyse.addTimer(ALL_DURATION);
    },
    [dispatch, form],
  );

  const handleSubmitFinish = useCallback(
    async (params) => {
      const values = { ...params };
      const side = sideRef.current;
      // const priceValid = validatePrice(values, side);
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
        values.type = LIMIT;
        values._type = LIMIT;
        values.side = side;
        params.side = side;
        values.symbol = symbol;

        const { chooseUSDsUnit, contract } = getUnit();
        // 先将size 做一次 USDT 价格的转换
        if (chooseUSDsUnit) {
          values.size = getConvertSize({
            size: values.size,
            price: values.price,
            multiplier: contract.multiplier,
            tradingUnit,
            chooseUSDsUnit,
            isInverse: contract.isInverse,
          });

          values.visibleSize = values.visibleSize
            ? getConvertSize({
                size: values.visibleSize,
                price: values.price,
                multiplier: contract.multiplier,
                tradingUnit,
                chooseUSDsUnit,
                isInverse: contract.isInverse,
              })
            : null;
        }

        values.postSize =
          !contractObject.isInverse && tradingUnit === CURRENCY_UNIT
            ? dividedBy(values.size)(contractObject.multiplier).toString()
            : values.size;

        values.postVisibleSize =
          !contractObject.isInverse && values.visibleSize && tradingUnit === CURRENCY_UNIT
            ? dividedBy(values.visibleSize)(contractObject.multiplier).toString()
            : values.visibleSize;

        const submitCreate = () => {
          event.emit(`${CONFIRM_DIALOG_EVENT_KEY}`, {
            values,
            confirm: createLimitOrder,
          });
        };
        // 提交的时候，校验一次密码
        checkVerify(() => {
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

          submitCreate();
        });
        // 埋点
        tradeButtonSensors(values);
      }
    },
    [checkVerify, createLimitOrder, dispatch, leverage, tradingUnit],
  );

  return {
    form,
    handleSubmitFinish,
    orderStopRef,
    qtyRef,
    handleSubmit,
    eventName,
    isLogin,
  };
};

export default useLimitProps;
