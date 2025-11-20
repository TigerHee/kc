/**
 * Owner: jessie@kupotech.com
 */
import { useMemo, useEffect } from 'react';
import { useSelector } from 'dva';
import Decimal from 'decimal.js';
import { formatNumber } from '@/utils/format';
import { isNil, concat, map, sortBy, includes, each } from 'lodash';
import { _t } from 'utils/lang';
import { multiply } from 'helper';
import { valIsEmpty } from 'utils/tools';
import { FUTURES } from '@/meta/const';
import { namespace } from '@/pages/Chart/config';
import { useSymbolPrice } from '@/pages/Chart/hooks/useKlineSymbols';
import { useOrderListData } from '@/pages/Orders/Common/hooks/useOrderListInit';
import { orderVars } from '@/pages/Orders/FuturesOrders/config';
import { types, stopMark } from '@/pages/Orders/Common/OrderConfig';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { useSymbolUnit, useTransformAmount } from '@/hooks/futures/useUnit';
import {
  useGetSymbolOpenOrdersData,
  useGetSymbolAdvancedOrdersData,
} from '@/hooks/futures/useGetFuturesPositionsInfo';
import { useIndexPrice, useLastPrice, useMarkPrice } from '@/hooks/futures/useMarket';

/**
 * 现货（限价单、市价单、现价止损、市价止损、OCO）& 杠杆交易
 * 多条数据展示按照与当前市价差值最小的委托进行展示，具体计算与当前市价差值的计算方式如下：
 * 1、限价单：买入卖出价；
 * 2、限价止损：触发价；
 * 3、市价止损：触发价；
 * 4、OCO：买入价卖出价 （非条件单触发的买入卖出价）；
 * 5、跟踪委托：激活价；
 * 按照上述条件展示最近的两条，如果不在k线价格范围内，则都不展示；
 */

