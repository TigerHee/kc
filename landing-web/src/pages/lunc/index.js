/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { WOW } from 'wowjs';
import { delay, debounce } from 'lodash';
import QRCode from 'qrcode.react';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { SHARE_APP_HOST } from 'config';

import { styled } from '@kufox/mui/emotion';
import { ThemeProvider as KuFoxThemeProvider } from '@kufox/mui';
import JsBridge from 'utils/jsBridge';
import { sensors } from 'src/utils/sensors';

import HomePage from 'components/$/Lunc/HomePage';
import PosterShare from 'components/$/Lunc/PosterShare';

import { LANDING_HOST } from 'utils/siteConfig';
import 'animate.css';
import Header from 'src/components/$/Lunc/HomePage/Header';
import { addLangToPath } from 'src/utils/lang';

// --- 样式start ---
const Wrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: black;
`;
const Page = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  background: #00142a;
  @media (min-width: 428px) {
    margin: 0 auto;
    max-width: 428px;
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
  const { appReady, isInApp, supportCookieLogin, appInfo } = useSelector(state => state.app);
  const { inviteCode } = useSelector(state => state.kcCommon); // 邀请码
  const shareRef = useRef(null); // 分享ref
  const landUrlHost = useMemo(
    () => (isInApp ? `${appInfo?.webHost || SHARE_APP_HOST}/land` : LANDING_HOST),
    [isInApp, appInfo],
  );
  // 分享给好友的链接
  const shareLink = useMemo(
    () => {
      return inviteCode
        ? addLangToPath(`${landUrlHost}/lunc?rcode=${inviteCode}`)
        : addLangToPath(`${landUrlHost}/lunc`);
    },
    [inviteCode, landUrlHost],
  );
  const goShare = useCallback(
    debounce(
      async () => {
        shareRef.current.goShare();
        // 埋点
        sensors.trackClick(['Share', '1']);
      },
      300,
      { leading: true, trailing: false },
    ),
    [],
  );

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


  useEffect(
    () => {
      dispatch({
        type: 'lunc/pullMarketInfo',
      });
      dispatch({ type: 'lunc/getPostDetail' });
    },
    [dispatch],
  );

  useEffect(
    () => {
      appReady && delay(handleJSOpen, 300);
    },
    [appReady, handleJSOpen],
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
          id="lunc-QRCode-url"
          style={{ position: 'absolute', visibility: 'hidden', zIndex: -1, bottom: 0 }}
        />
      );
    },
    [shareLink],
  );
  return (
    <KuFoxThemeProvider>
      <Wrapper>
        <Page id="LUNC_SCROLL_EL" data-inspector="luncPage">
          <Header goShare={goShare} />
          <HomePage goShare={goShare} btnClickCheck={btnClickCheck} />
        </Page>
        <>{getQRCode}</>
        <PosterShare ref={shareRef} type="activity" />
      </Wrapper>
    </KuFoxThemeProvider>
  );
};

export default brandCheckHoc(IndexPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
