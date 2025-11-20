/**
 * Owner: mike@kupotech.com
 */
import React, { useRef } from 'react';
import { Text, Flex, Divider } from 'Bot/components/Widgets';
import { validator } from './components/InputSheet';
import OrderSureSheet from './components/OrderSureSheet';
import SideTextByDirection from 'FutureMartingale/components/SideTextByDirection';
import { Row, InputRow } from './components/widgets';
import { Provider, useModel } from './model';
import * as S from './style.js';
import FormatNumber from 'Bot/components/Common/FormatNumber';
import TradeButton from 'Bot/components/Common/TradeButton';
import useStateRef from '@/hooks/common/useStateRef';
import { useDispatch } from 'dva';
// import { CreatePageCoupon } from 'GoldCoupon/ExperienceGoldCoupon';
// import Coupon from 'src/strategies/components/Coupon';
// import { couponSubmitCheck } from 'src/strategies/components/Coupon/util';
import { trackClick } from 'src/utils/ga';
import { _t, _tHTML } from 'Bot/utils/lang';
import LeveragePicker from 'Bot/components/Common/LeveragePicker.js';
import ToggleAIParamsButton from 'Bot/components/Common/ToggleAIParamsButton';
import Investment from 'Bot/components/Common/Investment/index.js';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import SubmitButton from 'Bot/components/Common/SubmitButton';
import { FormWrapper, Form } from 'Bot/components/Common/CForm';

const Create = () => {
  const {
    formData,
    setMergeState,
    dataRef,
    form,
    symbolInfo,
    quota,
    toggleParamsHandler,
    setCoupon,
    setDirection,
    setLeverage,
  } = useModel();

  const dispatch = useDispatch();
  const orderSheetRef = useRef();
  const onSubmit = useStateRef(async () => {
    trackClick(['confirmCreate', '2'], {
      clickPosition: 'confirm',
      resultType: 'FUTURES_MARTIN_GALE',
      yesOrNo: false,
    });
    try {
      const values = await form.validateFields();
      validator({ setMergeState, formData, symbolInfo })
        .then(async () => {
          // if (formData.coupon) {
          //   // 校验投资额 交易对 和卡券的规则
          //   const valid = await couponSubmitCheck(
          //     {
          //       stra: formData.stra,
          //       symbol: formData.symbol,
          //       inverst: formData.limitAsset,
          //       coupon: formData.coupon,
          //     },
          //     () => {
          //       // 清空卡券数据
          //       setCoupon(null);
          //       setTimeout(() => {
          //         // 再次发起校验提交
          //         onSubmit.current();
          //       }, 50);
          //     },
          //   );
          //   if (!valid) {
          //     return;
          //   }
          //   // 卡券和触发开单价不能同时设置
          //   if (formData.openUnitPrice) {
          //     return toast(_t('cannotsetboth'));
          //   }
          // }
          orderSheetRef.current.toggle();
        })
        .catch((errMsg) => {
          setMergeState({
            errMsg,
            isSubmitValid: true,
          });
        });
    } catch (error) {
      console.log('form validate error');
    }
  });
  const fillAIParams = () => {
    if (formData.isAIParamsFill) {
      trackClick(['Custom', 'fillAIParam']);
    }
    toggleParamsHandler();
  };
  return (
    <S.Page className="create-page">
      <TradeButton
        value={formData.direction}
        onChange={setDirection}
        disabled={formData.hasPrizeId}
        mt={16}
        mb={16}
      />
      <div>
        <LeveragePicker
          max={formData.maxLeverage}
          min={formData.minLeverage}
          value={formData.leverage}
          onChange={setLeverage}
          disabled={formData.hasPrizeId}
          symbolCode={symbolInfo.symbolCode}
        />
      </div>
      <div className="mt-16 mb-16">
        <Flex vc sb mb={8}>
          <SideTextByDirection direction={formData.direction} isBuy />

          {!formData.hasPrizeId && (
            <ToggleAIParamsButton active={formData.isAIParamsFill} onClick={fillAIParams} />
          )}
        </Flex>

        <InputRow formKey="buyAfterFall" />
        <InputRow formKey="buyTimes" step={1} />
        <InputRow formKey="buyMultiple" hintKey="9Soj8pxepbL1a8gov36Ykk" withIconHint />
      </div>

      <div className="mt-16">
        <SideTextByDirection direction={formData.direction} isSell />
        <InputRow formKey="stopProfitPercent" className="mt-8" />
      </div>

      <Divider />
      <Investment
        minInvest={formData.minLimitAsset || 0}
        maxInvestment={formData.maxLimitAsset}
        symbol={symbolInfo.symbolCode}
        disabled={formData.hasPrizeId}
      />

      <Flex sb fs={12} lh="130%" mt={10}>
        <Text color="text40">{_t('futrgrid.blowupprice')}</Text>
        <Text color="text">
          <FormatNumber value={formData.blowUpPrice} precision={symbolInfo.precision} />
          &nbsp;
          {symbolInfo.quota}
        </Text>
      </Flex>
      <Divider />
      {/* <Coupon
        stra={formData.stra}
        symbol={formData.symbol}
        totalInvestments={formData.limitAsset}
        currency={quota}
        coupon={formData.coupon}
        onChange={setCoupon}
        type="CREATE"
      />
      <CreatePageCoupon
        isActive
        stra={formData.stra}
        minInverst={formData.defaultLimitAsset}
        templateId={12}
        selectedSymbol={formData.symbol}
      /> */}
      {!formData.hasPrizeId && (
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
      )}

      <SubmitButton
        direction={formData.direction}
        mb={16}
        mt={12}
        variant="contained"
        fullWidth
        onClick={onSubmit.current}
      >
        {_t('gridwidget11')}
      </SubmitButton>
      <OrderSureSheet sheetRef={orderSheetRef} />
    </S.Page>
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
