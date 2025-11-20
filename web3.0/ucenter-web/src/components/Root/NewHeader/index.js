/**
 * Owner: willen@kupotech.com
 */
import { getDvaApp } from '@kucoin-base/dva';
import { useLocale } from '@kucoin-base/i18n';
import { NoticeCenter, pushTool as noticePushTool } from '@kucoin-biz/notice-center';
import { pushTool } from '@kucoin-gbiz-next/header';
import { useTheme } from '@kux/mui';
import config from 'config';
import useLocaleChange from 'hooks/useLocaleChange';
import { some } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'utils/router';
import HOST from 'utils/siteConfig';
import Header from './RemoteHeader';

pushTool.setPush(push);
noticePushTool.setPush(push);

const { v2ApiHosts } = config;

// 停机通知最多显示的范围-主站（首页/行情（trade-web）/交易/资产）
const maintainancePath = [
  { path: '/', code: 'Index' },
  { path: '/markets', code: 'Quotes' },
  { path: '/assets', code: 'Assets' },
];

const hostConfig = {
  KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
  KUCOIN_HOST_CHINA: HOST.KUCOIN_HOST_CHINA, // kucoin主站地址
  TRADE_HOST: HOST.TRADE_HOST, // 交易地址
  KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
  SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
  MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
  KUMEX_BASIC_HOST: HOST.KUMEX_BASIC_HOST, // KuMEX简约版地址
  FASTCOIN_HOST: HOST.FASTCOIN_HOST, // 一键买币地址
  POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
  LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
};

const HiddenSignUpInPath = ['/ucenter/signup', '/ucenter/signin'];

const NewHeader = ({ pathname, topInsertRender, propsMenuConfig, simplify } = {}) => {
  const { currentLang } = useLocale();
  const changeLocale = useLocaleChange();
  const currency = useSelector((state) => state.currency.currency);
  const rates = useSelector((state) => state.currency.rates);
  const user = useSelector((state) => state.user.user);
  const { data: inviterInfo } = useSelector((state) => state['$entrance_signUp']?.inviter ?? {});
  const maintenanceStatus = useSelector((state) => state.notice_event.maintenanceStatus);
  const showMaintenance = useSelector((state) => state.notice_event.showMaintenance);
  const coinDict = useSelector((state) => state.categories.coinDict);
  const { currentTheme, setTheme } = useTheme();
  const { isHFAccountExist } = useSelector((state) => state.user_assets);
  const dispatch = useDispatch();

  const onCurrencyChange = (c) => {
    dispatch({ type: 'currency/selectCurrency', payload: { currency: c } });
    // 更换法币类型时，重新拉取数字货币对应法币的汇率
    dispatch({ type: 'currency/pullPrices', payload: { currency: c } });
  };

  const onLangChange = (l) => {
    changeLocale(l);
  };

  const onCloseMaintenance = useCallback(() => {
    dispatch({
      type: 'notice_event/update',
      payload: {
        showMaintenance: false,
      },
    });
  }, [dispatch]);
  useEffect(() => {
    if (some(maintainancePath, ({ path }) => path === pathname)) {
      dispatch({
        type: 'notice_event/queryMaintenanceStatus',
        currentLang,
      });
    }
  }, [pathname, dispatch, currentLang]);

  const handleTheme = (changedTheme) => {
    document.documentElement.setAttribute('data-theme', changedTheme);
    setTheme(changedTheme);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch({ type: 'user_assets/queryUserHasHighAccount' });
  }, [dispatch, user]);

  const notice = user ? <NoticeCenter theme={currentTheme} /> : null;

  const menuConfig = propsMenuConfig || [
    'asset',
    'order',
    'person',
    'search',
    notice,
    'download',
    'i18n',
    'currency',
    'theme',
  ];

  const maintenanceConfig = {
    maintenance: maintenanceStatus,
    maintainancePath,
    showMaintenance,
  };
  return (
    <>
      <Header
        currentLang={currentLang}
        currency={currency}
        userInfo={user}
        inviter={inviterInfo}
        isHFAccountExist={isHFAccountExist}
        coinDict={coinDict}
        transparent={false}
        onCurrencyChange={onCurrencyChange}
        onCloseMaintenance={onCloseMaintenance}
        onLangChange={onLangChange}
        menuConfig={menuConfig}
        pathname={pathname}
        outerCurrencies={rates}
        {...maintenanceConfig}
        {...hostConfig}
        topInsertRender={topInsertRender}
        simplify={simplify}
        theme={currentTheme}
        hiddenSignInAndUp={HiddenSignUpInPath.includes(pathname)}
        onThemeChange={handleTheme}
        dva={getDvaApp()}
      />
    </>
  );
};

export default React.memo(NewHeader);
