
// 客户端判断是否是mobile
export const checkIsMobile = (userAgent: string) => {
  const regMobile = /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo)/i;
  const regPad = /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?!\s.+?\smobile))/i;
  if (regMobile.test(userAgent) || regPad.test(userAgent)) {
    return true;
  }
  return false;
};

export const checkIsApp = (userAgent: string) => {
  return userAgent.indexOf('KuCoin') > -1;
};

export const getDefaultPlatform = (userAgent?: string) => {
  if (!userAgent) {
    return 'default';
  }

  const isApp = checkIsApp(userAgent);
  if (isApp) {
    return 'app';
  }

  const isMobile = checkIsMobile(userAgent);
  if (isMobile) {
    return 'mobile';
  }

  return 'default';
};
