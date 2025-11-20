/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment, useEffect } from 'react';
import { useIsMobile } from 'components/Responsive';
import { WOW } from 'wowjs';
import 'animate.css';
import Head from 'components/Head';
import Register from 'components/$/Register';
import RegisterH5 from 'components/$/Register_H5';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { ga } from 'utils/ga';

const RegisterPage = () => {
  const isMobile = useIsMobile();

  useEffect(
    () => {
      new WOW({ offset: isMobile ? 20 : 50 }).init();
      // 埋点
      if (isMobile) {
        ga('H5_Register_Views');
      } else {
        ga('PC_Register_Views');
      }
    },
    [isMobile],
  );
  return (
    <Fragment>
      <Head>
        <script src="https://assets.staticimg.com/natasha/npm/yandex/metrica-watch-tag.min.js" defer />
        <script id="twitter-oct" src="https://assets.staticimg.com/natasha/npm/twitter/ads_oct.js" defer />
        <script>
          {`
            window.ym = window.ym || function() { (window.ym.a = window.ym.a || []).push(arguments) };
            window.ym.l = 1 * new Date();
            ym(84577030, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
          `}
        </script>
        <script>
          {`
            const twitterOct =  document.getElementById('twitter-oct');
            twitterOct.onload = function () {
              if (!window.twq) {
                const s = () => {
                  if (s.exe) {
                    s.exe.apply(s, arguments);
                  } else {
                    s.queue.push(arguments);
                  }
                };
                s.version = '1.1';
                s.queue = [];
                window.twq = s;
              }
              window.twq('init', 'o7808');
              window.twq('track', 'PageView');
              if (window.twttr) {
                window.twttr.conversion.trackPid('o7ehj', { tw_sale_amount: 0, tw_order_quantity: 0 });
              }
            }
          `}
        </script>
        <script defer>
          {`
            (function(w,d,t,r,u) {
              var f,n,i;
              w[u]=w[u]||[],
              f=function() {
                var o={ti:"149004142" };
                o.q=w[u],
                w[u]=new UET(o),
                w[u].push("pageLoad")
              },
              n=d.createElement(t),
              n.src=r,
              n.async=1,
              n.onload=n.onreadystatechange=function() {
                var s=this.readyState;
                s&&s!=="loaded"&&s!=="complete"||(f(),
                n.onload=n.onreadystatechange=null)
              },
              i=d.getElementsByTagName(t)[0],
              i.parentNode.insertBefore(n,i)
            })
            (window,document,"script","https://assets.staticimg.com/natasha/npm/bing/bing_bat.js","uetq");
          `}
        </script>
        <script defer>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://assets.staticimg.com/natasha/npm/facebook/fbevents.js');
            fbq('init', '487702369702557');
            fbq('track', 'PageView');
          `}
        </script>
      </Head>
      {isMobile ? <RegisterH5 /> : <Register />}
    </Fragment>
  );
};

export default brandCheckHoc(RegisterPage, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
