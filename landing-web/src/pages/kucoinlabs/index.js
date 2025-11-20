/**
 * Owner: odan.ou@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import 'animate.css';
import { WOW } from 'wowjs';
import { useSelector, connect } from 'dva';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import Header from 'components/$/Investment/Header';
import Welcome from 'components/$/Investment/Welcome';
import Partnership from 'components/$/Investment/Partnership';
import Supports from 'components/$/Investment/Supports';
import Qualification from 'components/$/Investment/Qualification';
import LatestUpdate from 'components/$/Investment/LatestUpdate';
import Portfolio from 'components/$/Investment/Portfolio';
import Research from 'components/$/Investment/Research';
import { useIsMobile } from 'components/Responsive';
import { getPathByLang, getLocalBase } from 'config';
import { changeLocation } from 'helper';
import loadable from '@loadable/component';
import { RestrictNotice, useRestrictNotice } from 'components/Header/KCHeader/RestrictNotice';
import JsBridge from 'utils/jsBridge';

const KCFooter = loadable(() => import('components/Footer/KCFooter'));
const Footer = loadable(() => import('components/$/Investment/Footer'));
// import { fixSeoMeta } from 'utils/seoTools';
import { useFetchHandle } from 'src/hooks';
import { pull } from 'utils/request';
import { ThemeProvider } from '@kufox/mui';
import style from './style.less';
import SiteRedirect from 'src/components/common/SiteRedirect';

const IndexPage = (props) => {
  const isMobile = useIsMobile();
  const isInApp = JsBridge.isApp();
  const fetchHandle = useFetchHandle();
  const user = useSelector((state) => state.user.user);
  const currentLang = useSelector((state) => state.app.currentLang);
  const [state, setstate] = useState({
    news: [],
    partnersLink: [],
    partnersShip: [],
    portfolio: [],
    research: [],
  });

  useEffect(() => {
    fetchHandle(pull('/kucoin-labs/info'), {
      onSilenceOk({ data }) {
        setstate(data);
      },
    });
  }, [fetchHandle]);

  useEffect(() => {
    const supportLangPath = props.langs.map((item) => {
      return getPathByLang(item.key);
    });
    // 初始进入界面不是支持的语言
    const { localeBasenameFromPath } = getLocalBase();
    if (!supportLangPath.includes(localeBasenameFromPath)) {
      changeLocation(window._DEFAULT_LANG_);
    }
  }, [props.langs]);

  useEffect(() => {
    new WOW({
      offset: isMobile ? 60 : 100,
      // mobile: false,
    }).init();
  }, [isMobile]);

  const { news, partnersLink, partnersShip, portfolio, research } = state;

  // 修改 labs title和description
  // useEffect(() => {
  //   // seo
  //   const seoFixer = fixSeoMeta({
  //     title: 'KuCoin Labs - Invesment and Research for Crypto Industry',
  //     description:
  //       'KuCoin Labs - an investment and research institution for crypto industry. We provide investments and supports for early-stage crypto and blockchain projects.',
  //   });
  //   seoFixer.set();
  //   return () => {
  //     if (seoFixer) {
  //       seoFixer.unload();
  //     }
  //   };
  // }, []);

  const noticeIsReady = useRestrictNotice();
  return (
    <div data-inspector="kucoinlabs">
      {noticeIsReady.isReady && RestrictNotice ? (
        <RestrictNotice
          userInfo={user}
          pathname={window.location.pathname}
          currentLang={currentLang}
        />
      ) : null}
      <Header data={partnersLink} />
      <div className={style.indexPage}>
        <Welcome />
        <Partnership data={partnersShip} />
        <Supports />
        <LatestUpdate data={news} />
        <Qualification />
        <Portfolio data={portfolio} />
        <Research data={research} />
      </div>
      <>{!isInApp || !isMobile ? <KCFooter /> : <Footer />}</>
      <SiteRedirect />
    </div>
  );
};

const IndexPageProvider = (props) => {
  return (
    <ThemeProvider>
      <IndexPage {...props} />
    </ThemeProvider>
  );
};

const Page = connect((state) => {
  return {
    langs: state.app.langs,
    currentLang: state.app.currentLang,
  };
})(IndexPageProvider);

export default brandCheckHoc(Page, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
