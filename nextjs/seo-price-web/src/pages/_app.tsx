import React from "react";
import "requestidlecallback";
import "./reset.css";
import "./global.css";
import './price_global.css';
import "./mui.css";
import 'gbiz-next/Footer.css';
import 'gbiz-next/Header.css';
import "gbiz-next/compliance";
import '@kux/app-sdk';
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { appWithTranslation } from "next-i18next";
import { IS_SSR_MODE } from "kc-next/env";
import SsrProvider from "@/components/Providers/SsrProvider";
import nextI18nextConfig from "../../next-i18next.config";
import { moduleManager } from "@/core";
import * as telemetry from '@/core/telemetryModule';

const SpaProvider = dynamic(
  () => import('@/components/Providers/SpaProvider'),
  {
    ssr: false, // SpaProvider 仅客户端运行
  }
);

// 全局通用的初始化事件 SSR & SPA都会执行
moduleManager.initAll();

function App({ Component, pageProps }: AppProps) {
  // SPA 模式下，使用SpaProvider
  const GlobalProvider = IS_SSR_MODE ? SsrProvider : SpaProvider;

  return (
    <GlobalProvider pageProps={pageProps}>
      <Component {...pageProps} />
    </GlobalProvider>
  );
}

export default appWithTranslation(
  App,
  IS_SSR_MODE
    ? {
        ...(nextI18nextConfig as any),
        missingKeyHandler: (lng, ns, key) => {
          telemetry.reportIntlMissing(key);
        },
      }
    : null
);
