'use client';
import { RTL_LANGUAGES } from '@/config/base';
import { getCurrentLang, getCurrentLocale } from 'kc-next/boot';
import { IS_CLIENT_ENV } from 'kc-next/env';
import { getCurrentBaseName } from 'kc-next/i18n';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

// 重要：如果要禁用客户端组件的预渲染，可以使用ssr以下选项设置false Error rendering page:  Error: Cancel rendering route
// https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic

const RestrictPage = dynamic(() => import('@/pages/restrict'), { ssr: false });
const SigninPage = dynamic(() => import('@/pages/ucenter/signin'), {
  ssr: false,
});
const SignupPage = dynamic(() => import('@/pages/ucenter/signup'), {
  ssr: false,
});
const ResetPasswordPage = dynamic(
  () => import('@/pages/ucenter/reset-password'),
  { ssr: false }
);

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

export const routerConfig = [
  {
    path: '/restrict',
    component: () => <RestrictPage />,
  },
  {
    path: '/ucenter/signin',
    component: () => <SigninPage />,
  },
  {
    path: '/ucenter/signup',
    component: () => <SignupPage />,
  },
  {
    path: '/ucenter/reset-password',
    component: () => <ResetPasswordPage />,
  },
];

export default function SpaPage() {
  return (
    <Routes>
      {routerConfig.map((item) => (
        <Route key={item.path} path={item.path} element={item.component()} />
      ))}
      {/* SPA 404 需要到 main-web 单独处理,否则用error page */}
      <Route path="*" element={<RedirectTo404 />} />
    </Routes>
  );
}
