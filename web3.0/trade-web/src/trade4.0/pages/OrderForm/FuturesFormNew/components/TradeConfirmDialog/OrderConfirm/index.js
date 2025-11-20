/**
 * Owner: garuda@kupotech.com
 */
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import clsx from 'clsx';
import Decimal from 'decimal.js';
import { toNumber } from 'lodash';

import Box from '@mui/Box';
import Button from '@mui/Button';
import Col from '@mui/Col';
import Divider from '@mui/Divider';
import Row from '@mui/Row';

import CouponDeduction from './CouponDeduction';
import InfoRow from './InfoRow';

import {
  calcCrossExpectLiquidation,
  calcCrossMaxOrder,
  CONFIRM_CONFIG,
  formatCurrency,
  FUTURES_TRIAL_COUPONS,
  lessThan,
  MARGIN_MODE_ISOLATED,
  ORDER_CONFIRM_CHECKED,
  styled,
  thousandPointed,
  toFixed,
  toNearest,
  _t,
} from '../../../builtinCommon';

import {
  CompliantRule,
  PreferencesCheckbox,
  PrettyCurrency,
  SymbolText,
} from '../../../builtinComponents';

import {
  getCrossTotalMargin,
  useFuturesTakerFee,
  useMarginMode,
  useShowAbnormal,
  useSwitchTrialFund,
} from '../../../builtinHooks';

import { BUY, CALC_LIMIT, orderVars } from '../../../config';
import useCrossCost from '../../../hooks/useCost/useCrossCost';
import useIsolatedCost from '../../../hooks/useCost/useIsolatedCost';
import {
  useGetActiveTab,
  // useGetFeeRate,
  useGetLiquidationPrice,
  useGetSymbolInfo,
  useGetUnit,
} from '../../../hooks/useGetData';
import { useOrderValue } from '../../../hooks/useOrderValue';
import { tradeConfirmSensors } from '../../../utils';
import { STOP_PRICE_TYPE_TEXT } from '../config';

