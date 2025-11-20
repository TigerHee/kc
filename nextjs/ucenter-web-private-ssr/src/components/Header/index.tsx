import useLocaleChange from '@/hooks/useLocaleChange';
import { Header } from 'gbiz-next/Header';
import NoticeCenter from 'gbiz-next/NoticeCenter';

import useTheme from '@/hooks/useTheme';
import { getTenantConfig } from '@/tenant';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { getSiteConfig } from 'kc-next/boot';
import { getCurrentLang, langToLocale } from 'kc-next/i18n';
import { some } from 'lodash-es';
import { useRouter } from 'kc-next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// 停机通知显示的范围
const maintainancePath = [{ path: '/', code: 'Index' }];

const CustomHeader = () => {
  const currentLang = getCurrentLang();
  const router = useRouter();
  const pathname = router?.pathname;

  console.warn('pathname...', pathname);
  const changeLocale = useLocaleChange();
  const dispatch = useDispatch();

  // @ts-expect-error 暂不修复
  const user = useSelector((state) => state.user.user);
  // @ts-expect-error 暂不修复
  const maintenanceStatus = useSelector((state) => state.notice_event.maintenanceStatus);
  // @ts-expect-error 暂不修复
  const showMaintenance = useSelector((state) => state.notice_event.showMaintenance);
  // @ts-expect-error 暂不修复
  const { currency, rates } = useSelector((state) => state.currency);

  const { theme, setTheme } = useTheme();
  const initialProps = useInitialProps();

  const onCurrencyChange = (c: string) => {
    dispatch({ type: 'currency/selectCurrency', payload: { currency: c } });
    // 更换法币类型时，重新拉取数字货币对应法币的汇率
    dispatch({ type: 'currency/pullPrices', payload: { currency: c } });
  };

  const onLangChange = (lang: string) => {
    changeLocale(langToLocale(lang));
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

  const notice = !user ? null : <NoticeCenter theme={theme} />;

  const menuConfig = [
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

  const HOST = getSiteConfig();

  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    KUCOIN_HOST_CHINA: HOST.KUCOIN_HOST_CHINA, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: '/_api', // kucoin主站API地址
    KUMEX_BASIC_HOST: HOST.KUMEX_BASIC_HOST, // KuMEX简约版地址
    FASTCOIN_HOST: HOST.FASTCOIN_HOST, // 一键买币地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
  };

  const maintenanceConfig = { maintenance: maintenanceStatus, maintainancePath, showMaintenance };

  return (
    <Header
      currentLang={currentLang}
      currency={currency}
      userInfo={user || undefined}
      // isHFAccountExist={isHFAccountExist}
      // coinDict={coinDict}
      transparent={false}
      onCurrencyChange={onCurrencyChange}
      onCloseMaintenance={onCloseMaintenance}
      onLangChange={onLangChange}
      menuConfig={menuConfig}
      pathname={pathname}
      outerCurrencies={rates}
      {...maintenanceConfig}
      {...hostConfig}
      // topInsertRender={topInsertRender}
      theme={getTenantConfig().common.forceLightTheme ? 'light' : theme}
      onThemeChange={setTheme}
      platform={initialProps?.['_platform']}
      onHeaderHeightChange={(height: number) => {
        dispatch({ type: 'app/update', payload: { totalHeaderHeight: height } });
      }}
    />
  );
};

export default CustomHeader;
