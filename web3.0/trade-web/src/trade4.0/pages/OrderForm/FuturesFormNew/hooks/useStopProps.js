/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回 stop 表单下单参数
 */
import React, { useRef, useCallback, useMemo } from 'react';

import { useDispatch } from 'react-redux';

import { isNaN } from 'lodash';

import Form from '@mui/Form';

import { useOrderBookClickEvent } from './useEvent';
import {
  getSymbolInfo,
  getTriggerPrice,
  getOpenStash,
  useGetActiveTab,
  useGetLeverage,
  useGetUnit,
  getUnit,
} from './useGetData';
import { getConvertSize } from './useGetUSDsUnit';

import {
  evtEmitter,
  _t,
  dividedBy,
  CURRENCY_UNIT,
  greaterThanOrEqualTo,
  lessThanOrEqualTo,
  tradeOrderAnalyse,
  ALL_DURATION,
} from '../builtinCommon';
import { useVerify, getMarginMode, useNoticeFeed } from '../builtinHooks';

import {
  CONFIRM_DIALOG_EVENT_KEY,
  LIMIT,
  MARKET,
  STOP,
  STOP_LIMIT,
  useFuturesForm,
} from '../config';
import { tradeButtonSensors, transformValues } from '../utils';

const event = evtEmitter.getEvt();
const useStopProps = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const sideRef = useRef(null);
  const qtyRef = useRef(null);

  // 监听买卖盘点击事件
  useOrderBookClickEvent(form);

  const { eventName } = useFuturesForm();
  // const isLogin = useGetIsLogin();
  const leverage = useGetLeverage();
  const { tradingUnit } = useGetUnit();
  const { checkVerify } = useVerify();
  const { orderType } = useGetActiveTab();
  const noticeFeed = useNoticeFeed();

  const isStopLimit = useMemo(() => orderType === STOP_LIMIT, [orderType]);

  const handleSubmit = useCallback((side) => {
    sideRef.current = side;
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createStopOrder = React.useCallback(
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

  const { lastPrice, markPrice, indexPrice } = getTriggerPrice();
  const priceForType = {
    TP: lastPrice,
    MP: markPrice,
    IP: indexPrice,
  };

  // 判断standardPrice值是否有效
  const verificationPrice = useCallback(
    (values) => {
      if (!values) {
        return false;
      }
      const { stopPriceType } = values;
      const standardPriceNumber = parseFloat(priceForType[stopPriceType] || 0);
      if (isNaN(standardPriceNumber) || lessThanOrEqualTo(standardPriceNumber)(0)) {
        return false;
      }
      return true;
    },
    [priceForType],
  );

  const handleSubmitFinish = useCallback(
    async (params) => {
      const values = { ...params };
      if (!verificationPrice(values)) {
        noticeFeed({
          type: 'message.error',
          message: _t('create.order.error'),
        });
        return;
      }

      const side = sideRef.current;

      const { symbolInfo: contractObject, symbol } = getSymbolInfo();

      const standardPrice = priceForType[values.stopPriceType];

      values.stop = greaterThanOrEqualTo(values.stopPrice)(standardPrice) ? 'up' : 'down';

      values.leverage = leverage;

      values.side = side;
      params.side = side;

      values.symbol = symbol;

      values.marginMode = getMarginMode(symbol);

      // 下单比较特殊，需传递对应 type
      values.type = isStopLimit ? LIMIT : MARKET;
      values._type = STOP;

      const { chooseUSDsUnit, contract } = getUnit();
      if (chooseUSDsUnit) {
        values.price = values.price || values.stopPrice;
        // 先将size 做一次 USDT 价格的转换
        values.size = getConvertSize({
          size: values.size,
          price: values.price,
          multiplier: contract.multiplier,
          tradingUnit,
          chooseUSDsUnit,
          isInverse: contract.isInverse,
        });

        values.visibleSize = getConvertSize({
          size: values.visibleSize,
          price: values.price,
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

      // 如果是条件市价，需要把价格删掉
      if (values.type === MARKET) {
        delete values.price;
      }

      const submitCreate = () => {
        event.emit(`${CONFIRM_DIALOG_EVENT_KEY}`, {
          side,
          values,
          confirm: createStopOrder,
        });
      };
      console.log('values --->', values);
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
    },
    [
      checkVerify,
      createStopOrder,
      dispatch,
      isStopLimit,
      leverage,
      noticeFeed,
      priceForType,
      tradingUnit,
      verificationPrice,
    ],
  );

  return {
    form,
    handleSubmitFinish,
    handleSubmit,
    // isLogin,
    eventName,
    isStopLimit,
    qtyRef,
  };
};

export default useStopProps;
