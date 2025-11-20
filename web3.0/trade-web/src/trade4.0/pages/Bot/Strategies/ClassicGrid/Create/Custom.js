/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useMemo } from 'react';
import Investment from './Investment';
import { Divider } from 'Bot/components/Widgets';
import useBalance from 'Bot/hooks/useBalance';
import { isNull } from 'Bot/helper';
import SubmitButton from './SubmitButton';
import { useSymbolChange } from './hook';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import { createSetInProp } from './util';
import { _t } from 'Bot/utils/lang';
import MinMaxFormItem from './MinMaxFormItem.js';
import GridNumFormItem from './GridNumFormItem.js';
import AdvanceSetting from './AdvanceSetting';
// import Coupon from 'strategies/components/Coupon';
import { calcGridPriceLeval, calcGridProfitRange, calcMinInvertByGridNum } from '../util';
import { useModel } from './model';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';

const Custom = ({ show, symbolCode, createInfo, setTab }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};
  const lastTradedPrice = useLastTradedPrice(symbolCode);
  const { aiInfo, symbolInfo } = createInfo;
  const fee = aiInfo;
  const { max, min, placeGrid, limitAsset, stopLossPrice, stopProfitPrice, openUnitPrice } = values;
  const useBaseCurrency = !!values.useBaseCurrency;
  const balance = useBalance(symbolInfo, lastTradedPrice, useBaseCurrency);
  // 网格数量要加一
  let grid = '';
  if (!isNull(placeGrid)) {
    grid = +placeGrid + 1;
  }
  const { pricePrecision, quota } = symbolInfo;
  // 价格挡
  const { levelPrice, gridLevels } = useMemo(() => {
    return calcGridPriceLeval(max, min, grid, pricePrecision);
  }, [max, min, grid, pricePrecision]);

  // 使用来自专门的手续费接口
  const { feeRate: feeRatio, isNotice, minimumInvestment, minimumOrderValue } = aiInfo;

  // 网格利润范围，已经扣除手续费
  const gridProfit = useMemo(() => {
    return calcGridProfitRange(min, max, levelPrice, feeRatio);
  }, [min, max, levelPrice, feeRatio]);

  // 计算最小投资额度
  const { minInverst } = calcMinInvertByGridNum({
    min,
    max,
    gridNum: placeGrid,
    precision: symbolInfo,
    baseMinSize: symbolInfo.baseMinSize,
    lastTradedPrice,
    minimumInvestment,
    minimumOrderValue,
    isNotice,
  });
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 汇集所有参数
  const allParams = {
    stra: 'GRID',
    isUseBase: useBaseCurrency,
    useBaseCurrency,
    symbol: symbolCode,
    inverst: limitAsset,
    feeRatio,
    gridProfit,
    lastTradedPrice,
    max,
    min,
    grid,
    placeGrid,
    gridNum: grid,
    baseAccount: balance.baseAmount,
    symbolAccount: balance.quoteAmount,
    precision: symbolInfo,
    targetMin: symbolInfo,
    symbolInfo,
    openUnitPrice,
    stopLossPrice,
    stopProfitPrice,
    levelPrice,
    gridLevels,
    coupon,
    couponId: coupon?.id,
    // followTaskId,
    // createEntrance: createEntrance,
    createWay: 'Custom',
  };

  //  提交的数据格式生成
  const setInProp = createSetInProp(allParams);
  const { clearForm } = useModel();
  useUpdateLayoutEffect(() => {
    clearForm(form);
  }, [symbolCode]);

  return (
    <FormWrapper
      className="Custom"
      hidden={!show}
      form={form}
      initialValues={{
        useBaseCurrency: 0,
      }}
    >
      <MinMaxFormItem
        form={form}
        min={min}
        max={max}
        symbolInfo={symbolInfo}
        stopLossPrice={stopLossPrice}
        lastTradedPrice={lastTradedPrice}
        fee={fee}
      />

      <Divider />
      <GridNumFormItem
        form={form}
        min={min}
        max={max}
        gridProfit={gridProfit}
        fee={fee}
        symbolInfo={symbolInfo}
        levelPrice={levelPrice}
      />
      <Divider />
      <Investment
        buySellNum={setInProp.options}
        form={form}
        symbolInfo={symbolInfo}
        balance={balance}
        minInvest={minInverst}
      />

      {/* <Coupon
        stra={allParams.stra}
        symbol={symbolCode}
        totalInvestments={inverst}
        currency={quota}
        coupon={coupon}
        onChange={setCoupon}
        type="CREATE"
        className="mt-16"
      /> */}
      <Divider />
      <AdvanceSetting form={form} symbolInfo={symbolInfo} />

      <SubmitButton form={form} setInProp={setInProp} clearCoupon={setCoupon} type="custom" />
    </FormWrapper>
  );
};

export default Custom;
