'use client';
import dynamic from 'next/dynamic';
import { Route, Routes, useParams } from 'react-router-dom';
import { getCurrentLang, getCurrentLocale } from 'kc-next/boot';
import { IS_CLIENT_ENV } from 'kc-next/env';
import { RTL_LANGUAGES } from '@/config/base';
import { useEffect } from 'react';
import { getCurrentBaseName } from 'kc-next/i18n';
import CommonProvider from '@/components/Providers/CommonProvider';
import PricePaginationPage from '@/pages/price/page/[page]';

// 重要：如果要禁用客户端组件的预渲染，可以使用ssr以下选项设置false Error rendering page:  Error: Cancel rendering route
// https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic


const Custom404 = dynamic(() => import("@/pages/_error"), { ssr: false });
const PriceIndex = dynamic(() => import("@/pages/price/index"), { ssr: false });
const PriceHotList = dynamic(() => import("@/pages/price/hot-list/index"), { ssr: false });
const PriceNewCoins = dynamic(() => import("@/pages/price/new-coins/index"), { ssr: false });
const PriceTopGainers = dynamic(() => import("@/pages/price/top-gainers/index"), { ssr: false });
const PriceCoinPage = dynamic(() => import("@/pages/price/[coin]/index"), { ssr: false });


  function RedirectTo404() {

    useEffect(() => {
      const path = window.location.pathname;
      // 如果已经在 /404 页,防止无限循环
      // 处理spa 404 跳转main-web
      if (!path.includes('/404')) {
        window.location.href = `${getCurrentBaseName()}/404?from=${encodeURIComponent(
          path
        )}`;
      }
    }, []);
    return null;
  }

  // 设置文档语言属性
  if (IS_CLIENT_ENV) {
    if (document && document.documentElement) {
      document.documentElement.setAttribute('lang', getCurrentLocale());
      document.documentElement.setAttribute(
        'dir',
        RTL_LANGUAGES.includes(getCurrentLang()) ? 'rtl' : 'ltr'
      );
    }
  }

export default function SpaPage() {

  return (
    <CommonProvider>
      <Routes>  
        {/* Learn layout 包裹子路径 */}
        <Route path="price">
          <Route index element={<PriceIndex />} />
          <Route path="page/:page" element={<PricePaginationPage />} />
          <Route path='hot-list' element={<PriceHotList />} />
          <Route path='new-coins' element={<PriceNewCoins />} />
          <Route path='top-gainers' element={<PriceTopGainers />} />
          <Route path=":coin" element={<PriceCoinPage />} />
        </Route>
        {/* 404 */}
        <Route path="404" element={<Custom404 statusCode={404} />} />
        {/* fallback 到 404 */}
        {/* 404 */}
        <Route path='*' element={<RedirectTo404 />} />
      </Routes>
    </CommonProvider>
  );
}
