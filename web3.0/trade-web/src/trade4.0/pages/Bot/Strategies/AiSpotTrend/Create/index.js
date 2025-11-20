/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import Investment from 'Bot/components/Common/Investment';
import { Divider } from 'Bot/components/Widgets';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import { _t } from 'Bot/utils/lang';
import useGetCurrentSymbol from 'Bot/hooks/useGetCurrentSymbol';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useCreateInfo from './useCreateInfo';
import CreatePageChart from 'AiSpotTrend/components/charts/CreatePageChartLazy';
import SubmitButton from './SubmitButton';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';

export default ({ isActive }) => {
  const symbolCode = useGetCurrentSymbol();
  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const [form] = Form.useForm();
  const { limitAsset } = Form.useWatch([], form) ?? {};
  const createParams = useCreateInfo(symbolCode);
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 汇集所有参数
  const allParams = {
    stra: 'CTA',
    symbol: symbolCode,
    limitAsset,
    symbolInfo,
    couponId: coupon?.id,
    coupon,
    // prizeId: goldCouponInfo?.selectedCoupon?.id,
    // goldCoupon: goldCouponInfo?.selectedCoupon,
    // createEntrance: createEntrance,
    createWay: 'Custom',
  };
  useUpdateLayoutEffect(() => {
    form.resetFields();
  }, [symbolCode]);
  return (
    <FormWrapper className="Custom" form={form}>
      <CreatePageChart
        id="create_page_chart"
        hourKline={createParams.hourKline}
        arbitrageInfo={createParams.arbitrageInfo}
        symbolInfo={symbolInfo}
        mode="create"
        key={symbolCode}
        hasCollapse
      />

      <Divider />

      <Investment
        symbol={symbolCode}
        minInvest={createParams.minInvestment}
        maxInvestment={createParams.maxInvestment}
        hasMultiCoin={false}
      />

      <SubmitButton clearCoupon={setCoupon} form={form} options={allParams} type="AI" />
    </FormWrapper>
  );
};
