/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'dva';
import HOST from 'utils/siteConfig';
import { v2ApiHosts } from 'config';
import { useHistory } from 'react-router';
import _ from 'lodash';
import systemDynamic from 'utils/systemDynamic';

const Header = systemDynamic('@remote/header', 'Header', {});
// 暗色系
const paths = [
  '/kucoinlabs',
  '/brand-broker',
  '/guardian',
  '/price-protect',
  '/crypto-friday',
  '/KuCoin-4th-anniversary',
  '/nft-info'
];

// 透明header
const transparentPaths = [
  '/guardian',
  '/crypto-friday',
  '/guardian',
  '/KuCoin-4th-anniversary',
  '/nft-info'
];

// 包含该路由名字都用暗色系，不透明
const darkPath = ['kcs-game', 'spotlight_r5'];

export default props => {
  const { currentLang } = useSelector(state => state.app);
  const { currency } = useSelector(state => state.currency);
  const { user } = useSelector(state => state.user);
  const history = useHistory();
  const darkTheme = paths.indexOf(history.location.pathname) !== -1;
  let transparent = transparentPaths.indexOf(history.location.pathname) !== -1;
  let theme = darkTheme ? 'dark' : 'light';

  if (_.some(darkPath, v => history.location.pathname.indexOf(v) !== -1)) {
    theme = 'dark';
    transparent = false;
  }

  const dispatch = useDispatch();

  const onSinin = () => {
    dispatch({
      type: 'user/update',
      payload: { showLoginDrawer: true, signDownClickProps: props?.signDownClickProps || null },
    });
  };
  const onCurrencyChange = c => {
    dispatch({ type: 'currency/selectCurrency', payload: { currency: c } });
  };
  const onLangChange = l => {
    dispatch({ type: 'app/selectLang', payload: { lang: l, reload: true } });
  };
  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    KUCOIN_HOST_CHINA: HOST.KUCOIN_HOST_CHINA, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    KUMEX_BASIC_HOST: HOST.KUMEX_BASIC_HOST, // KuMEX简约版地址
    FASTCOIN_HOST: HOST.FASTCOIN_HOST, // 一键买币地址
    MAINSITE_API_HOST: v2ApiHosts.MAINSITE_API_HOST, // kucoin主站API地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
  };
  return (
      <Header
        {...props}
        currentLang={currentLang}
        currency={currency}
        userInfo={user}
        {...hostConfig}
        onSinin={onSinin}
        onCurrencyChange={onCurrencyChange}
        onLangChange={onLangChange}
        theme={theme}
        transparent={transparent}
      />
  );
};
