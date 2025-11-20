/**
 * Owner: garuda@kupotech.com
 * 设置一个默认的 lastPrice
 */

import React, { useEffect, useRef } from 'react';

import Form from '@mui/Form';

import { evtEmitter, toNonExponential } from '../builtinCommon';

import { useGetIsLogin, useGetLastPrice, useGetSymbolInfo } from '../hooks/useGetData';

const { useFormInstance } = Form;
const event = evtEmitter.getEvt('trade-orderInfo');
const DefaultLastPrice = ({ name }) => {
  const setRef = useRef(null);
  const timerRef = useRef(null);
  const form = useFormInstance();
  const isLogin = useGetIsLogin();
  const { symbol } = useGetSymbolInfo();
  const lastPrice = useGetLastPrice();

  useEffect(() => {
    setRef.current = false;
  }, [symbol, isLogin]);

  // 组件初始化，默认填入当前的最新成交价
  useEffect(() => {
    if (isLogin && !setRef.current) {
      if (!lastPrice) return;
      timerRef.current && clearTimeout(timerRef.current);
      event.emit('KM@setDefaultLastPrice', true);
      // 增加一个延迟设置，避免初始化设置时，组件还未 ready
      timerRef.current = setTimeout(() => {
        setRef.current = true;
        form.setFieldsValue({ [name]: toNonExponential(lastPrice) });
        event.emit('KM@setDefaultLastPrice', false);
      }, 300);
      return () => {
        timerRef.current && clearTimeout(timerRef.current);
      };
    }
    // setValue 方法不需要监听更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, symbol, lastPrice]);

  return null;
};

export default React.memo(DefaultLastPrice);
