/**
 * Owner: iron@kupotech.com
 */
import React, { useState } from 'react';
import { Login, LoginDrawer } from '@kc/entrance/lib/componentsBundle';
import { Footer, LocaleProvider as FooterLocaleProvider } from '@kc/footer/lib/componentsBundle';
import f_zh_CN from '@kc/footer/lib/locale/en_US.js';
import storage from '@utils/storage';

import SignInPng from './signIn.png';

const { Logo, BackgroundStyle, BackgroundImg, Text, RightHeader, LeftFooter } = Login.LayoutSlots;

export default (props) => {
  const { history } = props;
  const [open, setOpen] = useState(false);
  const currentLang = 'en_US';
  const HOST = {
    KUCOIN_HOST_CHINA: 'https://v2.kucoin.net', // kucoin国内站地址
    'API_HOST.INET': '',
    /** CMS接口地址 */
    'API_HOST.CMS': 'https://kitchen-v2.kucoin.net',
    /** WEB接口地址 */
    // 'API_HOST.WEB': 'http://localhost:2999/api',
    'API_HOST.WEB': 'https://kitchen-v2.kucoin.net',
    /** CDN地址 */
    CDN_HOST: 'http://localhost:8080',
    /** K线配置地址 */
    KLINE_CONFIG_HOST: 'https://saveload-v2.kucoin.net',
    /** 指纹地址 */
    FINGER_SOURCE_HOST: 'https://waf.kucoin.net/Distinguish.js',
    /** 静态组件地址 */
    COMPONENTS_HOST: 'https://v2.kucoin.net',
    /** 信用卡买币地址 */
    SIMPLEX_HOST: 'https://sandbox.test-simplexcc.com/payments/new',
    /** KuMEX地址 */
    KUMEX_HOST: 'https://www.kumex.com',
    /** PoolX地址 */
    POOLX_HOST: 'http://pool-x.net',
    /** 是否按国内站流程开关 */
    /** KuMEX简约版地址 */
    KUMEX_BASIC_HOST: 'http://lite.kumex.net',
    /** trade 地址 */
    TRADE_HOST: 'https://trade.kucoin.net',
    /** 文档 地址 */
    DOCS_HOST: 'https://docs.kucoin.com',
    /** 是否国内站行为 */
    IS_INSIDE_WEB: false,
    /** 是否沙盒环境 */
    IS_SANDBOX: false,
    /** 沙盒模拟 地址 */
    SANDBOX_HOST: 'https://sandbox.kucoin.com', // TODO名称和地址要替换
    /** 一键买币项目 地址 */ FASTCOIN_HOST: 'https://express.kucoin.net',
    /** 主站地址 */
    KUCOIN_HOST: 'https://v2.kucoin.net',
  };
  const loginKey = storage.getItem('kucoinv2_login_key');
  return (
    <div>
      {/* <HeaderLocaleProvider locale={h_zh_CN}>
        <Header
          currentLang={currentLang}
          {...HOST}
          theme="dark"
          currency="USD"
          // transparent="true"
          customColors={{ primary: 'red' }}
        />
      </HeaderLocaleProvider> */}
      <LoginDrawer
        loginKey={loginKey}
        showLoginSafeWord
        open={open}
        anchor="right"
        onClose={() => {
          setOpen(false);
        }}
        onSuccess={() => {
          setOpen(false);
        }}
        onForgetPwdClick={() => {}}
        signOrDownClick={() => {}}
        verifyCanNotUseClick={() => {
          history.push('/signup');
        }}
        theme="light"
      />
      <Login
        loginKey={loginKey}
        showLoginSafeWord
        onSuccess={() => {
          history.push('/signup');
        }}
        onForgetPwdClick={() => {
          console.log('forget click');
        }}
        verifyCanNotUseClick={() => {
          history.push('/signup');
        }}
        forgetLeft={<div>AAAAAA</div>}
        theme="light"
      >
        <Login.LayoutSlots>
          <Logo>
            <span
              onClick={() => {
                setOpen(true);
              }}
            >
              我是我是
            </span>
          </Logo>
          <BackgroundStyle>{{ backgroundColor: 'red' }}</BackgroundStyle>
          <LeftFooter>2121212dsjdsjdk</LeftFooter>
          <Text>我是定制文字啊</Text>
          <BackgroundImg src={SignInPng} />
          {/* <BackgroundImg src={SignUpPng} /> */}
          <RightHeader>没账户？快速注册</RightHeader>
        </Login.LayoutSlots>
      </Login>
      <FooterLocaleProvider locale={f_zh_CN}>
        <Footer currentLang={currentLang} hostConfig={HOST} />
      </FooterLocaleProvider>
    </div>
  );
};
