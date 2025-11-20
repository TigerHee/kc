/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@/style/emotion';
import { _t } from 'Bot/utils/lang';
import { Text } from 'Bot/components/Widgets';

const Tag = styled(Text)`
  border-radius: 2px;
  padding: 0 2px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 15.6px */
  color: ${({ theme, color }) => theme.colors[color]};
  background-color: ${({ theme, color, noBk }) =>
    (noBk ? 'transparent' : theme.colors[`${color}12`])};
`;
const config = {
  long: {
    color: 'primary',
    lang: 'futrgrid.zuoduo',
  },
  short: {
    color: 'secondary',
    lang: 'futrgrid.zuokong',
  },
};
export {
  Tag,
};
/**
 * @description: 显示合约 做多做空tag , 可以单独显示方向或者倍数
 * @return {*}
 */
export default ({ direction, leverage, noBk, className, ...rest }) => {
  if (!direction && !leverage) {
    return null;
  }
  const { color, lang } = config[direction] ?? {};
  leverage = leverage ? `${leverage}x` : '';
  // 方向不存在, 杠杆倍数存在
  if (!lang && leverage) {
    return (
      <Tag color="text" fs={12} noBk={noBk} className={`bot-future-tag ${className}`} {...rest}>
        {leverage}
      </Tag>
    );
  }
  // 方向存在, 杠杆倍数可存在
  return <Tag color={color} fs={12} noBk={noBk} className={`bot-future-tag ${className}`} {...rest}>{`${_t(lang)} ${leverage}`}</Tag>;
};
