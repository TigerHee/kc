/**
 * Owner: hanx.wei@kupotech.com
 */
import React from 'react';

export default ({ children, placeholder = null }) => {
  const [element, setElement] = React.useState(placeholder);

  React.useEffect(() => {
    if (navigator.userAgent.indexOf('SSG_ENV') === -1) {
      setElement(children);
    }
  }, [children]);

  return element;
};
