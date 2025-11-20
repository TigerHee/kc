export default function isMobile() {
  // 正则匹配对应的手机特性
  let regMobile =
    /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera\ mini|avantgo|mobilesafari|docomo)/i;

  // 正则匹配对应的平板特性
  let regPad = /ipad|playbook|(?:android|bb\d+|meego|silk)/i;

  // 获取 UserAgent
  const userAgent = navigator.userAgent;

  // 检查是否是手机：
  if (regMobile.test(userAgent) || regPad.test(userAgent)) {
    return true;
  }

  return false;
}
