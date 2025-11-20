/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import 'animate.css';
import { WOW } from 'wowjs';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import Header from 'components/Header/KCHeader';
// import JoinUs from 'components/$/Investment/JoinUs';
import { useIsMobile } from 'components/Responsive';
import Footer from 'components/Footer/KCFooter';
import style from './style.less';
import Guardian from 'components/$/Guardian';
import { ThemeProvider } from '@kufox/mui';
import JsBridge from 'utils/jsBridge';

import { connect } from 'dva';

const IndexPage = () => {
  const isMobile = useIsMobile();
  const isInApp = JsBridge.isApp();

  useEffect(
    () => {
      new WOW({
        offset: isMobile ? 60 : 100,
        // mobile: false,
      }).init();
    },
    [isMobile],
  );

  return (
    <ThemeProvider theme="dark">
      {isInApp || isMobile ? (
        <div className={style.indexPage}>
          <Guardian isMobile={isMobile} />
        </div>
      ) : (
        <div className={style.indexPage}>
          <Header theme="dark" />
          <div>
            <Guardian isMobile={isMobile} />
          </div>
          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
  // return (
  //   <ThemeProvider>
  //     <div className={style.indexPage}>
  //       <Header theme="dark" />
  //       <div>
  //         <Guardian isMobile={isMobile} />
  //       </div>
  //       <Footer />
  //     </div>
  //   </ThemeProvider>
  // );
};

export default brandCheckHoc(IndexPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
