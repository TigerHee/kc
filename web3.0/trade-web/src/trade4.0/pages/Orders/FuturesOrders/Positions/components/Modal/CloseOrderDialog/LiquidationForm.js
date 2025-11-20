/**
 * Owner: clyne@kupotech.com
 */
import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, includes } from 'lodash';
import Decimal from 'decimal.js';
import { QUANTITY_UNIT } from '@/pages/Orders/FuturesOrders/config';
import { styled, fx } from '@/style/emotion';
import { FUTURES } from '@/meta/const';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { useUnit } from '@/hooks/futures/useUnit';
import { validatorDeep } from '@/pages/Futures/components/DeepIntoRival/utils';
import { getBestTicker } from '@/hooks/futures/useMarket';
import voice from '@/utils/voice';
import { MISOPERATION_KEY } from '@/pages/InfoBar/SettingsToolbar/TradeSetting/futuresConfig';

import PriceInput from './PriceInput';
import SizeInput from './SizeInput';
import LiquidationTips from './LiquidationTips';

const Content = styled.div`
  margin-top: 10px;
  padding-bottom: 8px;
`;

const PriceInputContent = styled.div`
  margin-bottom: 8px;
`;

const LiquidationForm = (props, ref) => {
  const dispatch = useDispatch();
  const { form } = props;
  const type = useSelector((state) => state.futures_orders.liquidationType);
  const confirmConfig = useSelector((state) => state.futuresSetting?.confirmConfig);

  const { currentQty, symbol, isTrialFunds } = useSelector(
    (state) => state.futures_orders.positionItem,
    isEqual,
  );
  const tradingUnit = useUnit();
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  const isNeedTransfer = React.useMemo(() => {
    return !contract.isInverse && tradingUnit !== QUANTITY_UNIT;
  }, [tradingUnit, contract.isInverse]);

  const rateRef = React.useRef(null);

  const handleCloseDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({
      type: 'futures_orders/update',
      payload: {
        liquidationVisible: false,
      },
    });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (value) => {
        const params = {
          type,
          symbol,
          side: currentQty > 0 ? 'sell' : 'buy',
          ...value,
          isTrialFunds,
        };
        // 后端size要求传张对应的数量
        if (isNeedTransfer) {
          params.size = Decimal(params.size).div(contract.multiplier).toNumber();
        }
        dispatch({
          type: 'futures_orders/update',
          payload: {
            liquidationVisible: false,
          },
        });

        // const orderBook = getBuySell1();
        const bestInfo = getBestTicker();
        const needCheckDeep = includes(confirmConfig, MISOPERATION_KEY);
        console.log('isTrialFunds --->', params, isTrialFunds, bestInfo);

        let doCreate = false;

        // 市价单不校验深入买卖盘逻辑
        if (needCheckDeep && params?.type !== 'market') {
          doCreate = validatorDeep({
            side: params.side,
            values: { price: value.price },
            ask1: bestInfo?.ask1,
            bid1: bestInfo?.bid1,
          });
        }

        if (!doCreate) {
          dispatch({ type: 'futures_orders/checkStopOrderBeforeCreate', payload: params });
        } else {
          dispatch({
            type: 'futures_orders/update',
            payload: {
              deepInRivalVisible: true,
              deepInRivalObject: params,
            },
          });
        }
      })
      .catch(() => {
        voice.notify('error_boundary');
      });
  };

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    close: handleCloseDialog,
  }));

  return (
    <Content>
      {type === 'limit' ? (
        <PriceInputContent>
          <PriceInput />
        </PriceInputContent>
      ) : null}
      <SizeInput rateRef={rateRef} type={type} />
      <LiquidationTips form={form} isError={props.isError} />
    </Content>
  );
};

export default React.memo(forwardRef(LiquidationForm));
