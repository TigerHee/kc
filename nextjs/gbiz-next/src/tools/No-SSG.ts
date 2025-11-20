import { IS_SSG_ENV } from 'kc-next/env';

/**
 * SSG 环境不渲染
 *
 * @param fallback  定义当在ssg 环境运行时进行的渲染;
 */
const NoSSG = ({ children, fallback = null }) => {
  if (IS_SSG_ENV) {
    return fallback;
  }
  return children;
};

export default NoSSG;
