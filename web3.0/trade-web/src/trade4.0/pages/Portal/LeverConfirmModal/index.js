/**
 * Owner: borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import Tooltip from '@mui/Tooltip';
import Dialog from '@mui/Dialog';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'dva';
import { _t, _tHTML } from 'utils/lang';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import BorrowingInfoTip from '@/components/Margin/BorrowingInfoTip';
import { TRADE_SIDE_MAP, ORDER_TYPES_MAP } from '@/pages/OrderForm/config';
import { intlFormatNumber } from '@/hooks/common/useIntlFormat';

export const DialogWrapper = styled(Dialog)`
  .KuxModalFooter-root {
    margin-top: 20px;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  margin-bottom: 16px;
`;

export const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
`;

export const Type = styled.div`
  color: ${(props) =>
    (props.isBuy ? props.theme.colors.primary : props.theme.colors.secondary)};
`;

export const Label = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  cursor: ${(props) => (props.underline ? 'help' : 'unset')};
  border-bottom: ${(props) =>
    (props.underline ? `1px dashed ${props.theme.colors.text40}` : 'unset')};
`;

export const Value = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
`;

export const Desc = styled.div`
  margin-top: 20px;
  .highlight {
    color: ${({ theme }) => theme.colors.complementary};
  }
`;

const plainObj = {};

const formatter = (number) => intlFormatNumber({ number });

/**
 * 下單確認
 */
const LeverConfirmModal = (props) => {
  const dispatch = useDispatch();
  const { open, onOk, showBorrowingInfo, borrowingAmount, ...restProps } =
    props;
  const symbol = useGetCurrentSymbol();
  const [info, updateInfo] = useState(plainObj);

  const formValues = useSelector((state) => state.tradeForm.formValues);
  const { vals, side, tradeType } = formValues || {};
  const confirmLoading = useSelector(
    (state) => state.tradeForm[`loading_${side}`],
  );
  const complianceTaxText = useSelector((state) => state.app.complianceTaxText);


  const {
    currency,
    referRate,
    totalAmount,
    currencyName,
    isShortCovering,
    availableBalance,
    handlingFee,
    quoteCurrencyName,
    taxFee,
  } = info;

  // 获取confirm 里面的值
  useEffect(() => {
    if (open) {
      dispatch({
        type: 'tradeFormUtils/getLeverConfirmData',
      }).then((data) => {
        updateInfo(data);
      });
    }
  }, [open]);

  const handleOk = useCallback(() => {
    if (onOk) onOk({ values: vals, side });
  }, [onOk, vals, side]);

  return (
    <DialogWrapper
      open={open}
      onOk={handleOk}
      okText={_t('confirm')}
      cancelText={_t('cancel')}
      footerProps={{ border: true }}
      title={_t('n.trade.margin.config.title')}
      okButtonProps={{ loading: confirmLoading }}
      {...restProps}
    >
      <Header>
        <Title>{symbol}</Title>
        <Type isBuy={side === 'buy'}>
          <span>{ORDER_TYPES_MAP[tradeType]?.label()}-</span>
          <span>{TRADE_SIDE_MAP[side]?.label()}</span>
        </Type>
      </Header>
      <Row>
        <Label>{_t('isolated.trade.amount')}</Label>
        <Value>
          {formatter(totalAmount)} {currencyName}
        </Value>
      </Row>
      <Row>
        <Label>{_t('7hfqwHPLwZLj87sY4v3brS')}</Label>
        <Value>
          {formatter(handlingFee)} {quoteCurrencyName}
        </Value>
      </Row>

      {taxFee && complianceTaxText && (
        <Row>
          <Tooltip title={complianceTaxText}>
            <Label underline>{_t('jupnbpN1kasi52ewvTzf4N')}</Label>
          </Tooltip>
          <Value>
            {formatter(taxFee)} {quoteCurrencyName}
          </Value>
        </Row>
      )}

      <Row>
        <Label>{_t('isolated.trade.availableBalance')}</Label>
        <Value>
          {formatter(availableBalance)} {currencyName}
        </Value>
      </Row>
      <Row>
        <Label>{_t('isolated.leverConfirm.autoBorrow')}</Label>
        <Value>
          {formatter(borrowingAmount)} {currencyName}
          {showBorrowingInfo && <BorrowingInfoTip currency={currency} />}
        </Value>
      </Row>
      <Row>
        <Tooltip title={_t('isolated.trade.rateTip')}>
          <Label underline>{_t('isolated.trade.rate')}</Label>
        </Tooltip>
        <Value>{referRate}</Value>
      </Row>
      {!!isShortCovering && (
        <Desc>{_t('qaCeFFsZj2gG3KtQ8wAK4w')}</Desc>
      )}
    </DialogWrapper>
  );
};

export default memo(LeverConfirmModal);