export const useOrderLineData = ({ symbol, chartType }) => {
  const { dataSourceBySymbol: activeOrders } = useOrderListData({
    namespace: 'orderCurrent',
    symbol,
  });
  const { dataSourceBySymbol: stopOrders } = useOrderListData({ namespace: 'orderStop', symbol });

  // 最新价
  const { lastTradedPrice: lastPrice } = useSymbolPrice({ symbol });
  const symbolInfo = useGetSymbolInfo({ symbol });

  const user = useSelector((state) => state.user.user);
  const extraToolConfig = useSelector((state) => state[namespace].extraToolConfig);
  const tradeMode = useSelector((state) => state.trade.tradeMode);

  const orders = useMemo(() => {
    // 以下情况不显示
    if (
      !lastPrice ||
      !user ||
      !extraToolConfig.openOrder ||
      chartType === 'timeline' ||
      tradeMode !== 'MANUAL'
    ) {
      return [];
    }

    const list1 = map(activeOrders, (order) => {
      if (order) {
        order.diff = new Decimal(order.price).minus(lastPrice).abs();
        order.orderType = 'active';
        order.side = order.side.toLowerCase();
        return order;
      }
    });

    const list2 = map(stopOrders, (order) => {
      order.orderType = 'stop';
      order.side = order.side.toLowerCase();
      if (order?.type?.indexOf('_stop') > -1 || order?.type?.indexOf('_tso') > -1) {
        const diff = new Decimal(order.stopPrice).minus(lastPrice).abs();
        order.diff = diff;
        return order;
      } else if (order?.type?.indexOf('_oco') > -1) {
        const diff = new Decimal(order.price).minus(lastPrice).abs();
        order.diff = diff;
        return order;
      }
    });

    const list = concat(list1, list2);
    const sortedList = sortBy(list, ['diff']) || [];

    const orderList = map(sortedList?.slice(0, 2), (order, index) => {
      const {
        displayType,
        side,
        orderType,
        type,
        id,
        price,
        size,
        stopType,
        limitPrice,
        stop,
        stopPrice,
        activateCondition,
        pop,
        totalSize,
        totalFunds,
      } = order || {};
      const typeTemp = types.find((item) => (displayType || type) === item?.value);
      const sideText = side === 'buy' ? _t('orders.dirc.buy') : _t('orders.dirc.sell');
      const [baseCoin, quoteCoin] = symbol?.split('-');

      const orderObj = {
        type,
        side,
        id,
        symbol,
        orderType,
        cancelTooltip: _t('iJEAADBXMQmhnNCKgopjxx'),
        text: typeTemp?.text(),
        lineLength: index === 0 ? 10 : 80,
      };
      if (orderType === 'active') {
        orderObj.price = +price;
        // pricePrecision
        orderObj.textTooltip = `${sideText} ${typeTemp?.text()} ${formatNumber(price, {
          fixed: symbolInfo.pricePrecision,
        })}`;
        // 精度处理
        orderObj.quantity = `${formatNumber(size, { fixed: symbolInfo.basePrecision })}`;
        // console.log(`${formatNumber(size, { fixed: symbolInfo.basePrecision })}`, '~~~~size');
        // orderObj.quantity = `${size}`;
        orderObj.modifyTooltip = `${_t('trans.amount')} (${baseCoin})`;
        return orderObj;
      } else if (orderType === 'stop') {
        orderObj.price = type?.indexOf('_oco') > -1 ? +price : +stopPrice;
        // 精度处理
        const isTotalFunds =
          (type === 'market' || type === 'market_stop') && +totalFunds >= +totalSize;
        const unit = isTotalFunds ? quoteCoin : baseCoin;
        const amount = isTotalFunds ? totalFunds : totalSize;
        const precisionKey = isTotalFunds ? 'quotePrecision' : 'basePrecision';
        orderObj.quantity = `${formatNumber(amount, { fixed: symbolInfo[precisionKey] })}`;
        orderObj.modifyTooltip = `${_t('trans.amount')} (${unit})`;

        const _price = `${formatNumber(price, { fixed: symbolInfo.pricePrecision })}` || '';
        const _limitPrice = `${formatNumber(limitPrice, { fixed: symbolInfo.pricePrecision })}`;
        const priceText = `${_price}${
          (includes(stopType, 'oco') || includes(displayType, 'oco')) && limitPrice
            ? ` | ${_limitPrice}`
            : ''
        }`;

        const _type = stop || stopType;
        let triggerPriceText;
        const _stopPrice = `${formatNumber(stopPrice, { fixed: symbolInfo.pricePrecision })}`;
        if (!_type || !stopPrice) {
          triggerPriceText = '-';
        } else if (_type === 'tso') {
          // 0 为 =, 买单显示小于等于，卖单显示大于等于, 1:  >=, 2: <=
          let flag = activateCondition === 2 ? '≤' : '≥';
          // 为 0, 且为买单
          if (activateCondition === 0 && side === 'buy') {
            flag = '≤';
          }
          triggerPriceText = `${flag}${_stopPrice} | ${
            valIsEmpty(pop) ? '-' : `${multiply(pop, 100)}%`
          }`;
        } else {
          triggerPriceText = `${stopMark[_type]} ${_stopPrice}`;
        }

        orderObj.textTooltip = `${sideText} ${typeTemp?.text()} ${priceText} / ${_t(
          'orders.c.trigger',
        )} ${triggerPriceText}`;

        return orderObj;
      }
    });

    return orderList;
  }, [
    activeOrders,
    stopOrders,
    lastPrice,
    user,
    symbolInfo,
    symbol,
    extraToolConfig,
    chartType,
    tradeMode,
  ]);

  return orders;
};

/**
 * 合约
 * 按照与当前市价差值最小的委托进行展示，具体计算与当前市价差值的计算方式如下：
 * 1、当前委托：买入卖出价；
 * 2、高级委托：触发价；
 * 以上订单各展示一条
 */
