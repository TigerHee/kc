/**
 * Owner: solarxia@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { css, EmotionCacheProvider, Global, Snackbar, ThemeProvider } from '@kux/mui';
import { useEffect, useRef } from 'react';
import NoSSG from 'src/components/NoSSG';
import { useSelector } from 'src/hooks/useSelector';
import SloganFont from 'src/routes/HomePage/font/Roboto-Bold.woff2';
import { saTrackForBiz } from 'src/utils/ga';
import { _t } from 'tools/i18n';
import useAppInit from 'TradeActivity/hooks/useAppInit';
import { exposePageStateForSSG } from 'utils/ssgTools';
import GlobalTransferScope from '../Root/GlobalTransferScope';
import Banner from './containers/Banner';
import Confirm from './containers/Confirm';
import Footer from './containers/Footer';
import Header from './containers/Header';
import Main from './containers/Main';
import { useHideScollBarInApp } from './hooks';
import { StyledPage } from './styledComponents';

const { SnackbarProvider } = Snackbar;
export default function PreMarket() {
  useAppInit();
  const faqRef = useRef();
  const coinTabsRef = useRef();
  const pageRef = useRef();
  const isInApp = JsBridge.isApp();
  const { isRTL } = useLocale();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  useHideScollBarInApp();

  useEffect(() => {
    // 曝光埋点
    try {
      saTrackForBiz({}, ['B5PreMarket', '1'], {});
    } catch (error) {}

    exposePageStateForSSG((dvaState) => {
      const deliveryCurrencyListState = dvaState.aptp.deliveryCurrencyList || [];

      return {
        aptp: {
          deliveryCurrencyList: deliveryCurrencyListState,
        },
      };
    });
  }, []);

  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          // statusBarIsLightMode: false, // 状态栏文字颜色为白色
          statusBarIsLightMode: currentTheme !== 'dark', // 状态栏文字颜色为黑色 true为黑色
          statusBarTransparent: true,
          visible: false,
          background: '#1D1D1D',
        },
      });
      // JsBridge.open({ type: 'func', params: { name: 'updateBackgroundColor', color: '#1D1D1D' } });
    }
  }, [isInApp, currentTheme]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <SnackbarProvider>
          <Global
            styles={css`
              /* .KuxAlert-root.KuxAlert-warning {
              margin-top: 16px !important;
            } */
              .KuxAlert-description {
                margin: 0 !important;
              }
            `}
          />
          {/** 参考首页 Slogan 专用字体，避免没加载到 */}
          <Global
            styles={css`
              @font-face {
                font-weight: 700;
                font-family: SloganRoboto;
                src: url(${SloganFont}) format('woff2');
                font-display: swap;
              }
            `}
          />
          <Global
            styles={css`
              ::-webkit-scrollbar {
                display: none !important;
                width: 0px !important;
              }
            `}
          />
          <StyledPage id="premarketCoinPage" ref={pageRef}>
            <NoSSG>
              <Header>{_t('p2oTgByxdzWA9H6cob7umF')}</Header>
            </NoSSG>
            <Banner coinTabsRef={coinTabsRef} />
            <Main coinTabsRef={coinTabsRef} pageRef={pageRef} endRef={faqRef} />
            <div ref={faqRef} />
            <NoSSG>
              <Confirm />
            </NoSSG>
            <NoSSG>
              <Footer />
            </NoSSG>
            <GlobalTransferScope />
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
