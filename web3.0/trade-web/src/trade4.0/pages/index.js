/*
 * owner: Borden@kupotech.com
 */
import { useTradeType } from '@/hooks/common/useTradeType';
import usePageInit from '@/hooks/pageInit';
import useComponentsInit from '@/hooks/pageInit/useComponentsInit';
import useIsMargin from '@/hooks/useIsMargin';
import { getSingleModule } from '@/layouts/utils';
import OrderbookInit from '@/pages/Orderbook/Init';
import RecentTradeInit from '@/pages/RecentTrade/Init';
import { styled, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { connect, useDispatch, useSelector } from 'dva';
import React, { Fragment, memo, Suspense, useEffect } from 'react';
// import { isTriggerTrade } from 'pages/Trade3.0/components/TradeBox/TradeForm/const';
import BonusBuoy from '@/components/BonusBuoy';
import MarginHandler from '@/components/Margin/Handler';
import IsolatedHandler from '@/components/Margin/IsolatedHandler';
import useQuickOrderState from '@/components/QuickOrder/useQuickOrderState';
import { MarkPriceSocket } from '@/components/SocketSubscribe';
import requireProps from '@/hocs/requireProps';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import FuturesInit from '@/pages/Futures/index';
import { useAuctionInit, useAuctionThirdStep } from '@/pages/OrderForm/hooks/useOrderState';
import { useSocketPull } from '@/pages/Orders/OpenOrders/hooks/useSocketPull';
import { GlobalStyle } from '@/style/global';
import { getSymbolAuctionInfo } from '@/utils/business';
import MarketsInitHook from './NewMarkets/initHooks';
import NewMarketSocketInit from './NewMarkets/SocketInit';
import SatisfactionSurveyMain from './Portal/SatisfactionSurvey/main';
import TaxInfoCollectDialog from './Portal/TaxInfoCollectDialog';

const MainWrapper = styled.main`
  height: ${({ isExtraHeight }) => {
    if (isExtraHeight) {
      return 'calc(100% + 240px)';
    }
    return '100%';
  }};

  > header {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
  }
`;

const OrderSocketHooks = memo(() => {
  useSocketPull();
  return null;
});

const CallAuctionFirstStep = memo(() => {
  useAuctionThirdStep();
  return null;
});

const CallAuctionHooks = memo(() => {
  const dispatch = useDispatch();
  // 集合竞价初始化
  useAuctionInit();
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );

  const symbolInfo = getSymbolInfo({ symbol: currentSymbol });
  const { showAuction } = getSymbolAuctionInfo(
    symbolInfo,
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  useEffect(() => {
    if (!showAuction) {
      dispatch({
        type: 'callAuction/update',
        payload: {
          isThirdStep: false,
        },
      });
    }
  }, [showAuction, currentSymbol, dispatch]);

  return showAuction ? <CallAuctionFirstStep /> : null;
});

const XlLayout = loadable(() =>
  import(/* webpackChunkName: 'tradev4-XlLayout' */ '@/layouts/XlLayout'),
);
const SingleLayout = loadable(() =>
  import(/* webpackChunkName: 'tradev4-SingleLayout' */ '@/layouts/SingleLayout'),
);
const LgLayout = loadable(() =>
  import(/* webpackChunkName: 'tradev4-LgLayout' */ '@/layouts/LgLayout'),
);
const SmLayout = loadable(() =>
  import(/* webpackChunkName: 'tradev4-SmLayout' */ '@/layouts/SmLayout'),
);
const XsLayout = loadable(() =>
  import(/* webpackChunkName: 'tradev4-XsLayout' */ '@/layouts/XsLayout'),
);
const Header = loadable(() => import(/* webpackChunkName: 'tradev4-Header' */ '@/pages/Header'));

const LoginDrawer = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-loginDrawer' */ '@/pages/Portal/LoginDrawer');
});
const ForgetPwdDrawer = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-forgetPwdDrawer' */ '@/pages/Portal/ForgetPwdDrawer');
});

const MarginModal = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-newMarginModal' */ '@/pages/Portal/NewMarginModal');
});

const LeverageModal = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-newLeverageModal' */ '@/pages/Portal/NewLeverageModal'
  );
});

const TransferModal = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-transferModal' */ '@/pages/Portal/TransferModal');
});

