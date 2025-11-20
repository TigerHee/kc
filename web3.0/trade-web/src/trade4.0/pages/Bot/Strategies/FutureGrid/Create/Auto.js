/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Divider, Text } from 'Bot/components/Widgets';
import useBalance from 'Bot/hooks/useBalance';
import SubmitButton from './SubmitButton';
import { _t, _tHTML } from 'Bot/utils/lang';
import { useFuturePrice } from 'Bot/hooks/useLastTradedPrice';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import Row from 'Bot/components/Common/Row';
import { Parameter } from './Widgets';
import { formatNumber, floatToPercent } from 'Bot/helper';
import useGetAIParams from './hooks/useGetAIParams.js';
import useFreshParams from './hooks/useFreshParams';
import { useModel } from './model';
import TradeButton from './BuySellBtn';
import Investment from './Investment';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import AdvanceSetting from './AdvanceSetting.js';
import useWatch from 'Bot/hooks/useWatch';

/**
 * @description:
 * @param {*} React
 * @param {*} aiInfo
 * @return {*}
 */
const SettingRows = React.memo(({ symbolInfo, aiInfo }) => {
  const { precision, quota = 'USDT' } = symbolInfo;
  let priceRange = '--';
  if (aiInfo.lowerLimit && aiInfo.upperLimit) {
    priceRange = `${formatNumber(aiInfo.lowerLimit, precision)} ~ ${formatNumber(
      aiInfo.upperLimit,
      precision,
    )}`;
  }
  let gridProfit = '--';
  if (aiInfo.gridProfitLowerRatio && aiInfo.gridProfitUpperRatio) {
    gridProfit = `${floatToPercent(aiInfo.gridProfitLowerRatio)} ~ ${floatToPercent(
      aiInfo.gridProfitUpperRatio,
    )}`;
  }

  return (
    <div>
      <Parameter />
      <Row
        fs={12}
        labelColor="text40"
        label={_t('futrgrid.leveragex')}
        value={aiInfo.leverage ? `${aiInfo.leverage}x` : '--'}
        mt={8}
        mb={8}
      />
      <Row
        mb={8}
        fs={12}
        labelColor="text40"
        label={`${_t('gridform26')}(${quota})`}
        value={priceRange}
      />
      <Row
        mb={8}
        fs={12}
        labelColor="text40"
        label={_t('gridform15')}
        value={Number(aiInfo.gridNum)}
      />
      <Row fs={12} labelColor="text40" label={_t('persellprofits')} value={gridProfit} />
    </div>
  );
});

const Auto = React.memo(({ show, symbolInfo, createInfo }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const { limitAsset = 0 } = values ?? {};
  const { symbolCode, quota } = symbolInfo;
  const lastTradedPrice = useFuturePrice(symbolCode);
  const {
    commonSetting: { direction },
  } = useModel();
  const aiInfo = useGetAIParams({
    symbol: symbolCode,
    direction,
  });

  const balance = useBalance(symbolInfo, 0, false);

  // 合并去获取relatedParams 的参数
  const allParamsRef = useRef();
  allParamsRef.current = {
    ...values,
    ...aiInfo,
    symbol: symbolCode,
    direction,
    leverage: aiInfo.leverage,
  };
  // 定时获取爆仓价等其他参数
  const { relatedParams, validateFreshRef } = useFreshParams(form, allParamsRef, show);
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 合并提交的参数
  const allSubmitParamsRef = useRef();
  allSubmitParamsRef.current = {
    stra: 'CONTRACT_GRID',
    createWay: 'AI',
    coupon,
    ...allParamsRef.current,
    ...relatedParams,
    ...symbolInfo,
  };
  // 对应值变化, 发起请求接口
  // 监听表单中值的变化, 发起请求接口
  useWatch(values, (changedParams) => {
    validateFreshRef.current('handleTrigger', changedParams);
  });
  useUpdateLayoutEffect(() => {
    setTimeout(() => {
      validateFreshRef.current('handleTrigger', { direction });
    }, 100);
  }, [direction]);
  useUpdateLayoutEffect(() => {
    form.resetFields();
  }, [symbolCode]);
  return (
    <FormWrapper className="Auto" hidden={!show} form={form}>
      <TradeButton />
      <SettingRows aiInfo={aiInfo} symbolInfo={symbolInfo} />
      <Divider />
      <Investment
        symbolInfo={symbolInfo}
        balance={balance}
        relatedParams={relatedParams}
        limitAsset={limitAsset}
        minAmount={aiInfo.minAmount}
      />
      <Divider />
      <AdvanceSetting
        symbolInfo={symbolInfo}
        direction={direction}
        lowerPrice={aiInfo.lowerLimit}
        upperPrice={aiInfo.upperLimit}
        blowUpPrice={relatedParams.blowUpPrice}
        stopLossRatio={relatedParams.stopLossRatio}
      />
      <SubmitButton
        clearCoupon={setCoupon}
        form={form}
        options={allSubmitParamsRef.current}
        type="ai"
      />
    </FormWrapper>
  );
});

export default Auto;
