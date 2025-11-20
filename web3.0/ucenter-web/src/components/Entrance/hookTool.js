/**
 * Owner: willen@kupotech.com
 */

import searchToJson from 'utils/searchToJson';

import bg from 'static/ucenter/resetPassword.png';

// 新人注册 banner
import newcomerBanner from 'static/global/newcomer-banner.png';

export const useBackground = () => {
  return {
    background: `url(${bg}) no-repeat center/cover`,
  };
};

export const useBackgroundDark = () => {
  return {
    background: `url(${bg}) no-repeat center/cover`,
  };
};

export const useNewcomerBannerBackground = () => {
  return {
    background: `url(${newcomerBanner}) no-repeat left top`,
    backgroundSize: 'cover',
  };
};

// 不再支持 ignoreKycCheck

// const NEED_IGNORE_KYC_ROUTS = [
//   '/invite-to-earn',
//   // 乐高分享页面
//   '/campaigns/',
// ];

export const useQueryParams = () => {
  const query = searchToJson();
  const { jwtLogin, return_to, back, backUrl, signUpType } = query || {};

  const _url = back || backUrl;
  const isPoolx = !!(_url && _url.indexOf('pool-x') > -1);
  // const ignoreKycCheck = !!(
  //   _url &&
  //   NEED_IGNORE_KYC_ROUTS.find((i) => decodeURIComponent(decodeURIComponent(_url)).indexOf(i) > -1)
  // );

  return {
    jwtLogin,
    return_to,
    back,
    isThird: window._CHECK_BACK_URL_IS_SAFE_(back), // isThird仅受back参数影响
    isPoolx,
    ignoreKycCheck: false,
    backUrl,
    signUpType,
  };
};
