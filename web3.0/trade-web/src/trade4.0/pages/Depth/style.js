/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { styled, fx, Global, css } from '@/style/emotion';
import { useTheme } from '@kux/mui';
import { FlexColumm } from '@/style/base';

export const Wrapper = styled(FlexColumm)`
  flex: 1;
  overflow: hidden;
  ${({ direction }) => {
    if (!direction) {
      return 'display: none;';
    }
  }}
`;

const text = 'color: rgba(243, 243, 243, 0.6);';
const value = 'color: #F3F3F3;';

// 全局样式， 可以用className
export const GlobalStyle = () => {
  const { colors } = useTheme();
  const style = css`
    .depth-tips {
      & > div {
        display: flex;
        ${fx.alignItems('center')}
        color: ${colors.text60};
        ${text}
        ${fx.marginTop(8)}
      }
      & > div:first-of-type {
        ${fx.marginTop(0)}
      }
    }
    .depth-tips .tip-value {
      font-weight: 500;
      color: ${colors.text};
      ${value}
      flex: 1;
      ${fx.textAlign('right')}
      ${fx.marginLeft('12')}
    }
  `;
  return <Global styles={style} />;
};
