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
import FAQ from '../containers/FAQ';
import Footer from '../containers/Footer';
import Header from '../containers/Header';
import Process from '../containers/Process';
import { useHideScollBarInApp } from '../hooks';
import { StyledPage } from '../styledComponents';
import Banner from './Banner';
import CardList from './CardList';

const { SnackbarProvider } = Snackbar;
export default function Aptp() {
  useAppInit();
  const faqRef = useRef();
  const pageRef = useRef();
  const processRef = useRef();
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
          statusBarIsLightMode: false, // 状态栏文字颜色为白色（状态栏固定黑色）
          statusBarTransparent: true,
          visible: false,
          background: '#1D1D1D',
        },
      });
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
          <StyledPage id="premarketLandingPage" ref={pageRef}>
            <NoSSG>
              <Header theme="dark" showMore={true}>
                {_t('p2oTgByxdzWA9H6cob7umF')}
              </Header>
            </NoSSG>
            <Banner faqRef={faqRef} />
            <CardList />
            <Process ref={processRef} />
            <FAQ ref={faqRef} />
            <NoSSG>
              <Footer />
            </NoSSG>
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
