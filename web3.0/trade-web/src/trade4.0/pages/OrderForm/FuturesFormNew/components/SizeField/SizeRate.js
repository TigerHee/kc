/**
 * Owner: garuda@kupotech.com
 */
import Form from '@mui/Form';
import Slider from '@mui/RadioSlider';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import {
  calcCrossMaxOrder,
  CURRENCY_UNIT,
  dividedBy,
  floadToPercent,
  greaterThan,
  lessThan,
  MARGIN_MODE_ISOLATED,
  min,
  multiply,
  plus,
  QUANTITY_UNIT,
  styled,
  toNearest,
  withYScreen,
} from '../../builtinCommon';
import {
  getCrossTotalMargin,
  getFuturesTakerFee,
  toMakeTradingUnitQty,
  useMarginMode,
  useSetTooltip,
  useShowAbnormal,
} from '../../builtinHooks';

import {
  BUY,
  CALC_LIMIT,
  CALC_MARKET,
  qtyMarks,
  SELL,
  USDS_MIN_VALUE,
  useFuturesForm,
} from '../../config';
import { calculatorDealPrice } from '../../formula';
import {
  getAvailableBalance,
  getPositionSize,
  useGetActiveTab,
  useGetBBO,
  useGetFeeRate,
  useGetLeverage,
  useGetSymbolInfo,
} from '../../hooks/useGetData';
import useGetUSDsUnit from '../../hooks/useGetUSDsUnit';
import { makeAvailableToSize, makeSizeForRatio } from '../../utils';

const { useFormInstance } = Form;

