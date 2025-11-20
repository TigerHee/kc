/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect} from 'react';
import styled from '@emotion/native';
import useLang from 'hooks/useLang';
import FromToPrice from 'components/Convert/Common/FromToPrice';
import TipTrigger from 'components/Convert/Common/TipTrigger';
import usePolling from 'hooks/usePolling';
import {useDispatch, useSelector} from 'react-redux';
import {multiply} from 'utils/helper';

const Desc = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

/**
 * 添加空询价
 */
export default () => {
  const {_t} = useLang();
  const dispatch = useDispatch();
  const from = useSelector(state => state.convert.from);
  const to = useSelector(state => state.convert.to);

  const {amount: fromAmount, minNumber, coin: fromCoin, precision} = from;
  const {amount: toAmount, coin: toCoin} = to;

  const api = params =>
    dispatch({
      type: 'convert/quoteEmptyPrice',
      payload: params,
    });

  const {startPolling, cancelPolling} = usePolling({
    api,
    loopCounts: 0,
    intervalCounts: 30,
  });

  useEffect(() => {
    if (!fromAmount && !toAmount && +minNumber) {
      dispatch({
        type: 'convert/update',
        payload: {
          emptyMarketPriceInfo: {},
        },
      });
      startPolling({
        fromCurrency: fromCoin,
        toCurrency: toCoin,
        fromCurrencySize: multiply(minNumber, 100, precision),
      });
    } else {
      cancelPolling();
    }
  }, [fromAmount, minNumber, fromCoin, toAmount, toCoin, precision]);

  return (
    <Desc>
      <TipTrigger
        text={_t('8tXxccEW8cH4pAWm6m3iic')}
        message={_t('hJcaFw4JoE8xd4f4BzVcJ7')}
      />
      <FromToPrice isSwitch fd="row" />
    </Desc>
  );
};
