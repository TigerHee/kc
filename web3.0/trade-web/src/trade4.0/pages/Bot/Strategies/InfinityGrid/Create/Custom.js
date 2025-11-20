/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import Investment from './Investment';
import { Divider, Flex } from 'Bot/components/Widgets';
import useBalance from 'Bot/hooks/useBalance';
import SubmitButton from './SubmitButton';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import { _t } from 'Bot/utils/lang';
import AdvanceSetting from './AdvanceSetting';
// import Coupon from 'strategies/components/Coupon';
import { calcBuyNum, calcBuySellNum, calcMinInverst, calcMinPR } from '../util';
import { Parameter } from './Widgets';
import ToggleAuto from './ToggleAuto.js';
import MinPrice from './MinPrice';
import PerGridPR from './PerGridPR';
import Decimal from 'decimal.js';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
import { submitData } from '../config';
import { useModel } from './model';

const getGridRatio = (gridProfitRatio) => {
  return gridProfitRatio ? Decimal(gridProfitRatio).div(100).valueOf() : 0.01;
};
const Custom = ({ show, createInfo, setTab }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};
  const { aiInfo, symbolInfo } = createInfo;
  const lastTradedPrice = useLastTradedPrice(symbolInfo.symbolCode);
  const balance = useBalance(symbolInfo, lastTradedPrice, useBaseCurrency);
  const { quota, pricePrecision, symbolCode } = symbolInfo;
  const {
    useBaseCurrency, // 是否开启多币种
    limitAsset = 0, // 投资额
    down, // 最低价
    gridProfitRatio, // 单网格利润率
    stopLossPrice, // 止损价格
    stopProfitPrice, // 止盈价格
  } = values;
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 汇集所有参数
  const allCalcParams = {
    stra: 'INFINITY_GRID',
    createWay: 'Custom',
    coupon,
    ...aiInfo,
    down,
    quota: symbolInfo.quota,
    gridProfitRatio: getGridRatio(gridProfitRatio),
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
  // 计算 PR 范围
  const PRRange = calcMinPR({
    down,
    priceIncrement: symbolInfo.priceIncrement,
  });
  const [low, up] = PRRange;
  const gridPrStr = `${low}% ~ ${up}%`;
  // 计算最小投资额度
  const minInvest = calcMinInverst(allCalcParams);

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
      <Flex sb mb={8}>
        <Parameter gridPrStr={gridPrStr} />
        <ToggleAuto form={form} aiInfo={aiInfo} />
      </Flex>

      <MinPrice symbolInfo={symbolInfo} lastTradedPrice={lastTradedPrice} />

      <PerGridPR PRRange={PRRange} />

      <Divider />

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
        type="custom"
      />
    </FormWrapper>
  );
};

export default Custom;
