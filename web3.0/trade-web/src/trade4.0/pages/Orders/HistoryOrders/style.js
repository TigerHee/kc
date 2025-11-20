/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 16:40:35
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 11:30:49
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/OpenOrders/style.js
 * @Description:
 */
import React from 'react';
import { styled, fx, Global, css } from '@/style/emotion';
import { useTheme } from '@kux/mui';
import { FlexColumm, textOveflow } from '@/style/base';

export const Wrapper = styled(FlexColumm)`
  flex: 1;
  overflow: hidden;
  ${({ direction }) => {
    if (!direction) {
      return 'display: none;';
    }
  }}
`;

// 全局样式， 可以用className
export const GlobalStyle = () => {
  const { colors } = useTheme();
  const style = css``;
  return <Global styles={style} />;
};

export const HistoryTopBarWrap = styled.section`
  display: flex;
`;
