// X-Platform 有透传这个 header，值是 default / mobile / app
export const X_PLATFORM_HEADER = 'x-platform';

// 客户端判断是否是mobile
export const checkIsMobile = (userAgent: string) => {
  const regMobile =
    /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo)/i;
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

export function getPlatform(ctx: any) { 
  const ua = ctx.req.headers['user-agent'];
  const platform = ctx.req.headers[X_PLATFORM_HEADER] || getDefaultPlatform(ua);
  return {
    platform,
    isDefault: platform === 'default',
    isMobile: platform === 'mobile',
    isApp: platform === 'app',
  } 
}
