/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { getSideTextMeta } from 'FutureMartingale/util';
import styled from '@emotion/styled';
import { _t } from 'Bot/utils/lang';

const SideText = styled.span`
  color: ${({ theme, color }) => theme.colors[color]};
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  ${({ simple, theme, color }) => {
    if (!simple) {
      return `
      background-color: ${theme.colors[`${color}12`]};
      border-radius: 4px;
      padding: 2px 6px;
      `;
    }
  }}
`;
/**
 * @description: 根据方向/买 获取显示的买卖文本
 * @param {*} direction
 * @param {*} isBuy
 * @param {boolean} simple true 提交页面显示用
 * @return {*}
 */
const SideTextByDirection = ({ direction = 'long', isBuy, simple, ...rest }) => {
  const { color, text } = getSideTextMeta({ direction, isBuy });
  return (
    <SideText color={color} simple={simple} {...rest}>
      {_t(text)}
    </SideText>
  );
};

export default SideTextByDirection;
