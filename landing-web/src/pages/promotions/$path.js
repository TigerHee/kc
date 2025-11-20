/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Helmet } from 'react-helmet';
import Loading from 'components/Loading';
import Templates from 'components/$/LeGo/templates';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

// const loadAnalyze = JsBridge.isApp();
const loadAnalyze = false;

const LeGo = ({
  match: {
    params: { path },
  },
  history,
}) => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);
  const { legoNameEn } = useSelector((state) => state.lego.config);
  const { isAe } = useSelector((state) => state.lego);
  const [isOkUrl, setIsOkUrl] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'lego/getConfig',
      payload: { legoCode: path },
    }).then((code) => {
      // 未配置的path 跳转至404
      if (code === '110020') {
        import('@kc/sentry').then(res => {
          const sentry = res.default;
          sentry?.captureEvent?.({
            message: `landing-web 乐高1.0 数据404, code: ${code}, pageUrl: ${encodeURIComponent(
              window.location.href,
            )}`,
            tags: { legoDataFailed: 'failed' },
            level: 'info',
          });
        });
        location.href = '/404';
      } else {
        setIsOkUrl(true);
      }
    });
  }, []);

  // 获取报名状态
  useEffect(() => {
    if (isLogin && legoNameEn) {
      dispatch({
        type: 'lego/getRegStatus',
        payload: { activityName: legoNameEn },
      });
    }
  }, [isLogin, legoNameEn]);

  // 判断是阿拉伯语
  useEffect(() => {
    if (isAe) {
      const bodyElement = document.getElementById('body');
      bodyElement.setAttribute('style', 'direction: rtl;');
    }
  }, [isAe]);
  if (isOkUrl) {
    return (
      <Fragment>
        {
          loadAnalyze ? (
            <Helmet>
              <script src="https://assets.staticimg.com/natasha/npm/yandex/metrica-watch-tag.min.js" defer />
              <script>
                {`
            window.ym = window.ym || function() { (window.ym.a = window.ym.a || []).push(arguments) };
            window.ym.l = 1 * new Date();
            ym(84577030, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
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
        </Helmet>
          ) : null
        }
        <Templates />
      </Fragment>
    );
  }

  return <Loading />;
};

export default brandCheckHoc(React.memo(LeGo), () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
