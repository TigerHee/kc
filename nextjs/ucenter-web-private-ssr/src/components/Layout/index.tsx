import clsx from 'clsx';
import Bot from '@/components/Bot';
import ConflictModal from '@/components/ConflictModal';
import CustomHead from '@/components/CustomHead';
import Header from '@/components/Header';
import { useInitialData } from '@/components/Layout/useInitialData.ts';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { useTdkMeta } from '@/components/Layout/useTdkMeta.ts';
import { SEO_META_CONFIG } from '@/config/base';
import useCommonServiceInit from '@/hooks/useCommonServiceInit';
import useLocaleOrder from '@/hooks/useLocaleOrder';
import useRouteChange from '@/hooks/useRouteChange';
import useLangList from '@/hooks/useLangList';
import JsBridge from 'gbiz-next/bridge';
import { OgImage, SEOmeta } from 'gbiz-next/seo';
import { GoogleTagManager, OneTrustManager } from 'gbiz-next/thirdParties';
import AnalyticsModule from 'hocs/analyticsModule';
import { bootConfig } from 'kc-next/boot';
import { IS_SERVER_ENV } from 'kc-next/env';
import { getCurrentLang } from 'kc-next/i18n';
import { useRouter, type NextRouter } from 'kc-next/router';
import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import ErrorBoundary, { SCENE_MAP } from '../common/ErrorBoundary';
import RootAccountLayout from './RootAccountLayout';
import styles from './styles.module.scss';

interface IProps {
  children: React.ReactNode;
}

const withoutHeaderPath = ['/account/kyc/tax', '/account/kyc/update', '/oauth', '/utransfer'];
const withoutFooterPath = ['/account/kyc/tax', '/account/kyc/update', '/oauth', '/utransfer'];

const Layout = (props: IProps) => {
  useLocaleOrder();
  useRouteChange();
  useInitialData();
  useCommonServiceInit();
  useLangList();
  const tdkMeta = useTdkMeta();
  const [init, setInit] = useState(false);
  const router: NextRouter | null = useRouter();
  const currentLang = getCurrentLang();
  const { pathname = '' } = router || {};

  const initialProps = useInitialProps();
  const isInApp = IS_SERVER_ENV ? initialProps?.['_platform'] === 'app' : JsBridge.isApp();

  const isWithoutHeader = withoutHeaderPath.includes(pathname) || isInApp;
  const isWithoutFooter = withoutFooterPath.includes(pathname) || isInApp;

  useEffect(() => {
    setInit(true);
    if (JsBridge.isApp()) {
      /** 关闭 app loading 蒙层 */
      JsBridge.open({
        type: 'func',
        params: {
          name: 'onPageMount',
          dclTime: window.DCLTIME,
          pageType: IS_SERVER_ENV ? 'SSR' : 'CSR', //'SSR|SSG|ISR|CSR'
        },
      });
    }
  }, []);
  console.warn('check 进入 Layout');

  return (
    <div className="root">
      <CustomHead>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <OgImage />
        <SEOmeta
          currentLang={currentLang}
          languages={bootConfig.languages.__ALL__}
          pathname={pathname}
          queryConfig={SEO_META_CONFIG}
        />

        {/* TDK 接入 */}
        {tdkMeta}
        {/* OneTrust 接入 */}
        <OneTrustManager />
      </CustomHead>

      {!isWithoutHeader && (
        <ErrorBoundary scene={SCENE_MAP.root.header}>
          <div className={clsx(styles.header, init && styles.unset)}>
            <Header />
          </div>
        </ErrorBoundary>
      )}

      <ErrorBoundary scene={SCENE_MAP.root.body}>
        <div className={styles.content}>
          {/* 站点内容 */}
          <RootAccountLayout>{props.children}</RootAccountLayout>
        </div>
      </ErrorBoundary>

      {!isWithoutFooter && (
        <ErrorBoundary scene={SCENE_MAP.root.footer}>
          <Footer />
        </ErrorBoundary>
      )}

      {/* GoogleTagManager 可接入在这里 */}
      <GoogleTagManager />
      {/* 用户碰撞检测弹窗 */}
      <ConflictModal />
      <Bot />
    </div>
  );
};

export default AnalyticsModule()(Layout);
