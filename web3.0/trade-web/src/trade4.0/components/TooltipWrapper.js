/*
 * owner: Borden@kupotech.com
 */
import React from 'react';
import { noop } from 'lodash';
import styled from '@emotion/styled';
import Tooltip from '@mui/Tooltip';

const Container = styled.span`
  display: inline-flex;
  align-items: center;
  ${(props) => {
    let styleStr = '';
    if (props.useUnderline) {
      styleStr += `
        font-size: 14px;
        font-weight: 400;
        line-height: 130%;
        color: ${props.theme.colors.text60};
        border-bottom: 1px dashed ${props.theme.colors.text40};
      `;
    }
    if (props.isTip || props.useUnderline) {
      styleStr += `
        cursor: help;
      `;
    }
    return styleStr;
  }}
`;

const TooltipWrapper = React.memo(
  ({
    isTip,
    children,
    className,
    onChildClick = noop,
    useUnderline = false,
    ...restProps
  }) => {
    return (
      <Tooltip
        placement="top"
        size={useUnderline ? 'basic' : 'small'}
        {...restProps}
      >
        <Container
          isTip={isTip}
          className={className}
          onClick={onChildClick}
          useUnderline={useUnderline}
        >
          {children}
        </Container>
      </Tooltip>
    );
  },
);

export default TooltipWrapper;
