/**
 * Owner: garuda@kupotech.com
 * 箭头展示
 */

import React from 'react';

import { ICTriangleBottomOutlined, ICTriangleTopOutlined } from '@kux/icons';

import { styled } from '../../builtinCommon';

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 16px;
  color: ${(props) => props.theme.colors.icon};
  > svg {
    width: 16px;
  }
`;

const TriangleIconWrapper = ({ className, active, ...other }) => {
  return (
    <IconWrapper className={className} {...other}>
      {active ? <ICTriangleTopOutlined /> : <ICTriangleBottomOutlined />}
    </IconWrapper>
  );
};

export default React.memo(TriangleIconWrapper);
