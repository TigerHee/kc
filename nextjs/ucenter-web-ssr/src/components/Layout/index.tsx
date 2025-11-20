import React, { useEffect } from 'react';
import { bootConfig } from 'kc-next/boot';
import { OgImage, SEOmeta } from 'gbiz-next/seo';
import { GoogleTagManager, OneTrustManager } from 'gbiz-next/thirdParties';
import ConflictModal from '@/components/ConflictModal';
import { useRouter } from 'kc-next/compat/router';
import { getCurrentLang } from 'kc-next/i18n';
import JsBridge from 'gbiz-next/bridge';
import { type NextRouter } from 'kc-next/router';
import CustomHead from '@/components/CustomHead';
import { IS_SERVER_ENV } from 'kc-next/env';
import Header from '@/components/Header';
import Bot from '@/components/Bot';
import { useInitialData } from '@/components/Layout/useInitialData.ts';
import { useTdkMeta } from '@/components/Layout/useTdkMeta.ts';
import { SEO_META_CONFIG } from '@/config/base';
import useRouteChange from '@/hooks/useRouteChange';
import Footer from '../Footer';
import { noHeaderPaths, noFooterPaths, simplifyHeaderPaths } from './config';
import styles from './styles.module.scss';
import { IS_CLIENT_ENV } from 'kc-next/env';
import { isTMA } from '@/tools/isTMA';

interface IProps {
  children: React.ReactNode;
}

const isShowHeader = () => {
  if (IS_CLIENT_ENV) {
    if (JsBridge.isApp()) {
      return false;
    }
    if (isTMA()) {
      return false;
    }
  }

  return true;
};

const Layout = (props: IProps) => {
  useRouteChange();
  useInitialData();
  const tdkMeta = useTdkMeta();
  const router: NextRouter | null = useRouter();
  const currentLang = getCurrentLang();
  const pathname = router?.pathname || '';

  // 定义不需要Header的页面路径
  const shouldShowHeader = isShowHeader() && !noHeaderPaths.includes(pathname);

  // 定义需要简化Header的页面路径
  const shouldShowSimplifyHeader = simplifyHeaderPaths.includes(pathname);

  // 定义不需要Footer的页面路径
  const shouldShowFooter = !noFooterPaths.includes(pathname);

  useEffect(() => {
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

  return (
    <div className={styles.root}>
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

      {shouldShowHeader && <Header propsMenuConfig={['download', 'i18n', 'theme']} simplify={shouldShowSimplifyHeader} />}

      <div className={styles.content}>{props.children}</div>

      {shouldShowFooter && <Footer />}

      {/* GoogleTagManager 可接入在这里 */}
      <GoogleTagManager />
      {/* 用户碰撞检测弹窗 */}
      <ConflictModal />
      <Bot />
    </div>
  );
};

export default Layout;
