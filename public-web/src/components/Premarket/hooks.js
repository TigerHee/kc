/**
 * Owner: solar.xia@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { useResponsive } from '@kux/mui';
import numberFormat from '@kux/mui/utils/numberFormat';
import { divide } from 'helper';
import { find } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteCoinQuery } from 'src/components/Premarket/util';
import { useSelector } from 'src/hooks/useSelector';
import { replace } from 'utils/router';
import searchToJson from 'utils/searchToJson';

export function useProcessPercentage(rate) {
  const { currentLang } = useLocale();
  if (!rate) return '--';
  return numberFormat({
    number: divide(rate, 100),
    lang: currentLang,
    options: {
      style: 'percent',
    },
  });
}

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

/**
 * 实时活动状态，每秒更新一次
 * 0 未开始交易
 * 1 交易中
 * 2 交易结束，交割中
 * 3 交割结束
 * @returns
 */
export function useActivityStatus() {
  const timeRef = useRef(null);
  const { tradeStartAt, tradeEndAt, deliveryTime } = useSelector(
    (state) => state.aptp.deliveryCurrencyInfo,
  );

  const getActivityStatus = useCallback((tradeStartAt, tradeEndAt, deliveryTime, time) => {
    const isActivityNotStarted = tradeStartAt ? moment(tradeStartAt * 1000).isAfter(time) : true;
    const isActivityEnd = tradeEndAt ? moment(tradeEndAt * 1000).isBefore(time) : false;
    const isDeliveryEnd = deliveryTime ? moment(deliveryTime * 1000).isBefore(time) : false;

    let status = 1;
    if (isActivityNotStarted) {
      status = 0;
    } else if (isDeliveryEnd) {
      status = 3;
    } else if (isActivityEnd) {
      status = 2;
    }
    return status;
  }, []);

  const [activityStatus, setActivityStatus] = useState(
    getActivityStatus(tradeStartAt, tradeEndAt, deliveryTime, moment()),
  );

  useEffect(() => {
    setActivityStatus(getActivityStatus(tradeStartAt, tradeEndAt, deliveryTime, moment()));
    timeRef.current = setInterval(() => {
      setActivityStatus(getActivityStatus(tradeStartAt, tradeEndAt, deliveryTime, moment()));
    }, 1000);
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [deliveryTime, getActivityStatus, tradeEndAt, tradeStartAt]);

  return activityStatus;
}

// 单个活动状态
export function useActivityItemStatus({ tradeStartAt, tradeEndAt, deliveryTime }) {
  const timeRef = useRef(null);
  const [time, setTime] = useState(moment());

  useEffect(() => {
    timeRef.current = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, []);

  const activityStatus = useMemo(() => {
    const isActivityNotStarted = tradeStartAt ? moment(tradeStartAt * 1000).isAfter(time) : true;
    const isActivityEnd = tradeEndAt ? moment(tradeEndAt * 1000).isBefore(time) : false;
    const isDeliveryEnd = deliveryTime ? moment(deliveryTime * 1000).isBefore(time) : false;

    let status = 1;
    if (isActivityNotStarted) {
      status = 0;
    } else if (isDeliveryEnd) {
      status = 3;
    } else if (isActivityEnd) {
      status = 2;
    }
    return status;
  }, [tradeStartAt, tradeEndAt, deliveryTime, time]);

  return activityStatus;
}

// path 重定向
export function usePathRedirect() {
  const { coin } = useParams();
  const querySearch = searchToJson();
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();

  const deliveryCurrencyList = useSelector(
    (state) => state.aptp.deliveryCurrencyList,
    shallowEqual,
  );

  const queryCoin = querySearch?.coin;

  useEffect(() => {
    dispatch({
      type: 'aptp/pullAllCurrencies',
    });
  }, [dispatch]);

  useEffect(() => {
    if (deliveryCurrencyList.length) {
      const firstCoin = deliveryCurrencyList[0]?.shortName;
      const firstId = deliveryCurrencyList[0]?.id;
      const item = find(deliveryCurrencyList, { shortName: coin || queryCoin });

      const targetCoin = item ? item.shortName : firstCoin;
      const targetId = item ? item.id : firstId;

      if (targetCoin !== coin && !isInApp) {
        replace(deleteCoinQuery(`/pre-market/${targetCoin}`));
        return;
      }

      dispatch({
        type: 'aptp/pullCurrencyInfo',
        payload: { deliveryCurrencyId: targetId },
      }).then(() => {
        dispatch({
          type: 'aptp/updateFilterCondition',
          payload: {
            resetFilter: true,
            triggerSearch: true,
          },
        });
      });
    }
  }, [coin, queryCoin, deliveryCurrencyList, isInApp, dispatch]);
}

export function useHideScollBarInApp() {
  const isInApp = JsBridge.isApp();
  if (!isInApp) {
    return;
  }
  JsBridge.open({
    type: 'func',
    params: {
      name: 'setWebViewScrollBarVisible',
      enable: false,
    },
  });
  return () => {
    JsBridge.open({
      type: 'func',
      params: {
        name: 'setWebViewScrollBarVisible',
        enable: true,
      },
    });
  };
}
