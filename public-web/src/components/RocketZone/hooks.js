/**
 * Owner: solar@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 获取当前布局尺寸(区别于breakpoints)
 *
 * @returns {('sm'|'md'|'lg')} 返回当前布局尺寸，可能的值为 'sm', 'md', 'lg'
 *
 * - 'sm': 小于 768px，一般对应移动端布局
 * - 'md': 大于等于 768px 且小于 1200px，一般对应平板电脑布局
 * - 'lg': 大于等于 1200px，一般对应桌面布局
 *
 * 一般 UI 仅做这三个样式的响应式开发，方便获取现在在哪个布局下。
 */
export function useResponsiveSize() {
  const { sm, lg } = useResponsive();
  if (!sm) return 'sm';
  if (lg) return 'lg';
  return 'md';
}

export function useInApp() {
  const isInApp = useMemo(() => JsBridge.isApp(), []);
  return isInApp;
}

export function useExit() {
  return useCallback(() => {
    JsBridge.open({
      type: 'func',
      params: {
        name: 'exit',
      },
    });
  }, []);
}

export function useHideHeader() {
  const isInApp = useInApp();
  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          statusBarIsLightMode: false, // 状态栏文字颜色为白色
          statusBarTransparent: true,
          visible: false,
        },
      });
    }
  }, [isInApp]);
}

export function useStatus({ startDate, endDate, deliveryTime, preDeliveryTime, typeName }) {
  const [status, setStatus] = useState(0);
  const timeRef = useRef();

  const getStatus = useCallback(() => {
    let _status = 0;
    if (typeName === 'gemPreMarket') {
      // 盘前交易
      if (startDate && moment(startDate).isAfter(moment())) {
        // 未开始
        _status = 0;
      } else if (endDate && moment(endDate).isAfter(moment())) {
        // 交易中
        _status = 1;
      } else if (deliveryTime && moment(deliveryTime).isBefore(moment())) {
        // 已完成
        _status = 4;
      } else if (preDeliveryTime && moment(preDeliveryTime).isBefore(moment())) {
        // 交割中
        _status = 3;
      } else if (startDate && endDate) {
        // 待交割 (有开始时间和结束时间才计算该状态)
        // 超过交易时间，没到交割开始时间 ｜ 超过交易时间，没设置交割开始时间
        _status = 2;
      }
    } else {
      // 其他
      if (startDate && moment(startDate).isAfter(moment())) {
        // 未开始
        _status = 0;
      } else if (endDate && moment(endDate).isBefore(moment())) {
        // 已结束
        _status = 2;
      } else if (startDate && endDate) {
        // 交易中 (有开始时间和结束时间才计算该状态)
        _status = 1;
      }
    }

    return _status;
  }, [preDeliveryTime, deliveryTime, startDate, endDate, typeName]);

  useEffect(() => {
    setStatus(getStatus());
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }

    timeRef.current = setInterval(() => {
      setStatus(getStatus());
    }, 1000);
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [getStatus]);

  return status;
}
