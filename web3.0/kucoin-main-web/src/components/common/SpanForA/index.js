/**
 * Owner: yang@kupotech.com
 */
import React, { forwardRef } from 'react';
import styled from '@emotion/styled';

const Span = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
`;

const SpanForA = ({ className, ...rest }, ref) => {
  return <Span ref={ref} className={className} {...rest} />;
};

export default forwardRef(SpanForA);
