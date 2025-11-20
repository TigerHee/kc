import useLocaleChange from '@/hooks/useLocaleChange';
import { useCurrencyStore } from '@/store/currency';
import { useGlobalStore } from '@/store/global';
import { useMaintenanceNoticeStore } from '@/store/maintenanceNotice';
import { useUserStore } from '@/store/user';
import { Header } from 'gbiz-next/Header';
import NoticeCenter from 'gbiz-next/NoticeCenter';
import { getSiteConfig } from 'kc-next/boot';
import { getCurrentLang, langToLocale } from 'kc-next/i18n';
import { some } from 'lodash-es';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { useTheme } from '../ThemeChange';

// 停机通知显示的范围
const maintainancePath = [{ path: '/', code: 'Index' }];

const CustomHeader = () => {
  const currentLang = getCurrentLang();
  const pathname = usePathname();
  const changeLocale = useLocaleChange();

  const user = useUserStore((state) => state.user);
  const { rates, currency, selectCurrency, pullPrices } = useCurrencyStore();
  const { maintenanceStatus, showMaintenance, queryMaintenanceStatus, setShowMaintenance } = useMaintenanceNoticeStore();

  const initialProps = useInitialProps() as any;
  const { theme, setTheme } = useTheme();

  const onCurrencyChange = (c: string) => {
    selectCurrency(c);
    pullPrices(c);
  };

  const onLangChange = (lang: string) => {
    changeLocale(langToLocale(lang));
  };

  const onCloseMaintenance = () => {
    setShowMaintenance(false);
  };

  // 获取停机通知
  useEffect(() => {
    if (some(maintainancePath, ({ path }) => path === pathname)) {
      queryMaintenanceStatus();
    }
  }, [pathname]);

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

  return <Header
    currentLang={currentLang}
    currency={currency as string}
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
    mainTheme={theme}
    theme={theme}
    // mui-next 无需设置，因为有 ThemeProvider 直接设置 theme
    onThemeChange={setTheme}
    platform={initialProps?.['_platform']}
    onHeaderHeightChange={(height: number) => {
      useGlobalStore.setState({ totalHeaderHeight: height });
    }}
    // simplify
    // inviter={{ nickname: 'AABBCCC' }}
  />;
};

export default CustomHeader;
