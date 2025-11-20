/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kc/mui';
import {
  LocaleProvider as KuFoxLocaleProvider,
  ThemeProvider as KuFoxThemeProvider,
  Snackbar as KuFoxSnackbar,
  Notification as KuFoxNotification,
} from '@kufox/mui';
import { useLocale } from '@kucoin-base/i18n';
import { ThemeProvider as KuxThemeProvider, Snackbar, Notification } from '@kux/mui';
import EventProxy from 'components/EventProxy';
import useYandex from 'hooks/useYandex';
import useTwitterAds from 'hooks/useTwitterAds';
import useAppReport from 'hooks/useAppReport';
import usePullLangList from 'hooks/usePullLangList';
import { usePullCountryInfo } from 'hooks/useCountryInfo';
import usePullUser from 'hooks/usePullUser';
import useNewcomerConfig from 'hooks/useNewcomerConfig'; // 获取福利中心配置

//import { ErrorBoundary } from '@sentry/react/dist/errorboundary';
import registerModels from 'hocs/registerModels';
import ErrorFallback from './ErrorFallback';
import ErrorBoundary from 'components/ErrorBoundary';
import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/styles';
import { Global } from '@kux/mui/emotion';
import useLocaleOrder from 'hooks/useLocaleOrder';
import Toast from './Toast';

const { SnackbarProvider } = KuFoxSnackbar;
const { NotificationProvider } = KuFoxNotification;
const GlobalStyleReset = () => (
  <Global
    styles={`
    body *{
      font-family: Roboto;
    }
  body fieldset {
    min-width: initial;
    padding: initial;
    margin: initial;
    border: initial;
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    padding-block-start: 0.35em;
    padding-inline-start: 0.75em;
    padding-inline-end: 0.75em;
    padding-block-end: 0.625em;
  }
  body legend {
    width: initial;
    padding: initial;
    padding-inline-start: 2px;
    padding-inline-end: 2px;
  }
  [dir="rtl"] .KuxTable-root table tr td:first-of-type:before {
    right: -40px !important;
    border-radius: 0 16px 16px 0;
  }
  [dir="rtl"] .KuxTable-root table tr td:last-of-type:after {
    left: -40px !important;
    right: auto !important;
    border-radius: 16px 0 0 16px;
  }
  [dir='rtl'] & .ICArrowRight_svg__icon {
    transform: rotate(180deg);
  }
`}
  />
);

// 当mui 被完全移除后，移除该jss 配置；
// 当前配置主要解决jss 在ssg与非ssg 的时候插入节点位置不同导致样式被覆盖的问题
const jssConfig = {};

const jssInsertPoint = document.querySelector('#jss-insertion-point');
if (jssInsertPoint) {
  jssConfig.insertionPoint = jssInsertPoint;
}

const jss = create({
  ...jssPreset(),
  // 当将样式注入到 DOM 中时，定义了一个自定义插入点以供 JSS 查询。
  ...jssConfig,
});

const JssWrapper = (props) => {
  return <StylesProvider jss={jss}>{props.children}</StylesProvider>;
};

function WithMuiLocaleProvider({ children }) {
  const { currentLang } = useLocale();
  return <KuFoxLocaleProvider lang={currentLang}>{children}</KuFoxLocaleProvider>;
}

export default registerModels((props) => {
  useAppReport();
  useYandex();
  useTwitterAds();
  usePullLangList();
  usePullCountryInfo();
  usePullUser();
  useNewcomerConfig();
  useLocaleOrder();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <EventProxy>
        <JssWrapper>
          <ThemeProvider>
            <KuFoxThemeProvider>
              <KuxThemeProvider>
                <Snackbar.SnackbarProvider>
                  <SnackbarProvider>
                    <Notification.NotificationProvider>
                      <NotificationProvider>
                        <WithMuiLocaleProvider>
                          {props.children}
                          <GlobalStyleReset />
                          <Toast />
                        </WithMuiLocaleProvider>
                      </NotificationProvider>
                    </Notification.NotificationProvider>
                  </SnackbarProvider>
                </Snackbar.SnackbarProvider>
              </KuxThemeProvider>
            </KuFoxThemeProvider>
          </ThemeProvider>
        </JssWrapper>
      </EventProxy>
    </ErrorBoundary>
  );
});
