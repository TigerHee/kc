/**
 *   Owner: willen@kupotech.com
 */
import React from 'react';
import { useHtmlToReact } from 'hooks';
const Html = (props) => {
  const { component, children, ...others } = props;
  const Component = component || 'div';
  const { eles } = useHtmlToReact({ html: children });
  return <Component {...others}>{eles}</Component>;
};
export default Html;
