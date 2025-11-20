/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useCallback, Fragment, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { WOW } from 'wowjs';
import { delay, debounce, isNil } from 'lodash';
import { _t } from 'utils/lang';
import QRCode from 'qrcode.react';

import { styled } from '@kufox/mui/emotion';
import { ThemeProvider as KuFoxThemeProvider } from '@kufox/mui';
import JsBridge from 'utils/jsBridge';
import HomePage from 'components/$/Prediction/HomePage';
import TipDialog from 'components/$/Prediction/TipDialog';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { WinnerTipDialog, ActivityEndDialog } from 'components/$/Prediction/Dialogs';

import UserLimitedInfoDialog from 'components/UserLimitedInfoDialog'; // 身份限制提醒弹窗
import { LANDING_HOST } from 'utils/siteConfig';
import 'animate.css';

// --- 样式start ---
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  @media (min-width: 1040px) {
    background: black;
  }
`;
const Page = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  @media (min-width: 1040px) {
    margin: 0 auto;
    max-width: 375px;
    ::-webkit-scrollbar {
      background: transparent;
      width: 2px;
      height: 2px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: rgba(0, 20, 42, 0.2);
    }
  }
`;
// --- 样式 end ---

// 2022-06-19 竞猜活动
const IndexPage = () => {
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector(state => state.user);
  const { appReady, isInApp, supportCookieLogin } = useSelector(state => state.app);
  const {
    showTipDialog,
    activityConfig,
    inviteCode,
    showWinnerTipDialog,
    showActivityEndDialog,
    winnerTipInfo, // 中奖弹窗数据
  } = useSelector(state => state.prediction);
  // 显示限制弹窗与否 用户必须是 type 为1 才可以参加活动
  const showUserLimitedDialog = user && user?.type !== 1;
  const { isEnd: activityIsEnd } = activityConfig; // 活动的整体开始时间 和 结束时间
  // 分享给好友的链接
  const shareLink = inviteCode
    ? `${LANDING_HOST}/prediction?rcode=${inviteCode}`
    : `${LANDING_HOST}/prediction`;
  const showWinnerModal = showWinnerTipDialog && isLogin; // 是否展示中奖提醒弹窗 PS: 活动结束状态下，优先弹窗中奖提醒弹窗
  const showEndModal = useMemo(
    () => {
      if (!isNil(isLogin) && !isLogin) {
        // isLogin 初始值是 undefined 会影响判断, 所以必须要判断isNil
        return showActivityEndDialog; // 如果用户没有登录就只需要考虑是否处在活动周期中
      } else if (!isNil(isLogin) && isLogin) {
        return showActivityEndDialog && !showWinnerModal && winnerTipInfo?.gotRes; // 如果用户登录了就需要考虑是否处在活动周期中且没有展示中奖提醒才展示
      }
      return false;
    },
    [isLogin, winnerTipInfo, showWinnerModal, showActivityEndDialog],
  ); // 是否展示活动结束弹窗
  // 初始化动画
  useEffect(() => {
    new WOW({
      offset: 200,
    }).init();
  }, []);

  const handleJSOpen = useCallback(() => {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'onPageMount',
      },
    });
  }, []);

  // 轮询
  useEffect(
    () => {
      dispatch({
        type: 'prediction/pullMarketInfo@polling',
        payload: { symbols: 'ETH-USDT' },
      });
      dispatch({
        type: 'prediction/getConfig',
      });
      return () => {
        dispatch({
          type: 'prediction/pullMarketInfo@polling:cancel',
        });
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      appReady && delay(handleJSOpen, 300);
    },
    [appReady, handleJSOpen],
  );

  // 如果活动已经结束了就展示活动已结束的弹窗
  useEffect(
    () => {
      if (activityIsEnd) {
        dispatch({
          type: 'prediction/update',
          payload: {
            showActivityEndDialog: true,
          },
        });
      }
    },
    [activityIsEnd, dispatch, isLogin],
  );
  const handleLogin = useCallback(
    () => {
      // 在App里面，同时支持注入Cookie登录
      if (isInApp && supportCookieLogin) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: '/user/login',
          },
        });
        return;
      }
      dispatch({
        type: 'user/update',
        payload: {
          showLoginDrawer: true,
        },
      });
    },
    [isInApp, supportCookieLogin, dispatch],
  );

  // 统一检查登录、报名等所有前置条件, 未登陆就先登录
  const btnClickCheck = useCallback(
    // 防抖处理
    debounce(
      async () => {
        if (!isLogin) {
          handleLogin();
          return false;
        }
        return true;
      },
      300,
      { leading: true, trailing: false },
    ),
    [isLogin, handleLogin, dispatch],
  );
  // 分享海报的二维码
  const getQRCode = useMemo(
    () => {
      return (
        <QRCode
          size={50}
          value={shareLink}
          id="prediction-QRCode-url"
          style={{ position: 'absolute', visibility: 'hidden', zIndex: -1, bottom: 0 }}
        />
      );
    },
    [shareLink],
  );
  return (
    <KuFoxThemeProvider>
      <Wrapper>
        <Page data-inspector="predictionIndexPage">
          <HomePage btnClickCheck={btnClickCheck} />
        </Page>
        <Fragment>{showTipDialog ? <TipDialog /> : ''}</Fragment>
        <Fragment>{showEndModal ? <ActivityEndDialog /> : ''}</Fragment>
        <Fragment>{showWinnerModal ? <WinnerTipDialog /> : ''}</Fragment>
        <Fragment>
          {showUserLimitedDialog ? (
            <UserLimitedInfoDialog
              open={showUserLimitedDialog}
              title={_t('prediction.limit.title')}
              des={_t('prediction.limit.dec')}
              okText={_t('prediction.limit.btn')}
            />
          ) : (
            ''
          )}
        </Fragment>
        <Fragment>{getQRCode}</Fragment>
      </Wrapper>
    </KuFoxThemeProvider>
  );
};

export default brandCheckHoc(IndexPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
