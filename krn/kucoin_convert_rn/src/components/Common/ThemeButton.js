/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo} from 'react';
import {Button, fadeColor, useTheme} from '@krn/ui';
import styled from '@emotion/native';

const ButtonPro = styled(Button)`
  ${({size}) => {
    switch (size) {
      case 'small':
        return `
          height: 28px;
          padding: 0px 14px;
          font-size: 12px;
          border-radius: 14px;
        `;
      case 'large':
        return `
          height: 48px;
          font-size: 16px;
          border-radius: 48px;
        `;
      default:
        return `
          height: 40px;
          font-size: 16px;
          border-radius: 20px;
        `;
    }
  }}

  background-color: ${({theme, disabled, cancel}) => {
    if (cancel) {
      return theme.colorV2.cover4;
    }
    return theme.type === 'dark'
      ? fadeColor(theme.colorV2.primary, disabled ? 0.3 : 1)
      : fadeColor('#1D1D1D', disabled ? 0.3 : 1);
  }}
`;

/**
 * ThemeButton
 * cancel 为取消按钮
 */
const ThemeButton = memo(props => {
  const {children, cancel, ...restProps} = props;
  const theme = useTheme();
  return (
    <ButtonPro
      cancel={cancel}
      textStyle={{
        /* fontSize: 16, */
        color: cancel ? theme.colorV2.text : '#fff',
        fontWeight: '600',
      }}
      {...restProps}>
      {children}
    </ButtonPro>
  );
});

export default ThemeButton;
