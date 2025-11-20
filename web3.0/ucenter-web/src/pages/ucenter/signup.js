/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import NoSSG from 'components/NoSSG';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import SignUp from 'routes/Ucenter/SignUp';

const SignUpContainer = styled.div`
  width: 100%;
  flex: 1;
`;
export default () => {
  const dismiss = useSelector((state) => state?.$entrance_signUp?.forceKycInfo?.dismiss);

  // 当注册成功后进入kyc认证拦截页时，隐藏Header的登录注册按钮
  useEffect(() => {
    if (document.querySelector('#unLoginBox')) {
      if (dismiss) {
        document.querySelector('#unLoginBox').style.display = 'none';
      } else {
        document.querySelector('#unLoginBox').style.display = 'flex';
      }
    }
    return () => {
      if (document.querySelector('#unLoginBox')) {
        document.querySelector('#unLoginBox').style.display = 'flex';
      }
    };
  }, [dismiss]);

  return (
    <SignUpContainer data-inspector="signup_page">
      <NoSSG>
        <Helmet>
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
      </NoSSG>
      <ErrorBoundary scene={SCENE_MAP.signup.index}>
        <SignUp />
      </ErrorBoundary>
    </SignUpContainer>
  );
};
