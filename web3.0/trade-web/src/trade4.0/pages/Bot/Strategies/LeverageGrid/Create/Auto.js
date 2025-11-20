/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useRef } from 'react';
import { Divider, Text } from 'Bot/components/Widgets';
import useBalance from 'Bot/hooks/useBalance';
import SubmitButton from './SubmitButton';
import { _t, _tHTML } from 'Bot/utils/lang';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import Row from 'Bot/components/Common/Row';
import { Parameter } from './Widgets';
import { formatNumber, floatToPercent } from 'Bot/helper';
import useGetAIParams from './hooks/useGetAIParams.js';
import { useModel } from './model';
import TradeButton from './BuySellBtn';
import Investment from './Investment';
import AdvanceSetting from './AdvanceSetting.js';
import useLastTradedPrice from 'Bot/hooks/useLastTradedPrice';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';
/**
 * @description:
 * @param {*} React
 * @param {*} aiInfo
 * @return {*}
 */
const SettingRows = React.memo(({ symbolInfo, aiInfo }) => {
  const { pricePrecision, quota = 'USDT' } = symbolInfo;
  let priceRange = '--';
  if (aiInfo.down && aiInfo.up) {
    priceRange = `${formatNumber(aiInfo.down, pricePrecision)} ~ ${formatNumber(
      aiInfo.up,
      pricePrecision,
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

const Auto = React.memo(({ show, symbolInfo }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const { limitAsset = 0 } = values ?? {};
  const { symbolCode, quotaPrecision } = symbolInfo;
  const lastTradedPrice = useLastTradedPrice(symbolCode);
  const {
    commonSetting: { direction },
  } = useModel();
  const aiInfo = useGetAIParams({
    symbol: symbolCode,
    direction,
    limitAsset,
    quotaPrecision,
    form,
  });

  const balance = useBalance(symbolInfo, 0, false);
  // 卡券参数
  const [coupon, setCoupon] = useState();
  // 合并提交的参数
  const allSubmitParamsRef = useRef();
  allSubmitParamsRef.current = {
    stra: 'MARGIN_GRID',
    createWay: 'AI',
    coupon,
    templateId: 10,
    ...symbolInfo,
    ...values,
    ...aiInfo,
    direction,
    leverage: aiInfo.leverage,
  };
  useUpdateLayoutEffect(() => {
    form.resetFields();
  }, [symbolCode]);
  return (
    <FormWrapper className="Auto" hidden={!show} form={form}>
       <TradeButton />
      <SettingRows aiInfo={aiInfo} symbolInfo={symbolInfo} />
      <Divider />
      <Investment symbolInfo={symbolInfo} relatedParams={aiInfo} />
      <Divider />
      <AdvanceSetting
        symbolInfo={symbolInfo}
        direction={direction}
        lastTradedPrice={lastTradedPrice}
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
