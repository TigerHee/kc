/**
 * Owner: chelsey.fan@kupotech.com
 */
export default function isMobile() {
  const regMobile =
    /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera\ mini|avantgo|mobilesafari|docomo)/i;
  const regPad = /ipad|playbook|(?:android|bb\d+|meego|silk)/i;
  if (regMobile.test(navigator.userAgent) || regPad.test(navigator.userAgent)) {
    return true;
  }
  return false;
}
