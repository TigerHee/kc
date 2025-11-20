/**
 * Owner: garuda@kupotech.com
 */
import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  memo,
  forwardRef,
} from 'react';

import { map } from 'lodash';

import { PROFIT_RATES, LOSS_RATES, LOSS_TYPE, LONG_TYPE } from './config';
import {
  calcProfitRate,
  calcLossRate,
  calcProfitPrice,
  calcLossPrice,
  makePnlLimitPrice,
} from './utils';

import {
  getDigit,
  dividedBy,
  percent as toPercent,
  toFixed,
  styled,
  withYScreen,
  MARGIN_MODE_CROSS,
} from '../../builtinCommon';

import { getMarginMode } from '../../builtinHooks';
import { getSymbolInfo } from '../../hooks/useGetData';
import ButtonGroup, { Button } from '../ButtonGroup';
import SizeRateInput from '../SizeField/SizeRateInput';

const RateBox = withYScreen(styled.div`
  margin: 8px 0 0;
  display: flex;
  width: 100%;
  align-items: center;
  border-radius: 2px;

  .KuxInput-disabledContainer {
    &:hover {
      background: ${(props) => props.theme.colors.cover4};
    }
  }

  ${(props) =>
    props.$useCss(['md', 'sm'])(`
     margin: 5px 0 0;
  `)}
`);

const SizeRate = (
  {
    contract,
    setFormValue,
    lev,
    openPrice,
    pnlType,
    type,
    disabled,
    isError,
    propsSize,
    precision = 1,
  },
  ref,
) => {
  const [rate, setRate] = useState(null);

  const isSideLong = pnlType === LONG_TYPE;
  const side = isSideLong ? 1 : -1;
  const rateType = type === LOSS_TYPE;

  const rates = useMemo(() => {
    if (rateType) {
      return LOSS_RATES;
    } else {
      return PROFIT_RATES;
    }
  }, [rateType]);

  useEffect(() => {
    if (isError) {
      setRate('');
    }
  }, [isError]);

  const handleSetFormPrice = useCallback(
    (v) => {
      let percent = v;
      let calcPrice;
      if (!v) {
        setFormValue(0);
        return;
      }
      if (type === LOSS_TYPE) {
        percent = -v;
        calcPrice = calcLossPrice(
          contract,
          { stopPercent: percent, openPrice, lev, side },
          getDigit(precision),
        );
      } else {
        calcPrice = calcProfitPrice(
          contract,
          { stopPercent: percent, openPrice, lev, side },
          getDigit(precision),
        );
      }

      const limitPrice = makePnlLimitPrice(contract, {
        isLong: isSideLong,
        isProfit: !rateType,
        value: calcPrice,
        precision,
      });
      setFormValue(limitPrice);
    },
    [contract, isSideLong, lev, openPrice, precision, rateType, setFormValue, side, type],
  );

  const handleCalcRate = useCallback(
    (formPrice) => {
      if (!formPrice) {
        setRate(null);
        return;
      }
      let calcRate;
      if (type === LOSS_TYPE) {
        calcRate = calcLossRate(contract, { formPrice, openPrice, lev, side }, 2);
      } else {
        calcRate = calcProfitRate(contract, { formPrice, openPrice, lev, side }, 2);
      }
      setRate(calcRate);
    },
    [contract, lev, openPrice, side, type],
  );

  const handleRateChange = useCallback(
    (e, v) => {
      if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!v) return;
      handleSetFormPrice(v);
      setRate(v);
    },
    [handleSetFormPrice],
  );

  const onInputChange = useCallback(
    (v) => {
      const { symbol } = getSymbolInfo();
      const marginMode = getMarginMode(symbol);
      if (!Number(v)) {
        setRate(v === '' ? '' : 0);
        handleSetFormPrice('');
        return;
      }
      let percent = toFixed(dividedBy(v)(100))(2);
      // 全仓放开 100% 限制
      if (type === LOSS_TYPE && v > 100 && marginMode !== MARGIN_MODE_CROSS) {
        percent = 1;
      }
      handleSetFormPrice(percent);
      setRate(percent);
    },
    [handleSetFormPrice, type],
  );

  useImperativeHandle(ref, () => ({
    rateValue: rate,
    handleCalcRate,
    reset: () => {
      setRate(undefined);
    },
  }));

  return (
    <RateBox>
      <ButtonGroup value={rate} onChange={handleRateChange}>
        {map(rates, ({ value, label }) => (
          <Button
            type={rateType ? 'secondary' : 'primary'}
            key={value}
            value={value}
            disabled={disabled}
            size={propsSize}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <SizeRateInput
        fullWidth
        value={rate ? toPercent(rate)(0.01)?.toFixed() : rate ?? undefined}
        disabled={disabled}
        onChange={onInputChange}
        placeholder="0"
        step={1}
        size={propsSize === 'small' ? 'xssmall' : 'small'}
      />
    </RateBox>
  );
};

export default memo(forwardRef(SizeRate));
