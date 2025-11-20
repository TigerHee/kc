/**
 * Owner: melon@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { SHARE_APP_HOST } from 'config';
import { addLangToPath } from 'utils/lang';
import { LANDING_HOST } from 'utils/siteConfig';

/**
 * 获取 分享链接
 * @param {}
 * @param page 需要分享的页面string 默认是landing-web的kucoinlabs； 以首页为例子 https://www.kucoin.com/land/kucoinlabs 就只需要传入 kucoinlabs
 * @param needInviteCode 是否需要邀请码 默认是 true
 * @param needLangToPath 是否需要语言子路径 默认是false
 * @param webHost url webHost 默认是 null 不传递时分享链接会使用Land的host配置
 */
const useShareLink = ({
  page = 'kucoinlabs',
  needInviteCode = true,
  needLangToPath = false,
  webHost = null,
}) => {
  const { isLogin } = useSelector((state) => state.user);
  const { isInApp, currentLang, appInfo } = useSelector((state) => state.app);
  const { inviteCode } = useSelector((state) => state.kcCommon); // 邀请码
  // 分享的host
  const urlHost = useMemo(() => {
    if (webHost) {
      return webHost;
    }
    return isInApp ? `${appInfo?.webHost || SHARE_APP_HOST}/land` : LANDING_HOST;
  }, [isInApp, appInfo, webHost]);

  // 分享给好友的链接
  const shareLink = useMemo(() => {
    let targetUrl = `${urlHost}/${page}`;
    if (needInviteCode && isLogin && inviteCode) {
      targetUrl = `${urlHost}/${page}?rcode=${inviteCode}`;
    }
    if (needLangToPath) {
      targetUrl = addLangToPath(targetUrl);
    }
    return targetUrl;
  }, [inviteCode, urlHost, page, needInviteCode, needLangToPath, isLogin]);
  return shareLink;
};

export default useShareLink;
