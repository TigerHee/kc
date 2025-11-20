/**
 * Owner: willen@kupotech.com
 */
/**
 * SSG 环境不渲染
 *
 * @param fallback  定义当在ssg 环境运行时进行的渲染;
 */

import React from 'react';

export default ({ children, fallback = null }) => {
  const [element, setElement] = React.useState(fallback);

  React.useEffect(() => {
    if (navigator.userAgent.indexOf('SSG_ENV') === -1) {
      setElement(children);
    }
  }, [children]);

  return element === undefined ? null : element;
};
