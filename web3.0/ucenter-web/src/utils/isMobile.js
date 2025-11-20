/**
 * Owner: chelsey.fan@kupotech.com
 */
export default function isMobile() {
  // 检查是否是手机
  let regMobile =
    /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot)\s.+?\smobile|palm|windows\s+ce|opera\ mini|avantgo|mobilesafari|docomo)/i;
  // (?:) 非捕获组，多个选项组合一起，但是不会捕获匹配的内容
  // .+? 非贪婪匹配的捕获的任意字符

  // 检查是否是 ipad
  let regPad = /(ipad|playbook|android|bb\d+|meego|silk)/i;
  // regPad = /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?!\s.+?\smobile))/i
  // (?!\s.+?\smobile) 负向先行断言，确保匹配的内容后面不跟 \s.+?\smobile (\s 匹配空白字符，.+? 非贪婪匹配的任意字符，尽可能少的匹配字符，mobile 匹配字符串 mobile),
  // 举例：匹配 android 但是不匹配 android mobile, 也就是后面不能跟 “ mobile”
  // 实际上这里的功能匹配到 iPad 和 mobile 的逻辑是一致的

  if (regMobile.test(navigator.userAgent) || regPad.test(navigator.userAgent)) {
    return true;
  }
  return false;
}
