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
import useTheme from '@/hooks/useTheme';
import { getTenantConfig } from '@/tenant';

// 停机通知显示的范围
const maintainancePath = [{ path: '/', code: 'Index' }];
// 隐藏注册登陆 icon
const hiddenSignUpInPath = ['/ucenter/signup', '/ucenter/signin'];

const CustomHeader = ({ simplify = false, propsMenuConfig }: { simplify?: boolean; propsMenuConfig?: string[] }) => {
  const currentLang = getCurrentLang();
  const pathname = usePathname();
  const changeLocale = useLocaleChange();

  const user = useUserStore((state) => state.user);
  const inviter = useUserStore((state) => state.inviter);
  const { rates, currency, selectCurrency, pullPrices } = useCurrencyStore();
  const { maintenanceStatus, showMaintenance, queryMaintenanceStatus, setShowMaintenance } = useMaintenanceNoticeStore();

  const { theme, setTheme } = useTheme();
  const initialProps = useInitialProps();

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
    currency={currency}
    userInfo={user}
    inviter={inviter}
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
    simplify={simplify}
    hiddenSignInAndUp={hiddenSignUpInPath.includes(pathname)}
    platform={initialProps?.['_platform']}
    onHeaderHeightChange={(height: number) => {
      useGlobalStore.setState({ totalHeaderHeight: height });
    }}
  />;
};

export default CustomHeader;
