/**
 * Owner: Hanx.Wei@kupotech.com
 */
import React from "react";
import Head from "@/components/CustomHead";
import Root from "@/components/Root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startsWith } from "lodash-es";
import { getCurrentLang } from "kc-next/boot";
import { serverTdk } from "@kc/tdk";
import { useUserStore } from "@/store/user";
import { useRouter } from "kc-next/compat/router";
import { useInitialProps } from "gbiz-next/InitialProvider";
import styles from "./styles.module.scss";
import { OneTrustManager, GoogleTagManager } from 'gbiz-next/thirdParties';
import { useCurrencyStore } from "@/store/currency";
import { useMarketStore } from "@/store/market";
import { useMount } from "ahooks";

const client = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } },
});

const Layout = (props) => {
  const router = useRouter();
  const pageProps = useInitialProps();
  const pullUser = useUserStore((state) => state.pullUser);
  const pullPrices = useCurrencyStore((s) => s.pullPrices);
  const pullRates = useCurrencyStore((s) => s.pullRates);
  const pullSymbolsInfo = useMarketStore((s) => s.pullSymbolsInfo);

  const defaultTdk = pageProps?.defaultTdk;

  const currentLang = getCurrentLang();

  // 如果在app内，从app登录返回时
  useMount(() => {
    pullRates();
    (async () => {
      const user = await pullUser();
      pullPrices("", user);
    })();
    pullSymbolsInfo();
    document.addEventListener('click', () => {
      if (!window.sensors || window.sensors.__page_clicked__) return;
      window.sensors.track('page_click', {
        pathname: window.location.pathname
      });
    }, { once: true });
  });

  const tdkMeta = defaultTdk
    ? serverTdk.getTdkHelmet(defaultTdk, currentLang)
    : [];


  if (router && startsWith(router.pathname, "/404")) {
    return <>{props.children}</>;
  }

  return (
    <Root>
      <Head>
        {tdkMeta}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <OneTrustManager />
      </Head>
      <QueryClientProvider client={client}>
        <div className={styles.wrapper}> {props.children}</div>
      </QueryClientProvider>
      <GoogleTagManager />
    </Root>
  );
};

export default Layout;
