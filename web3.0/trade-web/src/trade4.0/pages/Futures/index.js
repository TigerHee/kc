/**
 * Owner: garuda@kupotech.com
 * 合约需要全局初始化的放置的位置
 */
import React, { memo, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'dva';

import { FUTURES_CROSS_GRAY_AB } from 'src/trade4.0/meta/futuresSensors/trade';
import { trackClick } from 'utils/ga';
import storage from 'utils/storage';

import loadable from '@loadable/component';

import CompliantRule from '@/components/CompliantRule';
import { useTradeType } from '@/hooks/common/useTradeType';
import useWatchPageHidden from '@/hooks/common/useWatchPageHidden';
import { useCrossGrayScaleReady } from '@/hooks/futures/useCrossGrayScale';
import { useFuturesGetTaxFee } from '@/hooks/futures/useFuturesTakerFee';
import { FUTURES, isFuturesCrossNew, isFuturesNew, isOpenFuturesCross } from '@/meta/const';
import { MARGIN_MODE_OPENED_STORAGE_KEY, MARGIN_MODE_STORAGE_KEY } from '@/meta/futures';
import { FUTURES_TRIAL_COUPONS } from '@/meta/multSiteConfig/futures';
import { futuresSensors } from '@/meta/sensors';
import { futuresFeatureToggle } from '@/utils/featureToggle';
import { FEATURE_FUTURES_TAX } from '@/utils/featureToggle/constant';

import Leverage from './components/Leverage';
import MarkPriceSubscribe from './components/MarkPriceSubscribe';
import { useResultPromptInit } from './components/ResultPromptDialog/hooks';
import SettleWarningCheck from './components/SettleDateTip/SettleWarningCheck';
import CalcRoot from './components/SocketDataFormulaCalc';
import useCouponInit from './hooks/useCouponInit';
import { useCrossGrayInit, useCrossInit } from './hooks/useCrossInit';
import useFuturesOrdersInit from './hooks/useFuturesOrdersInit';
import useGlobalSocketSubscribe from './hooks/useGlobalSocketSubscribe';
import useInitRequest from './hooks/useInitRequest';
import useTrialFundInit from './hooks/useTrialFundInit';

import AutoMarginTips from '../InfoBar/SettingsToolbar/TradeSetting/AutoMarginTips';

const MarginModeExplainDialog = loadable(() =>
  import(
    /* webpackChunkName: 'futures-dialog-1' */ './components/MarginMode/MarginModeExplainDialog'
  ),
);
const MarginModeSwitchDialog = loadable(() =>
  import(
    /* webpackChunkName: 'futures-dialog-1' */ './components/MarginMode/MarginModeSwitchDialog'
  ),
);
const ResultPromptDialog = loadable(() =>
  import(/* webpackChunkName: 'futures-dialog-1' */ './components/ResultPromptDialog'),
);

// 合约开通奖励弹窗
const OpenFuturesBonusModal = loadable(() => {
  return import(/* webpackChunkName: 'futures-dialog-2' */ '@/pages/OpenFutures/BonusModal');
});

// 合约开通无奖励弹窗
const OpenFuturesNoBonusModal = loadable(() => {
  return import(/* webpackChunkName: 'futures-dialog-2' */ '@/pages/OpenFutures/NoBonusModal');
});

const PnlShareDialog = loadable(() =>
  import(/* webpackChunkName: 'futures-dialog-2' */ './components/PnlShare'),
);

const MarginModeErrorDialog = loadable(() =>
  import(
    /* webpackChunkName: 'futures-dialog-1' */ './components/MarginMode/MarginModeErrorDialog'
  ),
);

const GlobalSubscribe = memo(() => {
  useGlobalSocketSubscribe();
  return null;
});

const OrderInit = memo(() => {
  console.log('=====render');
  useFuturesOrdersInit();
  return null;
});

const InitRequest = memo(() => {
  useInitRequest();
  return null;
});

const TrialFundInit = memo(() => {
  useTrialFundInit();
  return null;
});

const CouponInit = memo(() => {
  useCouponInit();
  return null;
});

const CommonInit = memo(() => {
  // 埋点
  futuresSensors.futuresNew();
  // 结果弹框初始化
  useResultPromptInit();
  return null;
});

const GrayInit = memo(() => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  // 全仓灰度请求
  useCrossGrayInit();
  // 退出登陆之后，清空当前模式跟账务模式的缓存值
  useEffect(() => {
    if (!isLogin) {
      dispatch({
        type: 'futuresMarginMode/update',
        payload: {
          marginModeMap: {},
          occupancyMode: false,
        },
      });
      storage.removeItem(MARGIN_MODE_STORAGE_KEY);
      storage.removeItem(MARGIN_MODE_OPENED_STORAGE_KEY);
    }
  }, [dispatch, isLogin]);

  return null;
});

