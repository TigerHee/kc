/**
 * Owner: terry@kupotech.com
 */
import React from 'react';
import { useCompliantShow } from '../hooks';
import { NoSSG } from '../../../entrance/src/common/tools';

const CompliantBoxInner = ({ spm, children = null } = {}) => {
  // 显示控制逻辑
  const show = useCompliantShow(spm, { track: true });
  return show ? children : null;
};

export const CompliantBox = (props = {}) => {
  return (
    <NoSSG>
      <CompliantBoxInner {...props} />
    </NoSSG>
  );
};
