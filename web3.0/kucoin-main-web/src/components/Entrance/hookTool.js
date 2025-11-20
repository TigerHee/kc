/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

import { searchToJson } from 'helper';

import bg from 'static/global/bg.png';
// 新人注册 banner
import newcomerBanner from 'static/global/newcomer_banner.png';

export const useBackground = () => {
  return {
    background: `url(${bg}) no-repeat left top`,
    backgroundSize: 'cover',
  };
};

export const useNewcomerBannerBackground = () => {
  return {
    background: `url(${newcomerBanner}) no-repeat left top`,
    backgroundSize: 'cover',
  };
};

export const useQueryParams = () => {
  const query = searchToJson();
  const { jwtLogin, return_to, back, backUrl } = query || {};

  const _url = back || backUrl;
  const isThird = !!(_url && window._CHECK_BACK_URL_IS_SAFE_(_url));
  const isPoolx = !!(_url && _url.indexOf('pool-x') > -1);
  return {
    jwtLogin,
    return_to,
    back,
    isThird,
    isPoolx,
    backUrl,
  };
};

export const useDefaultSign = () => {
  const dispatch = useDispatch();
  const { phoneSignUpEnabled } = useSelector((state) => state.app);
  useEffect(() => {
    dispatch({
      type: 'app/getPhoneSignUpEnabled',
    });
  }, [dispatch]);

  let _phoneSignUpEnabled = IS_INSIDE_WEB ? true : phoneSignUpEnabled;

  try {
    const query = searchToJson();
    const { type = '' } = query || {};
    if (type && type === 'mail') {
      _phoneSignUpEnabled = false;
    }
  } catch (e) {
    //
  }

  return _phoneSignUpEnabled ? 'sign.phone.tab' : 'sign.email.tab';
};
