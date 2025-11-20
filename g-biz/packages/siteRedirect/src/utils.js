/**
 * Owner: brick.fan@kupotech.com
 */

export const getSiteName = (site, t) => {
  switch (site) {
    case 'australia':
      return t('122f15eb20c94800a85a');
    case 'europe':
      return t('327afb2cd06c4800a436');
    case 'global':
      return t('e60f7f265df84800a4e3');
    case 'demo':
      return 'DEMO';
    default:
      return t('e60f7f265df84800a4e3');
  }
};
