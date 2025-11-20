/*
 * @owner: borden@kupotech.com
 * @desc: 检查全仓市价单是否触发破产价格保护
 *        BPP: bankruptcy price protection 破产价格保护
 */
import { useMemo, useCallback } from 'react';
import moment from 'moment';
import { useSelector } from 'dva';
import Decimal from 'decimal.js/decimal';
import storage from 'src/utils/storage';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getMarginMarkPrice } from '@/utils/stateGetter';
import { useTradeType } from '@/hooks/common/useTradeType';
import { getBuySell1 } from '@/pages/Orderbook/hooks/useModelData';
import useOrderType from '../../../hooks/useOrderType';

/**
 * 1. 如果是全仓杠杆 && 市价
 * 2. 24 小时之内不重复提示
 * 3. 如果是买入 卖盘最低价 > 1.1倍标价
 * 4. 如果是卖出 标价 > 1.1倍买盘最高价
 * @param {*} side sell | buy
 * @param {*} targetPrice - 标记价格
 * @param {*} lowestSellPrice - 卖盘最低价格
 * @param {*} highestBuyPrice - 买盘最高价格
 * @returns
 */
const shouldOpenOrderTips = ({
  side,
  targetPrice,
  lowestSellPrice,
  highestBuyPrice,
  percent,
}) => {
  try {
    const per = new Decimal(1).plus(percent);

    if (side === 'buy') {
      return new Decimal(lowestSellPrice).gt(Decimal.mul(per, targetPrice));
    }

    if (side === 'sell') {
      return new Decimal(targetPrice).gt(Decimal.mul(per, highestBuyPrice));
    }
    return false;
  } catch (error) {
    return false;
  }
};


export default function useBPP() {
  const tradeType = useTradeType();
  const { orderTypeConfig } = useOrderType();
  const configs = useSelector(state => state.marginMeta.configs);

  const isNeedCheckBPP = useMemo(() => {
    if (!(
      orderTypeConfig.needCheckBPP &&
      TRADE_TYPES_CONFIG[tradeType]?.needCheckBPP
    )) {
      return false;
    }
    const lastTime = storage.getItem('order_tips_last_open_time');
    // 上次提示的时间超过 24 小时才会重新提示
    if (lastTime) {
      if (moment(Date.now()).diff(moment(lastTime), 'hours') < 24) {
        return false;
      }
    }
    return true;
  }, [tradeType, orderTypeConfig]);

  const checkBPP = useCallback(async (side) => {
    if (!isNeedCheckBPP) {
      return false;
    }
    // 每次点击的时候获取买卖盘最新的数据
    const { buy1, sell1 } = getBuySell1();
    const calcTargetPrice = getMarginMarkPrice();

    return shouldOpenOrderTips({
      side,
      highestBuyPrice: buy1,
      lowestSellPrice: sell1,
      targetPrice: calcTargetPrice,
      percent: configs?.remindPriceDeviateRatio,
    });
  }, [isNeedCheckBPP, configs]);

  return {
    checkBPP,
    isNeedCheckBPP,
  };
}
