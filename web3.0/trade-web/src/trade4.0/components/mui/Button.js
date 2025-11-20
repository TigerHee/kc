/*
 * owner: Borden@kupotech.com
 */
import React from 'react';
import { Button } from '@kux/mui';
import styled from '@emotion/styled';

const MuiButton = styled(Button)`
  ${(props) => {
    if (
      props.type === 'brandGreen' &&
      (!props.variant || props.variant === 'contained') // variant默认就是contained
    ) {
      return `
        color: ${props.theme.colors.textEmphasis};
        background: ${props.theme.colors.primary};
      `;
    }
  }}
`;

export const ButtonWeight = (props) => {
  const { fontWeight = 400, size = 'mini' } = props;
  return <MuiButton style={{ fontWeight }} {...props} size={size} />;
};

export default MuiButton;
