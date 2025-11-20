/**
 * Owner: clyne@kupotech.com
 */
import React, { useRef, useEffect, forwardRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { styled } from '@kux/mui/emotion';
import { Divider, Form } from '@kux/mui';

import { _t } from 'utils/lang';
import useStopProfitLoss from '@/pages/Orders/FuturesOrders/hooks/positions/useStopProfitLoss';
import useInitTradePassword from '@/pages/Orders/FuturesOrders/hooks/common/useInitTradePassword';
import StopPLInfo from './components/StopPLInfo';
import PriceInput from './components/PriceInput';
import SizeRate from './components/SizeRate';
import ProfitLossPriceType from './components/ProfitLossPriceType';
import PLTipsInfo from './components/PLTipsInfo';
import SLPTipsInfo from './components/SLPTipsInfo';
import AvgEntryPriceCell from './components/AvgEntryPriceCell';
import LiquidationCell from './components/LiquidationCell';
import { PROFIT_TYPE, LOSS_TYPE } from './constants';
import { fx } from 'src/trade4.0/style/emotion';
import voice from '@/utils/voice';

const ContentBox = styled.div`
  padding-bottom: 8px;
`;

const DetailIBox = styled.div``;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const DetailItemLabel = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  ${(props) => fx.color(props, 'text40')}
`;

const DetailItemContent = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  /* or 18px */

  text-align: right;
  ${(props) => fx.color(props, 'text60')}
  > .text-noTip {
    ${(props) => fx.color(props, 'complementary')}
  }
`;

const StyledDivider = styled(Divider)`
  margin: 24px 0px;
`;

const StopCloseForm = styled.div`
  margin-top: 24px;
`;

const StyledLabel = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  ${(props) => fx.color(props, 'text')}
  margin-bottom: 10px;
`;

const LossContent = styled.div`
  margin-top: 24px;
`;

const RateContent = styled.div`
  margin-top: 10px;
`;

let isSubmit = false;
const { useForm } = Form;
const PLForm = ({ onSubmit }, ref) => {
  const profitRate = useRef(null);
  const lossRate = useRef(null);
  const dispatch = useDispatch();
  const [form] = useForm();
  const { getPasswordStatus } = useInitTradePassword();
  const { symbol, currentQty, avgEntryPrice, liquidationPrice, isTrialFunds } = useSelector(
    (state) => state.futures_orders.positionItem,
    isEqual,
  );
  const [stopPriceProfitType, setStopPriceProfitType] = useState('TP');
  const [stopPriceLossType, setStopPriceLossType] = useState('TP');

  const { stopProfit, stopLoss } = useStopProfitLoss({ symbol, currentQty, isTrialFunds });

  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => {
        const { stopPrice: profitPrice, stopPriceType: profitPriceType } = stopProfit || {};
        const { stopPrice: lossPrice, stopPriceType: lossPriceType } = stopLoss || {};
        let upPrice;
        let downPrice;
        let upStopPriceType;
        let downStopPriceType;
        // 做多 upPrice 为止盈，做空 upPrice 为止损，默认类似为 TP -- 最新成交价
        if (currentQty > 0) {
          upPrice = profitPrice || values[PROFIT_TYPE] || undefined;
          downPrice = lossPrice || values[LOSS_TYPE] || undefined;
          upStopPriceType = profitPriceType || stopPriceProfitType || 'TP';
          downStopPriceType = lossPriceType || stopPriceLossType || 'TP';
        }
        if (currentQty < 0) {
          upPrice = lossPrice || values[LOSS_TYPE] || undefined;
          downPrice = profitPrice || values[PROFIT_TYPE] || undefined;
          upStopPriceType = lossPriceType || stopPriceLossType || 'TP';
          downStopPriceType = profitPriceType || stopPriceProfitType || 'TP';
        }

        if (!upPrice && !downPrice) {
          return;
        }
        const params = {
          upPrice,
          downPrice,
          upStopPriceType: upPrice ? upStopPriceType : undefined,
          downStopPriceType: downPrice ? downStopPriceType : undefined,
          symbol,
          isTrialFunds,
        };
        onSubmit(params);
      })
      .catch((e) => {
        voice.notify('error_boundary');
      });
  };

  const handleCancelStop = async (type, id) => {
    if (!isSubmit) {
      isSubmit = true;
      const params = { symbol, isTrialFunds };
      const { stopPrice: profitPrice, stopPriceType: profitPriceType } = stopProfit || {};
      const { stopPrice: lossPrice, stopPriceType: lossPriceType } = stopLoss || {};
      // 做多 downPrice 为止损，做空则反过来
      if (currentQty > 0) {
        // 如果是止盈，并且仓位为做多， 则取止损的值
        if (type === 'profit') {
          params.downPrice = lossPrice;
          params.downStopPriceType = lossPriceType;
        } else {
          params.upPrice = profitPrice;
          params.upStopPriceType = profitPriceType;
        }
      } else if (currentQty < 0) {
        // 如果是止盈，并且仓位为做空，止盈为止损，取止损的值
        if (type === 'profit') {
          params.upPrice = lossPrice;
          params.upStopPriceType = lossPriceType;
        } else {
          params.downPrice = profitPrice;
          params.downStopPriceType = profitPriceType;
        }
      }
      const hasCheckPassword = await getPasswordStatus();
      if (!hasCheckPassword) {
        dispatch({
          type: 'futures_orders/update',
          payload: {
            checkPasswordVisible: true,
            checkPasswordFinishCallback: () => {
              isSubmit = false;
              dispatch({
                type: 'futures_orders/cancelStopOrderFromShortcut',
                payload: {
                  ...params,
                  id,
                },
              });
            },
            checkPasswordFinishCancelCallback: () => {
              isSubmit = false;
            },
          },
        });
        return;
      }
      isSubmit = false;
      dispatch({
        type: 'futures_orders/cancelStopOrderFromShortcut',
        payload: {
          ...params,
          id,
        },
      });
    }
  };

  const formReset = () => {
    form.resetFields();
  };

  React.useImperativeHandle(ref, () => ({
    submit: handleConfirm,
    reset: formReset,
  }));

  return (
    <ContentBox>
      <DetailIBox>
        <DetailItem>
          <DetailItemLabel>{_t('trade.positionsOrders.entryPrice')}</DetailItemLabel>
          <DetailItemContent>
            <AvgEntryPriceCell avgEntryPrice={avgEntryPrice} symbol={symbol} />
          </DetailItemContent>
        </DetailItem>
        <DetailItem>
          <DetailItemLabel>{_t('trade.positionsOrders.liquidationPrice')}</DetailItemLabel>
          <DetailItemContent isRed>
            <LiquidationCell symbol={symbol} liquidationPrice={liquidationPrice} />
          </DetailItemContent>
        </DetailItem>
      </DetailIBox>
      <StyledDivider />
      <Form form={form}>
        <div>
          {stopProfit ? (
            <>
              <StyledLabel>{_t('stopClose.profit')}</StyledLabel>
              <StopPLInfo
                currentQty={currentQty}
                stopInfo={stopProfit}
                type={PROFIT_TYPE}
                onCancel={() => handleCancelStop(PROFIT_TYPE, stopProfit.id)}
              />
            </>
          ) : (
            <div>
              <PriceInput
                label={_t('stopClose.profit')}
                type={PROFIT_TYPE}
                stopPriceType={stopPriceProfitType}
                slot={
                  <ProfitLossPriceType
                    value={stopPriceProfitType}
                    onChange={(value) => setStopPriceProfitType(value)}
                  />
                }
                footer={
                  <RateContent>
                    <SizeRate form={form} type={PROFIT_TYPE} ref={profitRate} />
                  </RateContent>
                }
                rateRef={profitRate}
              />
              <PLTipsInfo form={form} stopPriceType={stopPriceProfitType} type={PROFIT_TYPE} />
            </div>
          )}
        </div>
        <LossContent>
          {stopLoss ? (
            <>
              <StyledLabel>{_t('stopClose.loss')}</StyledLabel>
              <StopPLInfo
                currentQty={currentQty}
                stopInfo={stopLoss}
                type={LOSS_TYPE}
                onCancel={() => handleCancelStop(LOSS_TYPE, stopLoss.id)}
              />
            </>
          ) : (
            <StopCloseForm>
              <PriceInput
                slot={
                  <ProfitLossPriceType
                    value={stopPriceLossType}
                    onChange={(value) => setStopPriceLossType(value)}
                  />
                }
                stopPriceType={stopPriceLossType}
                label={_t('stopClose.loss')}
                type={LOSS_TYPE}
                footer={
                  <RateContent>
                    <SizeRate form={form} type={LOSS_TYPE} ref={lossRate} />
                  </RateContent>
                }
                rateRef={lossRate}
              />
              <PLTipsInfo form={form} stopPriceType={stopPriceLossType} type={LOSS_TYPE} />
              <SLPTipsInfo form={form} type={LOSS_TYPE} />
            </StopCloseForm>
          )}
        </LossContent>
      </Form>
    </ContentBox>
  );
};

export default forwardRef(PLForm);
