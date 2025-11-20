import {pull} from 'utils/request';

/**
 * 跟单首页 banner
 */
export const pullHomeBanner = async () => {
  return await pull('/cms/ads', {
    ad_position: 'h5-copytrading-banner',
  });
};