const CrossInit = memo(() => {
  // 全仓请求初始化
  useCrossInit();
  return null;
});

const TaxInit = memo(() => {
  const { getTaxFee } = useFuturesGetTaxFee();

  useEffect(() => {
    getTaxFee();
  }, [getTaxFee]);

  return null;
});

// 全仓灰度 ready 之后，需要进行重试的逻辑
const CrossReadyRetry = memo(() => {
  const dispatch = useDispatch();

  // 获取合约资产
  useEffect(() => {
    dispatch({ type: 'futuresAssets/pullOverview' });
  }, [dispatch]);

  return null;
});

const FuturesInit = () => {
  const tradeType = useTradeType();
  const crossGreyReady = useCrossGrayScaleReady();
  useWatchPageHidden();

  const isFuturesType = useMemo(() => {
    return tradeType === FUTURES;
  }, [tradeType]);

  useEffect(() => {
    trackClick([FUTURES_CROSS_GRAY_AB, '1']);
    // 命中 ab 的
    if (isFuturesCrossNew()) {
      trackClick([FUTURES_CROSS_GRAY_AB, '2']);
    }
  }, []);

  if (!isFuturesNew()) return null;

  return (
    <>
      {/* 结果反馈弹框 */}
      <ResultPromptDialog />
      <GlobalSubscribe />
      <OrderInit />
      <InitRequest />
      {isFuturesCrossNew() && isOpenFuturesCross() ? <GrayInit /> : null}
      {isFuturesCrossNew() && crossGreyReady ? <CrossInit /> : null}
      {crossGreyReady ? <CrossReadyRetry /> : null}
      <CommonInit />
      <AutoMarginTips />
      {/* 标记价格订阅 */}
      <MarkPriceSubscribe />
      {/* 仓位字段更新 */}
      <CalcRoot />
      {/* 杠杆 */}
      <Leverage />
      {/* 体验金初始化 */}
      {isFuturesType ? (
        <CompliantRule ruleId={FUTURES_TRIAL_COUPONS}>
          <TrialFundInit />{' '}
        </CompliantRule>
      ) : null}
      {/* 抵扣券初始化 */}
      {isFuturesType ? (
        <CompliantRule ruleId={FUTURES_TRIAL_COUPONS}>
          <CouponInit />
        </CompliantRule>
      ) : null}
      {/* 仓位保证金模式 */}
      {isFuturesCrossNew() ? (
        <>
          <MarginModeExplainDialog />
          <MarginModeSwitchDialog />
          <MarginModeErrorDialog />
        </>
      ) : null}
      {/* 税费初始化 */}
      {futuresFeatureToggle(FEATURE_FUTURES_TAX) ? <TaxInit /> : null}
      {/* 开通合约弹框 */}
      <OpenFuturesBonusModal />
      <OpenFuturesNoBonusModal />
      {/* 分享弹框 */}
      {isFuturesType ? <PnlShareDialog /> : null}
      {/* 下线check 弹框 */}
      <SettleWarningCheck />
    </>
  );
};

export default memo(FuturesInit);
