/**
 * Owner: will.wang@kupotech.com
 */
import useLocaleChange from "@/hooks/useLocaleChange";
import { useCategoriesStore } from "@/store/categories";
import { useCurrencyStore } from "@/store/currency";
import { useUserStore } from "@/store/user";
import { useUserAssetsStore } from "@/store/userAssets";
import { Header } from "gbiz-next/Header";
import { useLang } from "gbiz-next/hooks";
import { bootConfig, getSiteConfig } from "kc-next/boot";
import { useCallback, useEffect, useMemo } from "react";
import apiHostConfig from "@/config/index";
import { langToLocale } from "kc-next/i18n";
import { usePriceStore } from "@/store/price";
import { useInitialProps } from "gbiz-next/InitialProvider";
import dynamic from "next/dynamic";

const NoticeCenter = dynamic(() => import("@/components/Root/NoticeCenter"), { ssr: false });

export default () => {
  const initialProps = useInitialProps();
  const { currentLang } = useLang();
  const changeLocale = useLocaleChange();
  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);
  const user = useUserStore((state) => state.user);
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const isHFAccountExist = useUserAssetsStore(
    (state) => state.isHFAccountExist
  );
  const onSelectCurrency = useCurrencyStore((s) => s.selectCurrency);
  const onPullPrices = useCurrencyStore((s) => s.pullPrices);
  const queryUserHasHighAccount = useUserAssetsStore(
    (s) => s.queryUserHasHighAccount
  );
  const setUserLocal = useUserStore(s => s.setLocal);
  const updatePriceProp = usePriceStore(s => s.update);

  const theme = 'light';

  const onCurrencyChange = (c) => {
    onSelectCurrency({ currency: c });
    // 更换法币类型时，重新拉取数字货币对应法币的汇率
    onPullPrices(c);

    // 更新user语言
    if (user && currency) {
      setUserLocal({ currency: c, reloadUser: true})
    }
  };

  const onLangChange = useCallback(
    (lang: string) => {
      changeLocale(langToLocale(lang));
    },
    [changeLocale]
  );

  useEffect(() => {
    if (!user) {
      return;
    }
    queryUserHasHighAccount({});
  }, [user]);


  const notice = user ? <NoticeCenter /> : null;

  const menuConfig = [
    "asset",
    "order",
    "person",
    "search",
    notice,
    "download",
    "i18n",
    "currency",
  ];
  const hostConfig = useMemo(() => {
    const config = getSiteConfig();

    return {
      KUCOIN_HOST: config.KUCOIN_HOST, // kucoin主站地址
      KUCOIN_HOST_CHINA: config.KUCOIN_HOST_CHINA, // kucoin主站地址
      TRADE_HOST: config.TRADE_HOST, // 交易地址
      KUMEX_HOST: config.KUMEX_HOST, // kumex地址
      SANDBOX_HOST: config.SANDBOX_HOST, // 沙盒地址
      MAINSITE_API_HOST: apiHostConfig.v2ApiHosts.CMS, // kucoin主站API地址
      KUMEX_BASIC_HOST: config.KUMEX_BASIC_HOST, // KuMEX简约版地址
      FASTCOIN_HOST: config.FASTCOIN_HOST, // 一键买币地址
      POOLX_HOST: config.POOLX_HOST, // POOLX地址
      LANDING_HOST: config.LANDING_HOST, // 流量落地页
      _BRAND_NAME_: bootConfig._BRAND_NAME_,
      _BRAND_SITE_: bootConfig._BRAND_SITE_,
      _BRAND_LOGO_: bootConfig._BRAND_LOGO_,
      _SAFE_WEB_DOMAIN_: bootConfig._SAFE_WEB_DOMAIN_,
      _LANG_DOMAIN_: bootConfig._LANG_DOMAIN_,

    };
  }, []);

  const onThemeChange = useCallback(() => {
    // price不支持主题
  }, []);

  return (
    <Header
      theme={theme}
      mainTheme={theme}
      platform={initialProps?._platform}
      currentLang={currentLang}
      currency={currency}
      userInfo={user || undefined}
      isHFAccountExist={isHFAccountExist}
      coinDict={coinDict}
      transparent={false}
      onCurrencyChange={onCurrencyChange}
      onLangChange={onLangChange}
      onThemeChange={onThemeChange}
      menuConfig={menuConfig}
      outerCurrencies={rates}
      onHeaderHeightChange={(height: number) => {
        updatePriceProp({ totalHeaderHeight: height });
      }}
      {...hostConfig}
    />
  );
};
