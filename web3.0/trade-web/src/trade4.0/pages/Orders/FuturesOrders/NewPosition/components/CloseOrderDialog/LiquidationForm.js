/**
 * Owner: clyne@kupotech.com
 */
import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, includes } from 'lodash';
import Decimal from 'decimal.js';

import {
  voice,
  QUANTITY_UNIT,
  styled,
  useUnit,
  useGetSymbolInfo,
  getBestTicker,
  MISOPERATION_KEY,
  validatorDeep,
} from '@/pages/Futures/import';

import PriceInput from './PriceInput';
import SizeInput from './SizeInput';
import LiquidationTips from './LiquidationTips';
import { namespace } from '../../config';
import { FUTURES } from 'src/trade4.0/meta/const';

const Content = styled.div`
  margin-top: 10px;
  padding-bottom: 8px;
  .KuxForm-itemHelp {
    min-height: auto;
  }
`;

const PriceInputContent = styled.div`
  .KuxForm-itemHelp {
    min-height: 24px;
  }
`;

const LiquidationForm = (props, ref) => {
  const dispatch = useDispatch();
  const { form } = props;
  const type = useSelector((state) => state[namespace].liquidationType);
  const confirmConfig = useSelector((state) => state.futuresSetting?.confirmConfig);

  const { currentQty, symbol, isTrialFunds, marginMode } = useSelector(
    (state) => state[namespace].positionItem,
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
      type: `${namespace}/update`,
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
          marginMode,
        };
        // 后端size要求传张对应的数量
        if (isNeedTransfer) {
          params.size = Decimal(params.size).div(contract.multiplier).toNumber();
        }
        dispatch({
          type: `${namespace}/update`,
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
          dispatch({ type: `${namespace}/checkStopOrderBeforeCreate`, payload: params });
        } else {
          dispatch({
            type: `${namespace}/update`,
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
    sizeReSet: rateRef.current.reset,
    onRateChange: rateRef.current?.onRateChange,
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
