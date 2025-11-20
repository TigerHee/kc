/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import Investment from 'Bot/components/Common/Investment';
import { Divider, Div } from 'Bot/components/Widgets';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import { _t } from 'Bot/utils/lang';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import CreatePageChart from 'AiSpotTrend/components/charts/CreatePageChartLazy';
import SubmitButton from './SubmitButton';
import AdvanceSetting from './AdvanceSetting';
import LeveragePicker from 'Bot/components/Common/LeveragePicker.js';
import useMergeState from 'Bot/hooks/useMergeState';
import useInitParamsBySymbol from './useInitParamsBySymbol';
import useGetMinInvest from './useGetMinInvest';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';

export default React.memo(({ isActive }) => {
  const symbolCode = useGetCurrentSymbol();
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const [form] = Form.useForm();
  const { limitAsset } = Form.useWatch([], form) ?? {};
  const [mergeState, setMergeState] = useMergeState({
    leverage: 5,
    pullBack: 50,
    stopLossPercent: '',
    stopProfitPercent: '',
    minInvestment: '',
  });

  const { createParams, onFetchMore, createChart } = useInitParamsBySymbol(
    symbolCode,
    setMergeState,
  );

  useGetMinInvest(
    {
      symbol: symbolCode,
      leverage: mergeState.leverage,
      pullBack: mergeState.pullBack,
    },
    setMergeState,
  );

  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 汇集所有参数
  const allParams = {
    ...createParams,
    ...mergeState,
    stra: 'FUTURES_CTA',
    isUseBase: false,
    symbol: symbolCode,
    limitAsset,
    symbolInfo,
    // couponId: coupon?.id,
    // coupon,
    // prizeId: goldCouponInfo?.selectedCoupon?.id,
    // goldCoupon: goldCouponInfo?.selectedCoupon,
    createWay: 'Custom',
  };
  const clear = useCallback(() => {
    setMergeState({
      stopLossPercent: '',
      stopProfitPercent: '',
    });
    form.resetFields();
  }, [form]);

  useUpdateLayoutEffect(() => {
    form.resetFields();
  }, [symbolCode]);
  return (
    <FormWrapper className="Custom" form={form}>
      <CreatePageChart
        id="create_page_chart"
        hourKline={createChart.hourKline}
        arbitrageInfo={createChart.arbitrageInfo}
        symbolInfo={symbolInfo}
        mode="create"
        key={symbolCode}
        onScrollLeftFetch={onFetchMore}
        hasCollapse
      />
      <Divider />
      <Div mb={16}>
        <LeveragePicker
          max={createParams.maxLeverage}
          min={createParams.minLeverage}
          value={mergeState.leverage}
          onChange={(lever) => setMergeState({ leverage: lever })}
          symbolCode={symbolInfo.symbolCode}
          // disabled={formData.hasPrizeId}
        />
      </Div>
      <Investment
        symbol={symbolCode}
        minInvest={mergeState.minInvestment}
        maxInvestment={createParams.maxInvestment}
        hasMultiCoin={false}
      />

      <Divider />

      <AdvanceSetting
        mergeState={mergeState}
        createParams={createParams}
        setMergeState={setMergeState}
      />

      <SubmitButton
        clearCoupon={setCoupon}
        clear={clear}
        form={form}
        options={allParams}
        type="AI"
      />
    </FormWrapper>
  );
});
