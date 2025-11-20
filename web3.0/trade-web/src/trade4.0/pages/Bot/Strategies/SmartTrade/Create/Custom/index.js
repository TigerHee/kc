/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import SubmitButton from './SubmitButton';
import { Provider, useModel } from './model.js';
import { CoinRatio } from 'SmartTrade/components/CreatePosition/CoinRatio';
import Investment from 'SmartTrade/components/Investment';
import AjustWay from 'SmartTrade/components/AjustWay/index.js';
import StopLossProfitSetting from 'SmartTrade/components/StopLossProfitSetting';
import { EntryPriceRowWhenCreate } from 'SmartTrade/components/EntryPrice';
// import Coupon from 'strategies/components/Coupon';
import { FormWrapper } from 'Bot/components/Common/CForm';
import { Divider } from 'Bot/components/Widgets';

const Create = () => {
  const {
    formData,
    form,
    setCoins,
    setMergeState,
    coinRatioRef,
    setMinInvestment,
    setCoupon,
    setFillType,
    symbolInfo,
    stra,
  } = useModel();
  // 设置调仓方式
  const onSetMethod = useCallback((method) => {
    setMergeState({ method });
  }, []);

  // 止损止盈参数
  const params = {
    totalInvestmentUsdt: formData.limitAsset,
    ...formData.lossProfit,
  };
  // 向上提交止损止盈参数
  const onLossProfitChange = useCallback(({ type, data }) => {
    setMergeState((oldState) => {
      return {
        lossProfit: {
          ...oldState.lossProfit,
          ...data,
        },
      };
    });
  }, []);
  return (
    <FormWrapper
      className="Custom"
      form={form}
      initialValues={{
        useBaseCurrency: 0,
      }}
    >
      {/* 建仓组件 */}
      <CoinRatio
        mode="Create" // 模式字段
        coinRatioRef={coinRatioRef}
        coins={formData.coins} // 当前币种
        onCoinsChange={setCoins} // 币种变化回调
        onMinInvestment={setMinInvestment} // 最小投资额回调
        reducerName="createTargetCoins" // 同步交易对区域的model Key 名字
        fillType={formData.fillType} // 配置模式
        setFillType={setFillType} // 配置模式变化函数
      />
      <Divider />
      {/* 投资额 */}
      <Investment formData={formData} form={form} symbolInfo={symbolInfo} />
      {/* 卡券 */}
      {/* <Coupon
        stra={stra}
        totalInvestments={formData.limitAsset}
        coupon={formData.coupon}
        onChange={setCoupon}
        type="CREATE"
        className="mt-16"
      /> */}
      <Divider />
      {/* 高级设置 */}
      <AdvanceSettingWrap>
        {/* 自动调仓 */}
        <AjustWay method={formData.method} onChange={onSetMethod} className="mb-16" />
        {/* 开单价格 */}
        <EntryPriceRowWhenCreate
          coins={formData.coins}
          setCoins={setCoins}
          mode="create-page"
        />
        {/* 止损 */}
        <StopLossProfitSetting
          mode="create"
          scene="loss"
          params={params}
          onSubmit={onLossProfitChange}
        />
        {/* 止盈 */}
        <StopLossProfitSetting
          mode="create"
          scene="profit"
          params={params}
          onSubmit={onLossProfitChange}
        />
      </AdvanceSettingWrap>

      <SubmitButton />
    </FormWrapper>
  );
};

export default (props) => {
  return (
    <Provider>
      <Create />
    </Provider>
  );
};