// 开通杠杆提示弹窗
const DialogTip = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-dialogTip' */ '@/pages/Portal/MarginMask/DialogTip');
});

// 快速开始
const QuickOrder = loadable(() => {
  return import(/* webpackChunkName: 'tradev4-quickOrder' */ '@/components/QuickOrder');
});

// 一键平仓
const ClosePositionModal = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-closePositionModal' */ '@/pages/Portal/ClosePositionModal'
  );
});

// 取消一键平仓
const CancelClosePositionModal = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-cancelPositionModal' */ '@/pages/Portal/CancelClosePositionModal'
  );
});

// ip、kyc等order后错误弹窗
const PublicDialog = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-publicDialog' */ 'src/components/PublicDialog');
});

// 买卖盘与深度图初始化数据
const OBAndRTInit = () => {
  const { isOrderBookInit, isRecentTradeInit } = useComponentsInit();
  return (
    <Fragment>
      {isOrderBookInit ? <OrderbookInit /> : null}
      {isRecentTradeInit ? <RecentTradeInit /> : null}
    </Fragment>
  );
};

const Index = React.memo(() => {
  const tradeType = useTradeType();
  // 页面初始化
  usePageInit();

  const isMargin = useIsMargin();
  const userPosition = useSelector((state) => state.marginMeta.userPosition);
  const currentLayout = useSelector((state) => state.setting.currentLayout);
  const { openFlag = false } = userPosition || {};
  const { xl, lg, sm } = useResponsive();
  const isLogin = useSelector((state) => state.user.isLogin);
  const { isQuickOrderEnable, quickOrderVisible } = useQuickOrderState();
  const { isSingle } = getSingleModule();

  const renderLayout = () => {
    if (xl) {
      return <XlLayout />;
    }
    if (lg) {
      return <LgLayout />;
    }
    if (sm) {
      return <SmLayout />;
    }
    return <XsLayout />;
  };

  return (
    <Fragment>
      <OrderSocketHooks />
      <CallAuctionHooks />
      <NewMarketSocketInit />
      <OBAndRTInit />
      <GlobalStyle />
      <MarketsInitHook />
      {isSingle ? (
        <SingleLayout />
      ) : (
        <MainWrapper
          className="kflex kv"
          isExtraHeight={xl && currentLayout !== 'fullscreen'}
          {...(xl ? { id: 'trade4-xl-container' } : null)}
        >
          <Header />
          {renderLayout()}
        </MainWrapper>
      )}
      {/* 合约初始化 */}
      <FuturesInit />
      {isLogin === false ? (
        <Fragment>
          <Suspense fallback={<div />}>
            <LoginDrawer />
          </Suspense>
          <Suspense fallback={<div />}>
            <ForgetPwdDrawer />
          </Suspense>
        </Fragment>
      ) : null}
      {/* 全局初始化的一些东西 */}
      {tradeType === TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key && openFlag && (
        <Fragment>
          <IsolatedHandler />
          <Suspense fallback={<div />}>
            <ClosePositionModal />
            <CancelClosePositionModal />
          </Suspense>
        </Fragment>
      )}
      {!!(isMargin && openFlag) && (
        <React.Fragment>
          <MarginHandler />
          <Suspense fallback={<div />}>
            <MarginModal />
          </Suspense>
          <Suspense fallback={<div />}>
            <LeverageModal />
          </Suspense>
        </React.Fragment>
      )}
      {!!isLogin && (
        <React.Fragment>
          <Suspense fallback={<div />}>
            <TransferModal />
          </Suspense>
          <Suspense fallback={<div />}>
            <PublicDialog />
          </Suspense>
        </React.Fragment>
      )}
      {!!(isMargin && openFlag === false) && (
        <Suspense fallback={<div />}>
          <DialogTip />
        </Suspense>
      )}
      {isMargin && <MarkPriceSocket />}
      {lg && isQuickOrderEnable && quickOrderVisible && !isSingle && <QuickOrder />}
      {!isSingle && <BonusBuoy />}
      {!!isLogin && <TaxInfoCollectDialog />}
      <SatisfactionSurveyMain />
    </Fragment>
  );
});

export default connect((state) => {
  const symbols = state.symbols.symbols;
  return {
    symbols,
  };
})(
  requireProps({
    symbols(v) {
      return v?.length;
    },
  })(Index),
);
