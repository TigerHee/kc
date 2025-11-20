import searchToJson from '@/utils/searchToJson';
import { checkUrlIsSafe } from '@/tools/helper';
import bg from './img/resetPassword.png';

// 新人注册 banner
import newcomerBanner from './img/newcomer-banner.png';

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

export const useQueryParams = (query?: Record<string, string>) => {
  const { jwtLogin, return_to, back, backUrl, signUpType, rcode } = query || searchToJson() || {};

  const _url = back || backUrl;
  const isPoolx = !!(_url && _url.indexOf('pool-x') > -1);

  return {
    jwtLogin,
    return_to,
    back,
    isThird: checkUrlIsSafe(back),
    isPoolx,
    ignoreKycCheck: false,
    backUrl,
    signUpType,
    rcode
  };
};
