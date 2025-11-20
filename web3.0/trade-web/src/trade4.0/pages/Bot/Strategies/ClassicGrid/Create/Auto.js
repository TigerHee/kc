/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import Investment from './Investment';
import useBalance from 'Bot/hooks/useBalance';
import { calcMinInvertByGridNum } from '../util';
import SubmitButton from './SubmitButton';
import { useSymbolChange } from './hook';
import { BackTest, Parameter } from './Widgets';
// import Coupon from 'strategies/components/Coupon';
import { _t, _tHTML } from 'Bot/utils/lang';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import { createSetInProp } from './util';
import Row from 'Bot/components/Common/Row';
import { formatNumber } from 'Bot/helper';
import { Divider } from 'Bot/components/Widgets';

const SettingRows = React.memo(({ quota, aiInfo, symbolCode }) => {
  const { min, max, gridProfit } = aiInfo;
  let { placeGrid } = aiInfo;
  const quotaText = quota ? `(${quota})` : '';
  const range = Number(min) && Number(max) ? `${formatNumber(min)}～${formatNumber(max)}` : '--';
  placeGrid = placeGrid || '--';
  const gridProfitText = gridProfit || '--';

  return (
    <div>
      <BackTest symbolCode={symbolCode} />
      <Parameter />
      <Row fs={12} mt={8} mb={8} labelColor="text40" label={`${_t('gridform26')}${quotaText}`} value={range} />
      <Row fs={12} mb={8} labelColor="text40" label={_t('gridform15')} value={placeGrid} />
      <Row fs={12} mb={8} labelColor="text40" label={_t('persellprofits')} value={gridProfitText} />
    </div>
  );
});

const Auto = React.memo(({ show, symbolCode, createInfo }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const { useBaseCurrency, limitAsset = 0 } = values ?? {};
  const lastTradedPrice = useLastTradedPrice(symbolCode);
  const { aiInfo, symbolInfo } = createInfo;

  const balance = useBalance(symbolInfo, lastTradedPrice, useBaseCurrency);
  const { quota, pricePrecision } = symbolInfo;
  const {
    feeRate: feeRatio,
    min,
    max,
    placeGrid,
    minimumInvestment,
    minimumOrderValue,
    isNotice,
    gridProfit,
  } = aiInfo;
  const grid = +placeGrid + 1;

  // 使用来自专门的手续费接口
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
    coupon,
    couponId: coupon?.id,
    createWay: 'AI',
    // ai参数都设置0
    stopLossPrice: 0,
    stopProfitPrice: 0,
    openUnitPrice: 0,
  };
  const setInProp = createSetInProp(allParams);
  useSymbolChange(form, symbolCode);
  return (
    <FormWrapper
      className="Auto"
      hidden={!show}
      form={form}
      initialValues={{
        useBaseCurrency: 0,
      }}
    >
      <SettingRows aiInfo={aiInfo} quota={quota} symbolCode={symbolCode} />
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
      <SubmitButton form={form} setInProp={setInProp} clearCoupon={setCoupon} type="ai" />
    </FormWrapper>
  );
});

export default Auto;
