/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useCallback, useMemo } from 'react';
import history from '@kucoin-base/history';
import { pushTool } from '@kucoin-biz/header';
import { NoticeCenter, pushTool as noticePushTool } from '@kucoin-biz/notice-center';
import { useTheme } from '@kux/mui';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import HOST from 'utils/siteConfig';
import { isThemeDisabledRoute } from 'src/theme/blackRouteList.js';
import { LogoSuffixUI } from './LogoSuffix';
import config from 'config';
import { push } from 'utils/router';
import { useLocale } from '@kucoin-base/i18n';
import { some } from 'lodash';
import { useResponsive } from '@kux/mui/hooks';
import { checkIsAffiliateSystemPage } from 'src/routes/AffiliateRound2/hooks/useAffiliateSystem.js';
import ExportTrigger from 'src/routes/AffiliateRound2/components/ExportTrigger.js';
import Header from './RemoteHeader';
import useLocaleChange from 'hooks/useLocaleChange';

const { v2ApiHosts } = config;

pushTool.setPush(push);
noticePushTool.setPush(push);

const paths = ['/spot-nft/main', '/nft-token/intro'];
const pathRegex = [/^\/spot-nft\/project\/.*\/\d*\/token$/, /^\/spot-nft\/token-sell\/.*\/\d*/];

// 停机通知最多显示的范围-主站（首页/行情（trade-web）/交易/资产）
const maintainancePath = [
  { path: '/', code: 'Index' },
  { path: '/markets', code: 'Quotes' },
  { path: '/assets', code: 'Assets' },
];

export default ({ pathname, topInsertRender } = {}) => {
  // const _pathname = history.location.pathname;
  // 优先匹配全路径，再匹配正则
  // const needDarkTheme =
  //   paths.indexOf(_pathname) !== -1 || pathRegex.some((reg) => reg.test(_pathname));
  const { currentLang } = useLocale();
  const changeLocale = useLocaleChange();
  const { currency } = useSelector((state) => state.currency);
  const { user } = useSelector((state) => state.user);
  const { maintenanceStatus, showMaintenance } = useSelector((state) => state.notice_event);
  const coinDict = useSelector((state) => state.categories);
  const { isHFAccountExist } = useSelector((state) => state.user_assets);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { setTheme, currentTheme, colors } = theme;

  const isAffiliateSystemPage = useMemo(() => {
    return checkIsAffiliateSystemPage(pathname);
  }, [pathname]);

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

  // const notice = user ? <NoticeCenter theme={needDarkTheme ? 'dark' : currentTheme} /> : null;
  const notice = user ? <NoticeCenter theme={currentTheme} /> : null;

  let menuConfig = ['asset', 'order', 'person', 'search', notice, 'download', 'i18n', 'currency'];

  const handleTheme = (changedTheme) => {
    setTheme(changedTheme);
    // dispatch({
    //   type: 'setting/toggleTheme',
    // });
  };
  if (!isThemeDisabledRoute()) {
    menuConfig.push('theme');
  }

  if (isAffiliateSystemPage) {
    menuConfig = ['person', <ExportTrigger key="ExportTrigger" />, 'i18n'];
  }

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
  const maintenanceConfig = {
    maintenance: maintenanceStatus,
    maintainancePath,
    showMaintenance,
  };

  const { sm, lg, xl } = useResponsive();
  const isShowRestrictNotice = useSelector((state) => state.$header_header.isShowRestrictNotice);
  useEffect(() => {
    const height = (xl ? 80 : 64) + (isShowRestrictNotice ? 40 : 0);
    dispatch({
      type: 'user_assets/updateHeaderHeight',
      payload: {
        header: height,
      },
    });
  }, [sm, lg, xl, isShowRestrictNotice, dispatch]);

  return (
    <Header
      currentLang={currentLang}
      currency={currency}
      userInfo={user}
      isHFAccountExist={isHFAccountExist}
      coinDict={coinDict}
      // theme={needDarkTheme ? 'dark' : theme.currentTheme}
      theme={currentTheme}
      transparent={false}
      onThemeChange={handleTheme}
      onCurrencyChange={onCurrencyChange}
      onCloseMaintenance={onCloseMaintenance}
      onLangChange={onLangChange}
      menuConfig={menuConfig}
      pathname={pathname}
      {...maintenanceConfig}
      {...hostConfig}
      topInsertRender={topInsertRender}
      renderLogoSuffix={() => {
        if (isAffiliateSystemPage) {
          return <LogoSuffixUI pathname={pathname} />;
        }
        return null;
      }}
    />
  );
};
