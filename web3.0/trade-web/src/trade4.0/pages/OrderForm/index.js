/*
 * @owner: borden@kupotech.com
 */
import React, { useRef, Fragment, useState, useEffect, useContext, Suspense, useMemo } from 'react';
import { isBoolean } from 'lodash';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'dva';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { _t, _tHTML, addLangToPath } from 'src/utils/lang';
import { siteCfg } from 'config';
import Alert from '@mui/Alert';
import ComponentWrapper from '@/components/ComponentWrapper';
import {
  BalanceSocket,
  CrossPositonSocket,
  IsolatedPositonSocket,
} from '@/components/SocketSubscribe';
import useIsMargin from '@/hooks/useIsMargin';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import { SPOT, MARGIN, ISOLATED, FUTURES, isFuturesCrossNew } from '@/meta/const';
import TradeTypeTab from './components/TradeTypeTab';
import TradeSide from './components/TradeSide';
import TradeMask from './components/TradeMask';
import Verify from './components/Verify';
import OrderTypeTab from './components/OrderTypeTab';
import IntroTips from './components/OrderTypeTab/Introduce/IntroTips';
import LeverageSetting from '@/components/Margin/LeverageSetting';
import useSubmitWithVerify from './hooks/useSubmitWithVerify';
import TradeForm from './components/TradeForm';
import { name, WrapperContext, SideContext, YScreenWrapper } from './config';
import {
  TabBar,
  Wrapper,
  Content,
  PwdGuide,
  Container,
  OrderTabBar,
  WithPadding,
  FormContainer,
  OrderTypeTabBox,
  AuctionTradeDescWrapper,
} from './style';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import useOrderType from './hooks/useOrderType';
import TimeWeightedForm from './components/TradeForm/formModules/TimeWeightedForm.js';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';

const { MAINSITE_HOST } = siteCfg;

const CouponDiscount = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-CouponDiscount' */ '@/pages/OrderForm/components/CouponDiscount'
  );
});
const withSuspense = (Component) => () => {
  if (!isDisplayFeeInfo()) {
    return null;
  }
  return (
    <Suspense fallback={<div />}>
      <Component />
    </Suspense>
  );
};
const LazyCouponDiscount = withSuspense(CouponDiscount);

// 合约表单New
const FuturesFormNew = loadable(() =>
  import(/* webpackChunkName: 'tradeV4-futures-form-new' */ './FuturesFormNew'),
);

const OrderForm = React.memo(({ side, setSide, isFloat }) => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const isMargin = useIsMargin();
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const screen = useContext(WrapperContext);
  const isLogin = useSelector((state) => state.user.isLogin);
  const isThirdStep = useSelector((state) => state.callAuction.isThirdStep);
  const { hasPwd, onSubmit, showVerify, isNeedVerify } = useSubmitWithVerify({
    submitCallback: formRef.current?.submitCallback,
  });

  const isMd = screen === 'md';
  const isTrade = tradeType === TRADE_TYPES_CONFIG.TRADE.key;
  const { orderType } = useOrderType();
  useEffect(() => {
    const isSpotSymbol = isSpotTypeSymbol(currentSymbol);
    if (isLogin && currentSymbol && isSpotSymbol) {
      dispatch({
        type: 'tradeForm/getSymbolFee',
        payload: {
          currentSymbol,
        },
      });
    }
  }, [currentSymbol, dispatch, isLogin]);

  useEffect(() => {
    if (orderType === 'timeWeightedOrder') {
      dispatch({
        type: 'tradeForm/getTimeWeightedOrderConfig',
      });
      dispatch({
        type: 'currency/pullUSDPrices',
      });
    }
  }, [dispatch, orderType]);

  const currentForm = useMemo(() => {
    return orderType === 'timeWeightedOrder' ? (
      <TimeWeightedForm ref={formRef} onSubmit={onSubmit} />
    ) : (
      <TradeForm ref={formRef} onSubmit={onSubmit} isFloat={isFloat} />
    );
  }, [onSubmit, orderType, isFloat]);

  return (
    <TradeMask>
      {showVerify ? (
        <Verify />
      ) : (
        <Fragment>
          {isThirdStep && (
            <AuctionTradeDescWrapper>
              <Alert type="warning" title={_t('5m5TS9w6153vynKLTAuinF')} />
            </AuctionTradeDescWrapper>
          )}

          {!isMd && (
            <SideContext.Provider value={{ side, setSide }}>
              <WithPadding>
                <TradeSide />
              </WithPadding>
            </SideContext.Provider>
          )}
          <OrderTabBar>
            <OrderTypeTabBox isMd={isMd} isFloat={isFloat}>
              <OrderTypeTab />
              <IntroTips />
            </OrderTypeTabBox>
            {isMd && isMargin && <LeverageSetting className="ml-12" />}
          </OrderTabBar>
          <Content>
            {isMd ? (
              <Container>
                <FormContainer>
                  <SideContext.Provider value={{ side: 'buy' }}>{currentForm}</SideContext.Provider>
                  {isTrade && <LazyCouponDiscount />}
                </FormContainer>
                <FormContainer>
                  <SideContext.Provider value={{ side: 'sell' }}>
                    {currentForm}
                  </SideContext.Provider>
                </FormContainer>
              </Container>
            ) : (
              <SideContext.Provider value={{ side }}>
                {currentForm}
                {isTrade && <LazyCouponDiscount />}
              </SideContext.Provider>
            )}
            {isLogin && isBoolean(hasPwd) && !hasPwd && (
              <Alert
                type="error"
                title={
                  <PwdGuide>
                    {_tHTML('trd.form.link.assetPwd', {
                      assetPwdUrl: addLangToPath(`${MAINSITE_HOST}/account/security/protect`),
                    })}
                  </PwdGuide>
                }
              />
            )}
          </Content>
          {isNeedVerify === false && tradeType === SPOT && <BalanceSocket />}
          {isNeedVerify === false && tradeType === MARGIN && <CrossPositonSocket />}
          {isNeedVerify === false && tradeType === ISOLATED && <IsolatedPositonSocket />}
        </Fragment>
      )}
    </TradeMask>
  );
});

// 现货跟杠杆的表单 Content 拆出来
const OrderFormSpotAndMargin = React.memo(({ side: initSide, ...restProps }) => {
  const [side, setSide] = useState(initSide || 'buy');

  useEffect(() => {
    if (initSide) {
      setSide(initSide);
    }
  }, [initSide]);

  return <OrderForm side={side} setSide={setSide} {...restProps} />;
});

// 合约表单
const OrderFormFutures = React.memo(({ ...resetProps }) => {
  return (
    <>
      <FuturesFormNew {...resetProps} />
    </>
  );
});

const OrderFormWithWrapper = ({ id, isFloat, ...restProps }) => {
  const tradeType = useTradeType();

  return (
    <ComponentWrapper name={name} breakPoints={[560]}>
      <YScreenWrapper>
        <Wrapper className="order-form">
          <TabBar>
            <TradeTypeTab isFloat={isFloat} />
          </TabBar>
          {tradeType === FUTURES ? (
            <OrderFormFutures isFloat={isFloat} {...restProps} />
          ) : (
            <OrderFormSpotAndMargin isFloat={isFloat} {...restProps} />
          )}
        </Wrapper>
      </YScreenWrapper>
    </ComponentWrapper>
  );
};

export default React.memo(OrderFormWithWrapper);
