// 判断SSG环境
export const isSSG = navigator.userAgent.indexOf('SSG_ENV') > -1;
/**
 * SSG 环境不渲染
 *
 * @param fallback  定义当在ssg 环境运行时进行的渲染;
 */
export const NoSSG = ({ children, fallback = null }) => {
  if (isSSG) {
    return fallback;
  }
  return children;
};
