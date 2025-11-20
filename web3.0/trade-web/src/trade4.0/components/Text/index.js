/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import Tooltip from '@mui/Tooltip';
import { styled, fx } from '@/style/emotion';

const TextContentUnderline = styled.span`
  ${(props) => fx.color(props, 'text40')}
  ${(props) => fx.borderBottom(props.underline ? '1px dashed' : '')}
  ${(props) => fx.borderColor(props.theme.colors.text20)}
  ${fx.cursor('help')}
`;

const TextContent = styled.span`
  ${(props) => fx.color(props, 'text40')}
  &.text60 {
    ${(props) => fx.color(props, 'text60')}
  }
`;

const Text = (props) => {
  const {
    underline = true,
    tips,
    children,
    tooltipClassName = '',
    className = '',
    ...rest
  } = props;
  return (
    <Fragment>
      {tips && (
        <Tooltip title={tips} leaveDelay={100} {...rest} interactive arrow disabledOnMobile>
          <TextContentUnderline className={`text-tip ${tooltipClassName}`} underline={underline}>
            {children}
          </TextContentUnderline>
        </Tooltip>
      )}
      {!tips && <TextContent className={`text-noTip ${className}`}>{children}</TextContent>}
    </Fragment>
  );
};

export default memo(Text);
