/**
 * Owner: willen@kupotech.com
 */
/**
 * Root Component
 * runtime: next/browser
 */
import React, { ReactNode } from "react";
import Spin from '@kux/mui-next/Spin';

import clsx from "clsx";
import { SEO_META_CONFIG } from "@/config/base";
import { OgImage, SEOmeta } from "gbiz-next/seo";
import styles from "./styles.module.scss";
import { useRouter } from "kc-next/compat/router";
import { type NextRouter } from "kc-next/router";
import { getCurrentLang } from "kc-next/i18n";
import dynamic from "next/dynamic";
import CustomHead from "@/components/CustomHead";
import { IS_SPA_MODE } from "kc-next/env";
import { useInitialProps } from "gbiz-next/InitialProvider";
import usePlatformSize from "@/hooks/usePlatformSize";
import { bootConfig } from "kc-next/boot";


const Footer = dynamic(() => import("@/components/Root/Footer"), { ssr: true });
const Header = dynamic(
  () => import("@/components/Root/Header"),
  { 
    ssr: true,
  },
);

enum LayoutType {
  BOTH = 0, // 头部和底部都存在的布局
  ONLYHEAD = 1, // 没有底部，只有头部
  ONLYMAIN = 2, // 头部和底部都没有
}

interface StateProps {
  isUseNewIndex?: boolean;
  countryInfo?: any;
  illegalGpList?: any;
  isUserLogin?: boolean;
  traded?: boolean;
}

interface OwnProps {
  type?: LayoutType;
  theme?: string;
  className?: string;
  children?: ReactNode;
}

type Props = OwnProps & StateProps;

const Root: React.FC<Props> & { LayoutType: typeof LayoutType } = ({
  type = LayoutType.BOTH,
  theme,
  className = "",
  children,
}) => {
  const router: NextRouter | null = useRouter();
  const currentLang = getCurrentLang();
  const pageProps = useInitialProps();

  const { isMobile, isApp } = usePlatformSize();
  const loadingContainerHeight = isMobile ? 64 : 72;

  const isSPAReady = IS_SPA_MODE ? pageProps?.spaInitialReady: true;

  const body = (
    <main
      className={`page-body ${styles.body} ${
        type === LayoutType.ONLYMAIN ? styles.onlymain : ""
      }`}
    >
      {children}
    </main>
  );

  return (
    <Spin spinning={!isSPAReady}>
      <div className={clsx("root", styles.root, className)} data-theme={theme}>
        <CustomHead>
          <OgImage />
          <SEOmeta
            currentLang={currentLang}
            languages={bootConfig.languages.__ALL__}
            isArticle={false}
            useAlterLang={true}
            pathname={router?.pathname}
            queryConfig={SEO_META_CONFIG}
          />
        </CustomHead>
        {
          isSPAReady && !isApp && (
            <div style={{ minHeight: loadingContainerHeight, position: 'relative' }}>
              <Header />
            </div>
          )
        }
        {(type === LayoutType.BOTH ||
          type === LayoutType.ONLYHEAD ||
          type === LayoutType.ONLYMAIN) && 
          body}
        {/* // footer (app访问新手学院不展示footer) */}
        {isSPAReady && type === LayoutType.BOTH && !isApp && (
          <Footer />
        )}
      </div>
    </Spin>
    
  );
};

Root.LayoutType = LayoutType;

export default Root;
