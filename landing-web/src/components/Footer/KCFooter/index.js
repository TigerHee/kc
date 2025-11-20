/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import HOST from 'utils/siteConfig';
import { useHistory } from 'react-router';
import systemDynamic from 'utils/systemDynamic';

const Footer = systemDynamic('@remote/footer', 'Footer');
// 暗色系
const paths = [
  '/kucoinlabs',
  '/brand-broker',
  '/community-collect',
  '/guardian',
  '/price-protect',
  '/spotlight',
];

export default ({ background }) => {
  const { currentLang } = useSelector((state) => state.app);
  const history = useHistory();

  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    DOCS_HOST: HOST.DOCS_HOST, // 文档地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
    TRADING_BOT_HOST: HOST.TRADING_BOT_HOST, // 机器人
  };

  let darkTheme = paths.indexOf(history.location.pathname) !== -1;
  if (history.location.pathname.indexOf('/spotlight') !== -1) {
    darkTheme = 'dark';
  }
  const styleConfig = background
    ? { background }
    : darkTheme
    ? { background: 'rgb(1, 8, 30)' }
    : { background: '#fff' };

  return (
    <Footer
      currentLang={currentLang}
      {...hostConfig}
      styleConfig={styleConfig}
      theme={darkTheme ? 'dark' : 'light'}
    />
  );
};