const ValueText = styled.span`
  margin: 0 2px 0 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
`;
const ValueUnit = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`;

const SubTitle = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};

  .currencyText {
    color: ${(props) => props.theme.colors.text};
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 2px 4px;
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    border-radius: 4px;
  }

  .side-box {
    margin: 0 6px 0 8px;
    color: ${(props) => (props.isBuy ? props.theme.colors.primary : props.theme.colors.secondary)};
    background-color: ${(props) =>
      (props.isBuy ? props.theme.colors.primary8 : props.theme.colors.secondary8)};
  }

  .margin-mode {
    color: ${(props) => props.theme.colors.text60};
    background-color: ${(props) => props.theme.colors.cover4};
    .text {
      margin: 0 4px 0 0;
    }
  }

  .long {
    color: ${(props) => props.theme.colors.primary};
  }

  .short {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const ConfirmBox = styled.div`
  .subEnhance {
    margin: -8px 0 12px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 13px;
    text-align: right;
  }
  .infoRow {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .title {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    line-height: 1.3;
  }

  .costText {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    text-align: right;
  }

  .rUnit {
    color: ${(props) => props.theme.colors.text40};
  }

  .couponBox {
    div {
      color: ${(props) => props.theme.colors.primary};
      font-weight: 400;
      font-size: 12px;
    }
  }
`;

const FooterBox = styled.div`
  margin: 0 0 32px;

  .btn {
    margin: 0 0 16px;
  }

  .btn-margin {
    margin-top: 24px;
  }

  .footerTip {
    color: ${(props) => props.theme.colors.text60};
    font-size: 12px;
    line-height: 1.3;
    text-align: center;

    .numTip {
      color: ${(props) => props.theme.colors.secondary};
    }
  }

  .label-title {
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
`;

const TrialFundBox = styled.div`
  margin-left: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.complementary};
  background-color: ${(props) => props.theme.colors.complementary8};
`;

const renderValueText = (value, unitText) => {
  return (
    <>
      <ValueText>{thousandPointed(value)}</ValueText>
      <ValueUnit>{` ${unitText}`}</ValueUnit>
    </>
  );
};

const CostContent = memo(({ values, cost, symbolInfo, orderType, isBuy }) => {
  const orderValue = useOrderValue({ price: values.price, size: values.size });
  const { switchTrialFund } = useSwitchTrialFund();

  return (
    <Row container className={clsx('infoRow', 'costBox')}>
      <Col alignItems="center" className={'title'}>
        <span>{_t('trade.confirm.cost')}</span>
        {switchTrialFund ? <TrialFundBox>{_t('homepage.head.trial')}</TrialFundBox> : null}
      </Col>
      <Col className="costText">
        <PrettyCurrency
          unitClassName="rUnit"
          value={cost}
          round={Decimal.ROUND_UP}
          currency={symbolInfo?.settleCurrency}
          isShort
          placeholder="--"
        />
        {cost !== '--' ? (
          <CompliantRule ruleId={FUTURES_TRIAL_COUPONS}>
            <CouponDeduction
              price={values.price}
              orderValue={orderValue}
              orderType={orderType}
              isBuy={isBuy}
              cost={cost}
            />
          </CompliantRule>
        ) : null}
      </Col>
    </Row>
  );
});

// 逐仓成本
const IsoLatedCost = memo(({ isBuy, orderType, values = {} }) => {
  const dispatch = useDispatch();
  const { symbol, symbolInfo } = useGetSymbolInfo();

  // 获取成本
  const [
    { cost: buyCost, closeFee: buyPosComm, dealPrice: buyMinDealPrice },
    { cost: sellCost, closeFee: sellPosComm, dealPrice: sellMinDealPrice },
  ] = useIsolatedCost({
    type: orderType,
    size: values.size,
    leverage: values.leverage,
    price: values.price,
    symbolInfo,
  });

  useEffect(() => {
    dispatch({
      type: 'futuresForm/getLiquidationPrice',
      payload: {
        currentQty: isBuy ? +values.postSize : -values.postSize,
        leverage: values.leverage,
        price: toNumber(isBuy ? buyMinDealPrice : sellMinDealPrice),
        symbol,
        posComm: isBuy ? buyPosComm : sellPosComm,
      },
    });
  }, []); // eslint-disable-line

  const cost = isBuy ? buyCost : sellCost;

  return (
    <CostContent
      values={values}
      cost={cost}
      symbolInfo={symbolInfo}
      orderType={orderType}
      isBuy={isBuy}
    />
  );
});

// 全仓成本
const CrossCost = memo(({ isBuy, orderType, values = {} }) => {
  const dispatch = useDispatch();
  const { symbolInfo } = useGetSymbolInfo();
  const { tradingUnit } = useGetUnit();
  const showAbnormal = useShowAbnormal();
  const abnormalResult = showAbnormal();
  const [
    { cost: buyCost, dealPrice: buyMinDealPrice },
    { cost: sellCost, dealPrice: sellMinDealPrice },
  ] = useCrossCost({
    type: orderType,
    size: values.size,
    leverage: values.leverage,
    price: values.price,
    symbolInfo,
  });

  let cost = isBuy ? buyCost : sellCost;

  const takerFeeRate = useFuturesTakerFee({ symbol: symbolInfo?.symbol });
  const totalMargin = getCrossTotalMargin(symbolInfo?.settleCurrency);
  const maxOrderQty = calcCrossMaxOrder({
    symbolInfo,
    totalMargin,
    leverage: values?.leverage,
    price: isBuy ? buyMinDealPrice : sellMinDealPrice,
    takerFeeRate,
    isLong: isBuy,
  });

  let liquidationPrice = calcCrossExpectLiquidation({
    symbolInfo,
    size: values.size,
    isBuy,
    price: isBuy ? buyMinDealPrice : sellMinDealPrice,
    takerFeeRate: symbolInfo?.takerFeeRate,
    maxOrderQty,
    tradingUnit,
  });

  if (abnormalResult) {
    liquidationPrice = abnormalResult;
    cost = abnormalResult;
  }

  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        liquidationPrice,
      },
    });
  }, [dispatch, liquidationPrice]);

  return (
    <CostContent
      values={values}
      cost={cost}
      symbolInfo={symbolInfo}
      orderType={orderType}
      isBuy={isBuy}
    />
  );
});

const OrderConfirm = ({ values, onOk, showPreferences = true }) => {
  const loading = useSelector((state) => state.loading.effects['futuresForm/create']);
  const { symbol, symbolInfo: contract } = useGetSymbolInfo();
  const { unit } = useGetUnit();
  const { orderType } = useGetActiveTab();
  const liquidationPrice = useGetLiquidationPrice();
  const { getMarginModeForSymbol } = useMarginMode();

  const isIsolated = useMemo(
    () => getMarginModeForSymbol(symbol) === MARGIN_MODE_ISOLATED,
    [getMarginModeForSymbol, symbol],
  );
  const orderValueUnit = contract.quoteCurrency;

  const isBuy = useMemo(() => values?.side === BUY, [values]);

  const liquidateRender = useCallback(
    (liqPrice = 0) => {
      if (liqPrice === '-' || liqPrice === '--' || !liqPrice || lessThan(liqPrice)(0)) {
        return '--';
      }

      if (isBuy) {
        return toNearest(liqPrice)(contract?.indexPriceTickSize, Decimal.ROUND_UP).toFixed();
      } else {
        return toNearest(liqPrice)(contract?.indexPriceTickSize, Decimal.ROUND_DOWN).toFixed();
      }
    },
    [contract, isBuy],
  );

  const triggerText = useMemo(() => {
    if (values.stop) {
      const text = STOP_PRICE_TYPE_TEXT[values.stopPriceType];
      const dirText = orderVars[values.stop];

      return `${_t(text)} ${dirText} ${thousandPointed(values.stopPrice)}`;
    }

    return '';
  }, [values.stop, values.stopPriceType, values.stopPrice]);

  const orderValue = useOrderValue({ price: values.price, size: values.size });
  const quoteCurrency = contract.quoteCurrency || formatCurrency(contract?.settleCurrency);

  const handleConfirm = useCallback(() => {
    onOk && onOk();
    // 埋点
    tradeConfirmSensors(values);
  }, [onOk, values]);

  return (
    <>
      <SubTitle isBuy={isBuy}>
        <SymbolText symbol={symbol} />
        <div className={clsx('badge', 'side-box')}>
          {isBuy ? _t('trade.long') : _t('trade.short')}
        </div>
        <div className={clsx('badge', 'margin-mode')}>
          <span className="text">{isIsolated ? _t('futures.isolated') : _t('futures.cross')}</span>
          <span>{`${toFixed(values.leverage)(2)}x`}</span>
        </div>
      </SubTitle>
      <ConfirmBox>
        {values.stop ? (
          <InfoRow
            title={_t('assets.OrderHistory.stopPrice')}
            data={null}
            render={() => renderValueText(triggerText, quoteCurrency)}
          />
        ) : null}
        <InfoRow
          title={_t('trade.order.price')}
          data={values.price}
          render={(value) =>
            (CALC_LIMIT.includes(orderType)
              ? renderValueText(value, quoteCurrency)
              : _t('trade.order.market'))
          }
        />
        <InfoRow
          title={_t('assets.depositRecords.amount')}
          data={values.size}
          render={(value) => renderValueText(value, unit)}
        />
        {/* 这里需要展示 postVisibleSize 为0 的情况  */}
        {values.postVisibleSize != null && String(values.postVisibleSize) ? (
          <Box className={'subEnhance'}>
            <span>{_t('trade.order.displayQty')}</span>
            <span>{`${thousandPointed(values.visibleSize)} ${unit}`}</span>
          </Box>
        ) : null}
        {!contract.isInverse && (
          <InfoRow
            title={_t('orderStop.value')}
            data={orderValue}
            render={(value) => (
              <PrettyCurrency
                className="costText"
                unitClassName="rUnit"
                value={value}
                currency={orderValueUnit}
                isShort
                placeholder="--"
              />
            )}
          />
        )}
        {isIsolated ? (
          <IsoLatedCost isBuy={isBuy} orderType={orderType} values={values} />
        ) : (
          <CrossCost isBuy={isBuy} orderType={orderType} values={values} />
        )}
        <InfoRow
          title={_t('trade.confirm.PredictedPrice')}
          data={liquidateRender(liquidationPrice)}
          render={(value) => renderValueText(value, quoteCurrency)}
        />
      </ConfirmBox>
      <FooterBox>
        {values.stopProfitPrice || values.stopLossPrice ? (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <div className="label-title">{_t('stopClose.profitLoss')}</div>
            {values.stopProfitPrice ? (
              <InfoRow
                title={_t('stopprofit')}
                data={values.stopProfitPrice}
                render={(value) => (
                  <PrettyCurrency
                    className="costText"
                    unitClassName="rUnit"
                    value={value}
                    currency={quoteCurrency}
                    isShort
                    placeholder="--"
                  />
                )}
              />
            ) : null}
            {values.stopLossPrice ? (
              <InfoRow
                title={_t('gridform21')}
                data={values.stopLossPrice}
                render={(value) => (
                  <PrettyCurrency
                    className="costText"
                    unitClassName="rUnit"
                    value={value}
                    currency={quoteCurrency}
                    isShort
                    placeholder="--"
                  />
                )}
              />
            ) : null}
          </>
        ) : null}
        {showPreferences ? (
          <PreferencesCheckbox type={CONFIRM_CONFIG} value={ORDER_CONFIRM_CHECKED} />
        ) : null}
        <Button
          className={clsx('btn', { 'btn-margin': !showPreferences })}
          size="large"
          variant="contained"
          loading={loading}
          onClick={handleConfirm}
          fullWidth
        >
          {_t('confirm')}
        </Button>
      </FooterBox>
    </>
  );
};

export default React.memo(OrderConfirm);