export const useFuturesOrderLineData = ({ symbol }) => {
  const user = useSelector((state) => state.user.user);
  const extraToolConfig = useSelector((state) => state[namespace].extraToolConfig);

  const { unit } = useSymbolUnit({ symbol });
  const activeOrders = useGetSymbolOpenOrdersData({ symbol });
  const stopOrders = useGetSymbolAdvancedOrdersData({ symbol });
  const markPrice = useMarkPrice(symbol);
  const indexPrice = useIndexPrice(symbol);
  const lastPrice = useLastPrice(symbol);
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType: FUTURES, symbol });

  const activeOrder = useMemo(() => {
    if (!lastPrice || !user || !activeOrders?.length || !extraToolConfig.openOrderFutures) {
      return null;
    }

    let optimalIndex;
    let minDiff;
    try {
      each(activeOrders, (order, index) => {
        const diff = new Decimal(order.price).minus(lastPrice).abs();
        if (isNil(minDiff)) {
          minDiff = diff;
          optimalIndex = index;
        } else if (diff.lt(minDiff)) {
          minDiff = diff;
          optimalIndex = index;
        }
      });
    } catch (err) {
      console.log(err);
    }

    const order = isNil(optimalIndex) ? null : activeOrders[optimalIndex];
    if (order) {
      // 用来显示
      const amount = quantityToBaseCurrency(order.size);
      return {
        orderType: 'active',
        type: order.type,
        side: order.side,
        id: order.id,
        price: +order.price,
        quantity: amount,
        textTooltip: `${order.side === 'buy' ? _t('orders.dirc.buy') : _t('orders.dirc.sell')} ${_t(
          'limit',
        )} ${+order.price}`,
        text: _t('limit'),
        modifyTooltip: `${_t('trans.amount')} (${unit})`,
        // cancelTooltip: _t('iJEAADBXMQmhnNCKgopjxx'),
      };
    }
    return null;
  }, [activeOrders, lastPrice, user, unit, extraToolConfig, quantityToBaseCurrency]);

  const stopOrder = useMemo(() => {
    if (!user || !stopOrders?.length || !extraToolConfig.openOrderFutures) {
      return null;
    }

    let optimalIndex;
    let minDiff;
    try {
      each(stopOrders, (order, index) => {
        const { stopPriceType, stopPrice } = order;
        const orderPriceObj = {
          TP: lastPrice,
          MP: markPrice,
          IP: indexPrice,
        };
        const aimPrice = orderPriceObj[stopPriceType];
        const diff = new Decimal(stopPrice).minus(aimPrice).abs();
        if (isNil(minDiff)) {
          minDiff = diff;
          optimalIndex = index;
        } else if (diff.lt(minDiff)) {
          minDiff = diff;
          optimalIndex = index;
        }
      });
    } catch (err) {
      console.log(err);
    }
    const order = isNil(optimalIndex) ? null : stopOrders[optimalIndex];
    if (order) {
      const amount = quantityToBaseCurrency(order.size);
      return {
        orderType: 'stop',
        type: order.type,
        id: order.id,
        side: order.side,
        price: +order.stopPrice,
        quantity: amount,
        textTooltip: `${order.side === 'buy' ? _t('orders.dirc.buy') : _t('orders.dirc.buy')} ${_t(
          orderVars[order.displayType],
        )} ${+order.price} / ${_t('orders.c.trigger')} ${
          orderVars[order.stop]
        } ${+order.stopPrice}`,
        text: _t(orderVars[order.displayType]),
        modifyTooltip: `${_t('trans.amount')} (${unit})`,
        // cancelTooltip: _t('iJEAADBXMQmhnNCKgopjxx'),
      };
    }
    return null;
  }, [
    stopOrders,
    lastPrice,
    markPrice,
    indexPrice,
    user,
    unit,
    extraToolConfig,
    quantityToBaseCurrency,
  ]);

  return [activeOrder, stopOrder];
};
