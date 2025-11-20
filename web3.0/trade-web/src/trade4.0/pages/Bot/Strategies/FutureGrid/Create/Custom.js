/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef } from 'react';
import Investment from './Investment';
import { Divider, Text, Flex } from 'Bot/components/Widgets';
import useBalance from 'Bot/hooks/useBalance';
import SubmitButton from './SubmitButton';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import { useFuturePrice } from 'Bot/hooks/useLastTradedPrice';
import { _t } from 'Bot/utils/lang';
import MinMaxFormItem from './MinMaxFormItem.js';
import GridNumFormItem from './GridNumFormItem.js';
import AdvanceSetting from './AdvanceSetting';
// import Coupon from 'strategies/components/Coupon';
import TradeButton from './BuySellBtn';
import PKBuySell from './PKBuySell';
import { Parameter } from './Widgets.js';
import ToggleAuto from './ToggleAuto.js';
import GridText from './GridText.js';
import { useModel } from './model.js';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import useFreshParams from './hooks/useFreshParams';
import useWatch from 'Bot/hooks/useWatch';
import { getMinAmount } from '../util.js';
import Leverage from './Leverage';

const Custom = ({ show, symbolInfo, createInfo }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};
  const { lowerPrice, upperPrice, gridNum } = values;
  const { symbolCode, precision } = symbolInfo;
  const lastTradedPrice = useFuturePrice(symbolCode);
  const balance = useBalance(symbolInfo, 0, false);
  const {
    commonSetting: { direction, leverage },
  } = useModel();
  // 合并去获取relatedParams 的参数
  const allParamsRef = useRef();
  allParamsRef.current = {
    ...values,
    symbol: symbolCode,
    direction,
    leverage,
  };
  // 刷新caclParams机制
  const { relatedParams, setRelatedParams, validateFreshRef } = useFreshParams(
    form,
    allParamsRef,
    show,
  );
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 合并提交的参数
  const allSubmitParamsRef = useRef();
  allSubmitParamsRef.current = {
    stra: 'CONTRACT_GRID',
    createWay: 'Custom',
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
  // 杠杆倍数变化 发起请求
  useUpdateLayoutEffect(() => {
    setTimeout(() => {
      validateFreshRef.current('handleTrigger', { symbol: symbolCode });
    }, 100);
  }, [symbolCode]);

  useUpdateLayoutEffect(() => {
    setTimeout(() => {
      validateFreshRef.current('handleTrigger', { leverage });
    }, 100);
  }, [leverage]);
  useUpdateLayoutEffect(() => {
    setTimeout(() => {
      validateFreshRef.current('handleTrigger', { direction });
    }, 100);
  }, [direction]);

  // 获取最小投资额度
  const minAmount = getMinAmount({
    createInfoMinAmount: createInfo.minAmount,
    relatedParamsMinAmount: relatedParams.minAmount,
    leverage,
    precision,
  });
  // 交易对、方向变化重置所有
  const { clearForm } = useModel();
  useUpdateLayoutEffect(() => {
    clearForm(form);
  }, [direction]);

  useUpdateLayoutEffect(() => {
    clearForm(form, {
      leverage: 1,
    });
  }, [symbolCode]);
  return (
    <FormWrapper
      className="Custom"
      hidden={!show}
      form={form}
    >
      <TradeButton mt={0} mb={16} />
      <Flex vc sb mb={16}>
        <PKBuySell symbolCode={symbolCode} />
        <ToggleAuto symbolCode={symbolCode} form={form} setRelatedParams={setRelatedParams} />
      </Flex>
      <Flex sb mb={8}>
        <Parameter />
        <Leverage symbolCode={symbolCode} />
      </Flex>
      <MinMaxFormItem
        form={form}
        lowerPrice={lowerPrice}
        upperPrice={upperPrice}
        symbolInfo={symbolInfo}
        lastTradedPrice={lastTradedPrice}
        direction={direction}
        limitPrice={Number(relatedParams.initBlowUpPrice)}
      />
      <Divider />
      <GridNumFormItem
        form={form}
        lowerPrice={lowerPrice}
        upperPrice={upperPrice}
        symbolInfo={symbolInfo}
      />
      <GridText relatedParams={relatedParams} symbolInfo={symbolInfo} />
      <Divider />
      <Investment
        symbolInfo={symbolInfo}
        balance={balance}
        relatedParams={relatedParams}
        minAmount={minAmount}
        limitAsset={values.limitAsset}
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
      <AdvanceSetting
        symbolInfo={symbolInfo}
        direction={direction}
        lowerPrice={lowerPrice}
        upperPrice={upperPrice}
        blowUpPrice={relatedParams.blowUpPrice}
        stopLossRatio={relatedParams.stopLossRatio}
      />
      <SubmitButton
        clearCoupon={setCoupon}
        form={form}
        options={allSubmitParamsRef.current}
        type="custom"
      />
    </FormWrapper>
  );
};

export default Custom;
