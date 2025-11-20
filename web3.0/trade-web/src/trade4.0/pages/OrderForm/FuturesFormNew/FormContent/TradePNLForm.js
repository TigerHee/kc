/**
 * Owner: garuda@kupotech.com
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Form from '@mui/Form';

import { Alert } from './commonStyle';

import { _t, withYScreen, styled } from '../builtinCommon';

import { useNoticeFeed, useSetTooltip } from '../builtinHooks';
import { PROFIT_TYPE, LOSS_TYPE, SHORT_TYPE, LONG_TYPE } from '../components/TradePNL/config';
import PnlForm from '../components/TradePNL/PnlForm';
import PnlType from '../components/TradePNL/PnlType';
import { BUY, SELL } from '../config';

import { useGetLeverage, useGetSetting } from '../hooks/useGetData';

const TradePNLFormWrapper = withYScreen(styled.div`
  position: relative;
  margin: 0 0 10px;
  ${(props) => props.$useCss(['md', 'sm'])(`margin: 0 0 5px;`)}
`);

const AlertBox = withYScreen(styled(Alert)`
  margin: 0 0 12px;
  ${(props) => props.$useCss(['md', 'sm'])(`margin: 0 0 5px;`)}
`);

const { useFormInstance, useWatch } = Form;

const TradePNLForm = ({ openPrice, isMarket = false }, ref) => {
  const form = useFormInstance();

  const dispatch = useDispatch();
  const profitRef = useRef(null);
  const lossRef = useRef(null);

  const closeOnly = useWatch('closeOnly', form);
  const pnlType = useWatch('pnlType', form);
  const stopPriceType = useWatch('stopPriceType', form);

  const lev = useGetLeverage();
  const disabled = !openPrice || !lev;

  const noticeFeed = useNoticeFeed();

  const { onSetTooltipClose } = useSetTooltip();

  const { authPnl } = useGetSetting();

  // 判断 pnlForm 的方向是否有问题
  const handleShowOrderSideError = (side) => {
    if ((side === BUY && pnlType === SHORT_TYPE) || (side === SELL && pnlType === LONG_TYPE)) {
      noticeFeed({
        type: 'message.error',
        message: _t('pnl.orderSide.error'),
      });
      return true;
    }
    return false;
  };

  // 重置 formValue
  const handleResetForm = useCallback(
    (showTips = false) => {
      const formValue = form.getFieldsValue(true);
      if ((formValue.stopLossPrice || formValue.stopProfitPrice) && showTips && authPnl) {
        noticeFeed({
          type: 'message.info',
          message: _t('pnl.switchType.tip'),
        });
      }
      form.setFields([
        { name: 'stopProfitPrice', value: '', errors: [] },
        { name: 'stopLossPrice', value: '', errors: [] },
      ]);
      if (profitRef && profitRef.current) {
        profitRef.current.handleResetRateValue();
      }
      if (lossRef && lossRef.current) {
        lossRef.current.handleResetRateValue();
      }
      onSetTooltipClose([]);
    },
    // form 方法不需要监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [noticeFeed, onSetTooltipClose, authPnl],
  );

  const handleSetPnlType = useCallback((side) => {
    let type = SHORT_TYPE;
    if (side > 0) {
      type = LONG_TYPE;
    }
    form.setFieldsValue({ pnlType: type });
    // form.setFieldsValue 不需要监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 每次勾选 pnlType 时，清空表单值
  const handlePnlTypeChange = useCallback(() => {
    handleResetForm();
  }, [handleResetForm]);

  useEffect(() => {
    handlePnlTypeChange(pnlType);
  }, [handlePnlTypeChange, pnlType]);

  // lev 值变动，重置止盈止损
  useEffect(() => {
    handleResetForm(true);
  }, [handleResetForm, lev]);

  // price 值变动 非市价，重置止盈止损
  useEffect(() => {
    if (isMarket) return;
    handleResetForm(true);
  }, [handleResetForm, isMarket, openPrice]);

  // 价格类型变动，重置止盈止损
  useEffect(() => {
    handleResetForm();
  }, [handleResetForm, stopPriceType]);

  const handleResetAll = (showTips) => {
    form.setFieldsValue({ pnlType: '' });
    handleResetForm(showTips);
  };

  React.useImperativeHandle(ref, () => ({
    typeValue: pnlType,
    handleShowOrderSideError,
    handleSetPnlType,
    handleResetForm,
    handleResetAll,
  }));

  if (!authPnl) return null;

  return (
    <TradePNLFormWrapper>
      <PnlType name="pnlType" closeOnly={closeOnly} />
      {pnlType ? (
        <>
          {disabled ? <AlertBox showIcon type="warning" title={_t('pnl.disable.tip')} /> : null}
          <PnlForm
            name={'stopProfitPrice'}
            priceTypeName={'stopPriceType'}
            pnlType={pnlType}
            inputType={PROFIT_TYPE}
            lev={lev}
            openPrice={openPrice}
            isMarket={isMarket}
            ref={profitRef}
          />
          <PnlForm
            name={'stopLossPrice'}
            priceTypeName={'stopPriceType1'}
            pnlType={pnlType}
            inputType={LOSS_TYPE}
            lev={lev}
            openPrice={openPrice}
            isMarket={isMarket}
            ref={lossRef}
          />
        </>
      ) : null}
    </TradePNLFormWrapper>
  );
};

export default React.memo(React.forwardRef(TradePNLForm));
