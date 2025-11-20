/*
 * owner: Clyne@kupotech.com
 */
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import { namespace } from '@/pages/Orderbook/config';
import CoinCurrency from '@/components/CoinCurrency';
// import ADL from './ADL';
import { LastPrice as LastPriceWrapper, Center } from './style';
import { useEvent } from '@/pages/Orderbook/hooks/useEvent';
import { equals, greaterThan } from 'src/utils/operation';
import { formatNumber } from '@/utils/format';
import { useGetCurrentSymbolInfo, useGetCurrentSymbol } from '@/hooks/common/useSymbol';

// ADL，指数价格做好了的，后面合约接入放开注释
const LastPrice = ({ className }) => {
  const currenctSymbol = useGetCurrentSymbol();
  const isLoading = useSelector((state) => {
    const loading = state.loading.effects[`${namespace}/getOrderBooks`];
    const hasData = !!state[namespace].data[currenctSymbol];
    return loading && !hasData;
  });
  const LP = useSelector((state) => state[namespace].lastPrice);
  const { pricePrecision } = useGetCurrentSymbolInfo();
  const quoteCurrency = useSelector((state) => state[namespace].quoteCurrency);
  const ref = useRef(0);
  const [state, setState] = useState('text');
  useEffect(() => {
    if (ref) {
      if (ref.current === 0) {
        ref.current = LP;
      } else if (ref.current) {
        // 上一个比当前大，多的颜色
        if (greaterThan(ref.current)(LP)) {
          setState('secondary');
          // 上一个比当前相等，黑的颜色
        } else if (equals(ref.current)(LP)) {
          setState('text');
        } else {
          setState('primary');
        }
        ref.current = LP;
      }
    }
  }, [ref, LP, setState]);
  const { listClick = () => {} } = useEvent();
  if (isLoading) {
    return <LastPriceWrapper noValue>-</LastPriceWrapper>;
  }

  return (
    <LastPriceWrapper
      hasValue={!!LP}
      className={className}
      data-item-type="price"
      onClick={(e) => listClick({ price: LP }, e)}
    >
      <Center className="lp-price" hasValue={!!LP} data-item-type="price" color={state}>
        {LP
          ? formatNumber(LP, {
              pointed: true,
              fixed: pricePrecision,
              dropZ: false,
            })
          : '--'}
      </Center>
      <div className="lp-value">
        <CoinCurrency
          className="orderbook-lp"
          coin={quoteCurrency}
          value={LP ? +LP : null}
          defaultValue="--"
        />
      </div>
    </LastPriceWrapper>
  );
};
export default LastPrice;
