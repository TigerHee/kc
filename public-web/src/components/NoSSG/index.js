/**
 * Owner: hanx.wei@kupotech.com
 */
import React from 'react';

/**
 * 是否处于 SSG 生成环境中
 */
export const IS_SSG_ENV = navigator.userAgent.indexOf('SSG_ENV') !== -1;

export default ({ children, placeholder = null }) => {
  const [element, setElement] = React.useState(placeholder);

  React.useEffect(() => {
    if (IS_SSG_ENV) {
      setElement(placeholder);
    }
  }, [placeholder]);

  React.useEffect(() => {
    if (!IS_SSG_ENV) {
      setElement(children);
    }
  }, [children]);

  return element;
};