const RateBox = withYScreen(styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  .rc-slider {
    top: -11px;
    height: 28px !important;
  }
  .rc-slider-mark {
    top: 38px !important;
    display: none;
  }

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

const SizeRate = ({ name, price: formPrice, closeOnly, size: propsSize }, ref) => {
  const form = useFormInstance();
  const [rate, setRate] = useState(undefined);
  const futuresFormContext = useFuturesForm();

  const { fixTakerFee } = useGetFeeRate();
  const { chooseUSDsUnit, tradingUnit } = useGetUSDsUnit();
  const { bid1, ask1 } = useGetBBO();
  const { symbolInfo } = useGetSymbolInfo();
  const { orderType } = useGetActiveTab();
  const leverage = useGetLeverage();
  const { onSetTooltipClose } = useSetTooltip();
  const { getMarginModeForSymbol } = useMarginMode();
  const showAbnormal = useShowAbnormal();

  const isIsolated = useMemo(
    () => getMarginModeForSymbol(symbolInfo?.symbol) === MARGIN_MODE_ISOLATED,
    [getMarginModeForSymbol, symbolInfo],
  );

  const { isInverse, multiplier, lotSize, maxOrderQty } = symbolInfo;

  const price = formPrice || 0;

  const makeSize = useCallback(
    (size = 0) => {
      let expectedSize = size;
      const middleValue = ask1 && bid1 ? dividedBy(plus(ask1)(bid1))(2) : ask1 || bid1 || 0;
      // 反推回来的价值只能乘以委托价格，如果是预计成交价，会有偏差。
      const usdsMulPrice = CALC_MARKET.includes(orderType) ? middleValue : price;

      // 增加处理
      if (chooseUSDsUnit && tradingUnit === QUANTITY_UNIT && !isInverse) {
        // 如果是按usdt下单，并且单位是 张数
        // 按比例填入值的时候公式为 张数 * 合约乘数 * 价格 = 显示出的usdt数量
        expectedSize = toNearest(multiply(multiply(expectedSize)(usdsMulPrice))(multiplier))(
          USDS_MIN_VALUE,
        ).toNumber();
      } else if (chooseUSDsUnit && tradingUnit === CURRENCY_UNIT && !isInverse) {
        // 如果是按usdt下单，并且单位是 张数
        // 按比例填入值的时候公式为 张数 * 合约乘数 * 价格 = 显示出的usdt数量
        // 注意：这里expectedSize 已经在 makeAvailableToSize 这个函数里面乘以过合约乘数。
        // makeAvailableToSize 在 tradingUnit 为 CURRENCY_UNIT 时候，会自动乘以合约乘数。
        expectedSize = toNearest(multiply(expectedSize)(usdsMulPrice))(USDS_MIN_VALUE).toNumber();
      }
      return expectedSize;
    },
    [ask1, bid1, chooseUSDsUnit, isInverse, multiplier, orderType, price, tradingUnit],
  );

  const setSize = useCallback(
    (ratio) => {
      if (ratio === 0) {
        form.setFieldsValue({ [name]: '0' });
        onSetTooltipClose(name);
        return;
      }
      if (!ratio) {
        return;
      }
      // 如果只减仓勾选，则按照仓位数量更新百分比
      if (closeOnly) {
        let positionSize = getPositionSize();
        // 处于宽屏表单时，需要判断方向
        if (
          (lessThan(positionSize)(0) && futuresFormContext?.side === SELL) ||
          (greaterThan(positionSize)(0) && futuresFormContext?.side === BUY)
        ) {
          positionSize = 0;
        }
        const size =
          makeSizeForRatio({
            positionSize: Math.abs(positionSize),
            ratio,
            tradingUnit,
            multiplier,
          }) || 0;
        let handleSize = size;
        // TIPS: 前面的 size 已经被 multiplier 处理，这里直接算价值
        if (chooseUSDsUnit) {
          handleSize = toNearest(multiply(size)(price))(USDS_MIN_VALUE).toNumber();
        }
        form.setFieldsValue({ [name]: `${handleSize}` });
        return;
      }
      const [buyPrice, sellPrice] = calculatorDealPrice({
        type: orderType,
        symbolInfo,
        price,
        ask1,
        bid1,
      });
      let expectedSize = 0;
      const takerFeeRate = getFuturesTakerFee({ symbol: symbolInfo?.symbol });
      // 计算逐仓
      if (isIsolated) {
        const positionSize = getPositionSize();
        const availableBalance = getAvailableBalance();
        const buyMaxSize = makeAvailableToSize({
          ratio,
          expectPrice: buyPrice,
          isInverse,
          multiplier,
          fixTakerFee,
          lev: leverage,
          takerFeeRate,
          lotSize,
          availableBalance,
          maxOrderQty,
          tradingUnit,
          isLong: true,
          positionSize,
        });
        const sellMaxSize = makeAvailableToSize({
          ratio,
          expectPrice: sellPrice,
          isInverse,
          multiplier,
          fixTakerFee,
          lev: leverage,
          takerFeeRate,
          lotSize,
          availableBalance,
          maxOrderQty,
          tradingUnit,
          isLong: false,
          positionSize,
        });
        // TIPS: 交易大厅特别逻辑，会有宽屏表单
        if (futuresFormContext?.side) {
          expectedSize = futuresFormContext?.side === BUY ? buyMaxSize : sellMaxSize;
        } else {
          expectedSize = min(buyMaxSize, sellMaxSize);
        }
      } else {
        const { settleCurrency } = symbolInfo || {};
        const totalMargin = getCrossTotalMargin(settleCurrency);
        // 异常显示兼容
        if (showAbnormal()) {
          expectedSize = 0;
        } else {
          // 计算全仓
          const buySize = calcCrossMaxOrder({
            symbolInfo,
            totalMargin,
            leverage,
            price: buyPrice,
            takerFeeRate,
            isLong: true,
            tradingUnit,
          });
          const sellSize = calcCrossMaxOrder({
            symbolInfo,
            totalMargin,
            leverage,
            price: sellPrice,
            takerFeeRate,
            isLong: false,
            tradingUnit,
          });
          let size = 0;
          // TIPS: 交易大厅特别逻辑，会有宽屏表单
          if (futuresFormContext?.side) {
            size = futuresFormContext?.side === BUY ? buySize : sellSize;
          } else {
            size = min(buySize || 0, sellSize || 0);
          }
          expectedSize = toMakeTradingUnitQty({
            tradingUnit,
            symbolInfo,
            size: multiply(size)(ratio),
          });
        }
      }
      expectedSize = makeSize(expectedSize);
      form.setFieldsValue({ [name]: `${expectedSize}` });
      onSetTooltipClose(name);
    },
    // form 不需要监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      closeOnly,
      orderType,
      isInverse,
      price,
      ask1,
      bid1,
      isIsolated,
      makeSize,
      name,
      onSetTooltipClose,
      tradingUnit,
      multiplier,
      chooseUSDsUnit,
      fixTakerFee,
      leverage,
      lotSize,
      maxOrderQty,
      symbolInfo,
      showAbnormal,
    ],
  );

  const handleRateChange = useCallback((v) => {
    setRate(v);
  }, []);

  const marketDisabled = CALC_MARKET.includes(orderType) && !bid1;
  const fullDisabled = CALC_LIMIT.includes(orderType) && (!formPrice || !ask1);

  useEffect(() => {
    setSize(rate);
  }, [rate, leverage, ask1, bid1, price, closeOnly, setSize]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setRate(undefined);
    },
    set: (value) => {
      setRate(value);
    },
  }));

  const format = useCallback((v) => floadToPercent(v, { isPositive: false }), []);

  return (
    <RateBox>
      <Slider
        disabled={marketDisabled || fullDisabled}
        marks={qtyMarks}
        min={0}
        max={1}
        value={rate === undefined ? 0 : rate}
        step={0.01}
        onChange={handleRateChange}
        tipFormatter={format}
      />
      {/* <ButtonGroup value={rate} onChange={handleRateChange}>
        {map(Rates, ({ value, label }) => (
          <Button
            size={propsSize}
            key={value}
            disabled={marketDisabled || fullDisabled}
            value={value}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      <SizeRateInput
        fullWidth
        value={rate ? toPercent(rate)(0.01)?.toFixed() : rate ?? undefined}
        disabled={marketDisabled || fullDisabled}
        onChange={onInputChange}
        placeholder="0"
        step={1}
        size={propsSize === 'small' ? 'xssmall' : 'small'}
      /> */}
    </RateBox>
  );
};

export default React.memo(React.forwardRef(SizeRate));
