/**
 * Owner: yang@kupotech.com
 */

import { css, styled } from '@kux/mui';
import clsx from 'clsx';
import { forwardRef } from 'react';

const SettingBtn = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  background-color: transparent;
  text-decoration: none;
  outline: none;
  cursor: pointer;
`;

const span_for_a = css`
  background-color: transparent;
  text-decoration: none;
  outline: none;
  cursor: pointer;
`;

const SpanForA = ({ className, ...rest }, ref) => {
  return <SettingBtn ref={ref} className={clsx(span_for_a, className)} {...rest} />;
};

export default forwardRef(SpanForA);
