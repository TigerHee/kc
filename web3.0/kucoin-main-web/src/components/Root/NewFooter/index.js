/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import history from '@kucoin-base/history';
import { useTheme } from '@kux/mui';
// import { Footer } from '@remote/footer';
import HOST from 'utils/siteConfig';
import config from 'config';
import bgFooter from 'static/global/bg_footer.png';
import { useLocale } from '@kucoin-base/i18n';
import { Footer } from '@kucoin-biz/footer';

const { v2ApiHosts } = config;

// 暗色系
const paths = [
  '/activity/anniversary',
  '/activity/activity-center',
  '/spot-nft/main',
  '/nft-token/intro',
];
const pathRegex = [/^\/spot-nft\/project\/.*\/\d*\/token$/, /^\/spot-nft\/token-sell\/.*\/\d*/];

// 纯暗色系，不要背景
const pureDarkPaths = ['/spot-main/main', '/nft-token/intro'];
const pureDarkPathRegex = [
  /^\/spot-nft\/project\/.*\/\d*\/token$/,
  /^\/spot-nft\/token-sell\/.*\/\d*/,
];

export default () => {
  const { currentLang } = useLocale();
  const { currentTheme } = useTheme();
  const _pathname = history.location.pathname;
  const darkTheme = paths.indexOf(_pathname) !== -1 || pathRegex.some((reg) => reg.test(_pathname));
  const pureDarkTheme =
    pureDarkPaths.indexOf(_pathname) !== -1 || pureDarkPathRegex.some((reg) => reg.test(_pathname));
  const styleConfig = darkTheme
    ? // 纯暗色系，不要背景
      pureDarkTheme
      ? { background: '#11151f' }
      : {
          background: `url(${bgFooter}) no-repeat center top`,
          backgroundSize: 'cover',
        }
    : { background: '#fff' };
  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    DOCS_HOST: HOST.DOCS_HOST, // 文档地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
    TRADING_BOT_HOST: HOST.TRADING_BOT_HOST, // 机器人
  };
  return (
    <Footer
      currentLang={currentLang}
      // styleConfig={styleConfig}
      {...hostConfig}
      // theme={darkTheme ? 'dark' : 'light'}
      theme={currentTheme}
    />
  );
};
