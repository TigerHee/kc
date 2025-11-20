/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';

const LoansLayoutWrap = styled.div`
  width: 1200px;
  margin: 0 auto;
  background: ${(props) => props.theme.colors.overlay};
`;

const LoansLayout = (props) => {
  const { children } = props;
  return <LoansLayoutWrap>{children}</LoansLayoutWrap>;
};

export default LoansLayout;
