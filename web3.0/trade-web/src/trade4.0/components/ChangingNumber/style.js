/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';

export const ChangingWrapper = styled.span`
  position: relative;
  display: inline-block;
`;

export const ChangingBg = styled.span`
  position: absolute;
  top: -2px;
  bottom: -2px;
  opacity: 0.1;
  &.left {
    left: -16px;
    right: -6px;
  }
  &.right {
    left: -6px;
    right: -16px;
  }
`;

export const ChangingIcon = styled.span`
  // top: 0;
  font-weight: normal;
  &.left {
    left: -10px;
  }
  &.right {
    // right: -10px;
    position: relative;
  }
  svg {
    width: 9px;
    height: 9px;
  }
`;
