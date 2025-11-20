/*
 * @owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { useSelector } from 'dva';
import { isEmpty } from 'lodash';
import TradeUtils from 'src/utils/tradeUtils';
import useSide from '../../../hooks/useSide';
import useOrderType from '../../../hooks/useOrderType';
import { TRADE_SIDE_MAP } from '../../../config';

export default function useEvent({ setFieldsValue }) {
  const { side } = useSide();
  const { orderType, isMarket, isTrigger } = useOrderType();
  const isLogin = useSelector(state => state.user.isLogin);

  const isBuy = side === TRADE_SIDE_MAP.buy.value;
  const isMarketBuy = isMarket && isBuy;

  useEffect(() => {
    if (isLogin && !isMarketBuy) {
      TradeUtils.getEvt().on('trade.form.fast', onEvent);
    }
    return () => {
      if (isLogin && !isMarketBuy) {
        TradeUtils.getEvt().off('trade.form.fast', onEvent);
      }
    };
  }, [isLogin, orderType, side]);

  const onEvent = (data) => {
    if (!isLogin || isEmpty(data) || isMarketBuy) return;
    const { price, triggerPrice, ...other } = data;

    if (!isMarket && price) {
      other.price = price;
    }

    if (isTrigger && triggerPrice) {
      other.triggerPrice = triggerPrice;
    }

    if (!isEmpty(other)) {
      setFieldsValue(other);
    }
  };
}
