/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';
import React, { memo } from 'react';

export const MaskWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const PlaceholderWrapper = styled(MaskWrapper)`
  color: ${(props) => props.theme.colors.text40};
`;

/**
 * Mask ***
 */
const Mask = (props) => {
  const { children = '***', ...restProps } = props;
  return <MaskWrapper {...restProps}>{children}</MaskWrapper>;
};

/**
 * Placeholder --
 */
const Placeholder = (props) => {
  const { children = '--', ...restProps } = props;
  return <PlaceholderWrapper {...restProps}>{children}</PlaceholderWrapper>;
};

export default memo(Mask);

export { Placeholder };
