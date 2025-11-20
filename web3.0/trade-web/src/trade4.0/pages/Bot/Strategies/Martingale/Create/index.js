/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Divider } from '@kux/mui';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import SubmitButton from './components/SubmitButton';
import { Provider, useModel } from './model.js';
import { Row, InputRow } from './components/widgets';
import SideTextByDirection from 'FutureMartingale/components/SideTextByDirection';
import ToggleAIParamsButton from 'Bot/components/Common/ToggleAIParamsButton';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';
import { Flex } from 'Bot/components/Widgets';
import Investment from 'Bot/components/Common/Investment/index.js';
import { _t, _tHTML } from 'Bot/utils/lang';

const Create = () => {
  const { formData, form, symbolInfo, balance, toggleParamsHandler, setCoupon } = useModel();
  const minInvest = Math.max(formData.defaultLimitAsset || 0, formData.minLimitAsset || 0);
  return (
    <>
      <Flex vc sb mb={8}>
        <SideTextByDirection isBuy />

        {!formData.hasPrizeId && (
          <ToggleAIParamsButton active={formData.isAIParamsFill} onClick={toggleParamsHandler} />
        )}
      </Flex>

      <div className="mb-16">
        <InputRow formKey="buyAfterFall" />
        <InputRow formKey="buyTimes" step={1} />
        <InputRow formKey="buyMultiple" hintKey="9Soj8pxepbL1a8gov36Ykk" />
      </div>
      <div className="mt-16">
       <div className="mb-8"> <SideTextByDirection isSell /></div>
        <InputRow formKey="stopProfitPercent" />
      </div>

      <Divider />

      <Investment
        minInvest={minInvest}
        maxInvestment={formData.maxLimitAsset}
        symbol={symbolInfo.symbolCode}
        disabled={formData.hasPrizeId}
      />
      <Divider />

      {/* <Coupon
          stra={formData.stra}
          symbol={formData.symbol}
          totalInvestments={formData.limitAsset}
          currency={symbolInfo.quota}
          coupon={formData.coupon}
          onChange={setCoupon}
          type="CREATE"
          className="mt-16"
        /> */}
      {/* 高级设置 */}
      <AdvanceSettingWrap>
        <Row
          formKey="openUnitPrice"
          label={_t('p36PVMDHJnGYexgBmLgrvN')}
          hintKey="p36PVMDHJnGYexgBmLgrvN"
          inputSheet
        />
        <Row formKey="circularOpeningCondition" label={_t('rTsH2BV1bbEsPXqZxwNscA')} hintSheet />
        <Row
          formKey="openPriceRange"
          label={_t('g7VQsQSvnwTQ19cKnCM1ip')}
          hintKey="g7VQsQSvnwTQ19cKnCM1ip"
          inputSheet
        />
        <Row inputSheet formKey="stoploss" label={_t('lossstop')} hintKey="lossstop" />
      </AdvanceSettingWrap>
      <SubmitButton />
    </>
  );
};

export default React.memo(() => {
  const [form] = Form.useForm();
  return (
    <FormWrapper className="Custom" form={form}>
      <Provider form={form}>
        <Create />
      </Provider>
    </FormWrapper>
  );
});
