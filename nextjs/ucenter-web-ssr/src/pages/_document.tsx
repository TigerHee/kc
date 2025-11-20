import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import Script from 'next/script';
import { getCurrentLang, getCurrentLocale } from 'kc-next/boot';
import { RTL_LANGUAGES } from '@/config/base';
import { bootConfig } from 'kc-next/boot';
import getCookieTheme from '@/tools/getCookieTheme';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '@/components/Providers/createEmotionCache';
import { getTenantConfig } from '@/tenant';

const cdnPrefix = process.env.NEXT_PUBLIC_CDN_PREFIX || '';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);
    ctx.renderPage = () =>
      originalRenderPage({
        // 顶层包一层 CacheProvider（具体见各库文档，或在 _app.tsx 统一包）
        enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
      });
    const initialProps = await Document.getInitialProps(ctx);

    const chunks = extractCriticalToChunks(initialProps.html);
    const styles = chunks.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));
    const theme = getTenantConfig().common.forceLightTheme ? 'light' : getCookieTheme(ctx);

    return {
      ...initialProps,
      theme,
      styles: [...React.Children.toArray(initialProps.styles), ...styles]
    };
  }

  render() {
    const locale = getCurrentLocale();
    const currentLang = getCurrentLang();
    const { theme } = this.props as any;

    return (
      <Html
        lang={locale}
        dir={RTL_LANGUAGES.includes(currentLang) ? 'rtl' : 'ltr'}
        data-theme={theme}
      >
        <Head>
          <meta name="googlebot" content="notranslate" />
          <meta name="robots" content="notranslate" />
          <meta
            property="og:image"
            content="https://assets.staticimg.com/cms/media/43cpiZrJVEFW1kc1eEVCWTg1hUzUCbolML43HIJKE.svg"
          />
          {/* 线上会使用基座的 favicon，防止本地开发时 404，本地也存在该文件 public/logo.png */}
          <link rel="shortcut icon" href={bootConfig._BRAND_FAVICON_} />
          <link rel="preconnect" href={cdnPrefix} />
          <link
            rel="preconnect"
            href={'https://bigdata-scfx-push.kucoin.plus'}
          />
          <link
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/font/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/font/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/font/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/font/Roboto-SemiBold.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <noscript>
            <link
              rel="stylesheet"
              href={`${cdnPrefix}/natasha/npm/@kux/font/css.css`}
            />
            <link
              rel="stylesheet"
              href={`${cdnPrefix}/natasha/npm/@kux/mui-next@1.0.0-beta.40073e8/style.css`}
            />
          </noscript>
          <link
            id="kux-font-css"
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/font/css.css`}
            as="style"
          />
          <link
            rel="preload"
            href={`${cdnPrefix}/natasha/npm/@kux/mui-next@1.0.0-beta.40073e8/style.css`}
            as="style"
          />
          <link
            rel="stylesheet"
            href={`${cdnPrefix}/natasha/npm/@kux/mui-next@1.0.0-beta.40073e8/style.css`}
          />
          <script
            async
            src={`${cdnPrefix}/natasha/npm/google-ads/gtag/gtag.js`}
          />
          <Script id="patch-font-css" strategy="afterInteractive">
            {`function patchLink(i,h){var l=document.getElementById(i);if(!l)return;var p=false;function d(){if(p)return;p=true;l.rel='stylesheet';l.removeEventListener('load',d);l.removeEventListener('error',f)}function f(){if(p)return;p=true;var fl=document.createElement('link');fl.rel='stylesheet';fl.href=h;document.head.appendChild(fl);l.removeEventListener('load',d);l.removeEventListener('error',f)}l.addEventListener('load',d);l.addEventListener('error',f);('requestIdleCallback'in window)?requestIdleCallback(()=>{if(!p)d()},{timeout:2000}):setTimeout(()=>{if(!p)d()},2000)}patchLink('kux-font-css','${cdnPrefix}/natasha/npm/@kux/font/css.css');`}
          </Script>
          <Script id="gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){
                window.dataLayer.push(arguments);
              }
              gtag('js', new Date());
              gtag('config', 'AW-380686645');
              `}
          </Script>
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
