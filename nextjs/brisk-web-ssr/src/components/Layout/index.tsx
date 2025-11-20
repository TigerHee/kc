import CustomHead from '@/components/CustomHead';
import Header from '@/components/Header';
import { useInitialData } from '@/components/Layout/useInitialData.ts';
import { useTdkMeta } from '@/components/Layout/useTdkMeta.ts';
import SeoOrganization from '@/components/Seo/SeoOrganization';
import ConflictModal from '@/components/ConflictModal';
import { SEO_META_CONFIG } from '@/config/base';
import useRouteChange from '@/hooks/useRouteChange';
import { OgImage, SEOmeta } from 'gbiz-next/seo';
import { GoogleTagManager, OneTrustManager } from 'gbiz-next/thirdParties';
import { useRouter } from 'kc-next/compat/router';
import { getCurrentLang, getSupportedLangs } from 'kc-next/i18n';
import { type NextRouter } from 'kc-next/router';
import React from 'react';
import Footer from '../Footer';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';
import ErrorBoundary from '../ErrorBoundary';

interface IProps {
  children: React.ReactNode;
}

const Layout = (props: IProps) => {
  useRouteChange();
  useInitialData();
  const tdkMeta = useTdkMeta();
  const router: NextRouter | null = useRouter();
  const currentLang = getCurrentLang();

  return (
    <div className='root'>
      <CustomHead>
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'
        />
        <OgImage />
        <SEOmeta
          currentLang={currentLang}
          languages={bootConfig.languages.__ALL__}
          pathname={router?.pathname}
          queryConfig={SEO_META_CONFIG}
        />
        <SeoOrganization
          currentLang={currentLang}
          pathname={router?.pathname}
        />

        {/* TDK 接入 */}
        {tdkMeta}
        {/* OneTrust 接入 */}
        <OneTrustManager />
      </CustomHead>
      {/* 主要是 Header 组件在 SSR 的时候，height 为 0；所以这里强制给个高度，hack 临时解决方案 */}
      <div className={styles.header}>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
      </div>
      <div className={styles.content}>
        {/* 站点内容 */}
        {props.children}
      </div>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      {/* GoogleTagManager 可接入在这里 */}
      <ErrorBoundary>
        <GoogleTagManager />
      </ErrorBoundary>
      {/* 用户碰撞检测弹窗 */}
      <ErrorBoundary>
        <ConflictModal />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
