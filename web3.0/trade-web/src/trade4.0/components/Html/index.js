/**
 * Owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import { htmlToReactSync } from '@/utils/htmlToReactSync';

const Html = (props) => {
  const { component, children, ...others } = props;
  const Component = component || 'div';
  return (
    <Component {...others}>
      {htmlToReactSync(children)}
    </Component>
  );
};

export default memo(Html);
