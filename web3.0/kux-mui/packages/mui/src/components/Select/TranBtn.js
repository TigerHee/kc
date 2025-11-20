/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { CloseOutlined } from '@kux/icons';
import styled from 'emotion/index';
import useTheme from 'hooks/useTheme';
import { TranBtnRoot, TranBtnContent } from './StyledComps';

const StyledIcon = styled(CloseOutlined)`
  cursor: pointer;
`;

const TranBtn = ({ size, onRemove, children }) => {
  const theme = useTheme();
  const handleClick = (event) => {
    if (event) event.stopPropagation();
    onRemove();
  };
  return (
    <TranBtnRoot theme={theme} size={size}>
      <TranBtnContent size={size}>{children}</TranBtnContent>
      <StyledIcon onClick={handleClick} color={theme.colors.icon} size={16} />
    </TranBtnRoot>
  );
};

export default TranBtn;
