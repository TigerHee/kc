/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import { ThemeProvider as KuFoxThemeProvider } from '@kc/mui';
import { KufoxProvider } from '@kufox/mui';
import zh_CN from '@kc/entrance/lib/locale/zh_CN';

// import sZh from '@kc/security/lib/locale/zh_CN';
import kycForm_CN from '@kc/kyc/lib/locale/zh_CN';
import k4_US from '@kc/404/lib/locale/en_US';
import en_US from '@kc/entrance/lib/locale/en_US';
import headerEN_US from '@kc/header/lib/locale/en_US';
import headerbn_BD from '@kc/header/lib/locale/fil_PH';

import ja_JPIM from '@kc/im/lib/locale/en_US';

import { LocaleProvider } from '@kc/entrance/lib/componentsBundle';
// import { LocaleProvider as SLocaleProvider } from '@kc/security/lib/componentsBundle';
import { LocaleProvider as KycLocaleProvider } from '@kc/kyc/lib/componentsBundle';
import { LocaleProvider as K4LocaleProvider } from '@kc/404/lib/componentsBundle';

import { LocaleProvider as IMLocaleProvider } from '@kc/im/lib/componentsBundle';
import { LocaleProvider as FooterLocaleProvider } from '@kc/footer/lib/componentsBundle';

// import { HumanCaptcha } from '@kc/robot-test/lib/componentsBundle';
import {
  Login,
  SignUp,
  ForgetPwd,
  Kyc,
  Error,
  SignUp4KuMex,
  TradePwd,
  Guide,
  IM,
  Header,
  TransparentHeader,
  Tips,
  Footer,
} from './pages';

export default function({ history }) {
  return (
    <KuFoxThemeProvider theme="light">
      <KufoxProvider>
        {/* <Link href="https://www.kucoin.com/">kucoin</Link> */}
        <Router history={history}>
          <Switch>
            <Route
              path="/login"
              component={() => (
                <LocaleProvider locale={en_US}>
                  <Login history={history} />
                </LocaleProvider>
              )}
            />
            <Route
              path="/sign"
              component={() => (
                <LocaleProvider locale={zh_CN}>
                  <SignUp />
                </LocaleProvider>
              )}
            />
            <Route path="/signup" component={SignUp4KuMex} />
            <Route
              path="/forgetPwd"
              component={() => (
                <LocaleProvider locale={zh_CN}>
                  <ForgetPwd />
                </LocaleProvider>
              )}
            />
            <Route path="/tradePwd" component={TradePwd} />
            <Route
              path="/kyc"
              component={() => (
                <KycLocaleProvider locale={kycForm_CN}>
                  <Kyc />
                </KycLocaleProvider>
              )}
            />
            <Route
              path="/404"
              component={() => {
                return (
                  <K4LocaleProvider locale={k4_US}>
                    <Error />
                  </K4LocaleProvider>
                );
              }}
            />
            <Route
              path="/guide"
              component={() => {
                return (
                  <LocaleProvider locale={en_US}>
                    <Guide />
                  </LocaleProvider>
                );
              }}
            />
            <Route
              path="/im"
              component={() => {
                return (
                  <IMLocaleProvider locale={ja_JPIM}>
                    <IM />
                  </IMLocaleProvider>
                );
              }}
            />
            <Route
              path="/tips"
              component={() => {
                return (
                  <LocaleProvider locale={en_US}>
                    <Tips />
                  </LocaleProvider>
                );
              }}
            />
            <Route
              path="/header"
              component={() => {
                return (
                  <LocaleProvider locale={headerbn_BD}>
                    <Header />
                  </LocaleProvider>
                );
              }}
            />
            <Route
              path="/header-transparent"
              component={() => {
                return (
                  <LocaleProvider locale={headerEN_US}>
                    <TransparentHeader />
                  </LocaleProvider>
                );
              }}
            />
            <Route
              path="/footer"
              component={() => {
                return (
                  <FooterLocaleProvider locale={headerEN_US}>
                    <Footer />
                  </FooterLocaleProvider>
                );
              }}
            />
          </Switch>
          {/* <SLocaleProvider locale={sZh}>
          <Security />
        </SLocaleProvider> */}
          {/* <HumanCaptcha currentLang="zh_CN" /> */}
        </Router>
      </KufoxProvider>
    </KuFoxThemeProvider>
  );
}
