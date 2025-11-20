/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';

const Label = styled.div`
  padding-left: 16px;
  font-size: 12px;
  line-height: 20px;
  font-family: ${({ theme }) => theme.fonts.family};
  color: ${({ theme }) => theme.colors.complementary};
  width: 100%;
  min-height: 24px;
`;
export default (props) => {
  return !!props.children && <Label {...props} />;
};
