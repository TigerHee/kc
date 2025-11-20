import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { bootConfig, getCurrentLang, getCurrentLocale } from "kc-next/boot";
import { RTL_LANGUAGES, UAPlatforms, UAPlatformTypes } from "@/config/base";
import { NEXT_DATA } from "next/dist/shared/lib/utils";

const cdnPrefix = process.env.NEXT_PUBLIC_CDN_PREFIX || "";
const getPagePlatform = (nextData: NEXT_DATA): UAPlatformTypes => nextData.props?.pageProps?._platform || 'default';

class MyDocument extends Document {
  render() {
    const locale = getCurrentLocale();
    const currentLang = getCurrentLang();
    const pagePlatform = getPagePlatform(this.props.__NEXT_DATA__ || {});
    // 这里主要是通过判断ua来确定是移动还是PC
    // 如果是移动设备，那就异步加载字体，优化网络表现，降低LCP时间
    const IS_PC = pagePlatform === UAPlatforms.PC;

    return (
      <Html
        lang={locale}
        dir={RTL_LANGUAGES.includes(currentLang) ? "rtl" : "ltr"}
      >
        <Head>
          {/* 线上会使用基座的 favicon，防止本地开发时 404，本地也存在该文件 public/logo.png */}
          <link rel='shortcut icon' href={bootConfig._BRAND_FAVICON_} />
          <link rel="preconnect" href={cdnPrefix} />
          <link
            rel="preconnect"
            href={"https://bigdata-scfx-push.kucoin.plus"}
          />
          {
            IS_PC ? (
              <link
                rel="stylesheet"
                href={`${cdnPrefix}/natasha/npm/@kux/font/css.css`}
              />
            ) : (
              <link
                id="kux-font-css"
                rel="preload"
                href={`${cdnPrefix}/natasha/npm/@kux/font/css.css`}
                as="style"
              />
            )
          }
          
          <link
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/mui-next@1.1.6/style.css`}
            as="style"
          />
          <link
            rel="stylesheet"
            href={`${cdnPrefix}/natasha/npm/@kux/mui-next@1.1.6/style.css`}
          />
          {
            !IS_PC && (
              <Script id="patch-font-css" strategy="afterInteractive">
              {`function patchLink(i,h){var l=document.getElementById(i);if(!l)return;var p=false;function d(){if(p)return;p=true;l.rel='stylesheet';l.removeEventListener('load',d);l.removeEventListener('error',f)}function f(){if(p)return;p=true;var fl=document.createElement('link');fl.rel='stylesheet';fl.href=h;document.head.appendChild(fl);l.removeEventListener('load',d);l.removeEventListener('error',f)}l.addEventListener('load',d);l.addEventListener('error',f);('requestIdleCallback'in window)?requestIdleCallback(()=>{if(!p)d()},{timeout:2000}):setTimeout(()=>{if(!p)d()},2000)}patchLink('kux-font-css','${cdnPrefix}/natasha/npm/@kux/font/css.css');`}
            </Script>
            )
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
