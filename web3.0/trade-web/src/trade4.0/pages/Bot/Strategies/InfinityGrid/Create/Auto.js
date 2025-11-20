/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import Investment from './Investment.js';
import { Divider } from 'Bot/components/Widgets';
import useBalance from 'Bot/hooks/useBalance';
import { calcBuyNum, calcBuySellNum, calcMinInverst } from '../util';
import { submitData } from '../config';
import SubmitButton from './SubmitButton';
import { Parameter } from './Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import Row from 'Bot/components/Common/Row';
import { floatToPercent, formatNumber } from 'Bot/helper';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import AdvanceSetting from './AdvanceSetting';

const SettingRows = React.memo(({ createInfo }) => {
  let {
    aiInfo: { down, gridProfitRatio },
  } = createInfo;
  const { quota, pricePrecision } = createInfo.symbolInfo;
  const quotaText = quota ? `(${quota})` : '';
  down = Number(down) ? formatNumber(down, pricePrecision) : '--';
  gridProfitRatio = gridProfitRatio ? floatToPercent(gridProfitRatio) : '--';
  return (
    <div>
      <Parameter gridPrStr={gridProfitRatio} />
      <Row mt={8} mb={8} fs={12} labelColor="text40" label={`${_t('minprice')}${quotaText}`} value={down} />
      <Row fs={12} labelColor="text40" label={_t('pergridpr')} value={gridProfitRatio} />
    </div>
  );
});

const Auto = React.memo(({ show, createInfo }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const {
    useBaseCurrency, // 是否开启多币种
    limitAsset = 0, // 投资额
    stopLossPrice, // 止损价格
    stopProfitPrice, // 止盈价格
  } = values ?? {};

  const { aiInfo, symbolInfo } = createInfo;
  const lastTradedPrice = useLastTradedPrice(symbolInfo.symbolCode);
  const balance = useBalance(symbolInfo, lastTradedPrice, useBaseCurrency);
  const { quota, pricePrecision, symbolCode } = symbolInfo;

  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 汇集所有参数
  const allCalcParams = {
    stra: 'INFINITY_GRID',
    createWay: 'AI',
    coupon,
    ...aiInfo,
    quota: symbolInfo.quota,
    symbol: symbolCode,
    useBaseCurrency,
    limitAsset,
    lastTradedPrice,
    symbolInfo,
    stopLossPrice,
    stopProfitPrice,
    ...balance,
    balance,
  };
  // 计算需要购买的base数量
  const buyNum = calcBuyNum(allCalcParams);
  // 计算实际需要划转的数量
  const realInverst = calcBuySellNum({ ...allCalcParams, buyNum });
  const allSubmitParams = {
    // 提交的数据
    submitData: submitData({
      ...allCalcParams,
      baseAmount: realInverst.needInverstBase,
      quotaAmount: realInverst.needInverstQuota,
    }),
    buyNum,
    ...realInverst,
    ...allCalcParams,
  };
  // 计算最小投资额度
  const minInvest = calcMinInverst(allCalcParams);

  useUpdateLayoutEffect(() => {
    form.resetFields();
  }, [symbolCode]);
  return (
    <FormWrapper
      className="Auto"
      hidden={!show}
      form={form}
      initialValues={{
        useBaseCurrency: 0,
      }}
    >
      <SettingRows createInfo={createInfo} />
      <Divider className="mti-12 mbi-16" />
      <Investment
        form={form}
        symbolInfo={symbolInfo}
        minInvest={minInvest}
        balance={balance}
        buySellNum={realInverst}
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
      <AdvanceSetting symbolInfo={symbolInfo} min={aiInfo.down} max={lastTradedPrice} />
      <SubmitButton
        form={form}
        clearCoupon={setCoupon}
        allSubmitParams={allSubmitParams}
        type="ai"
      />
    </FormWrapper>
  );
});

export default Auto;
