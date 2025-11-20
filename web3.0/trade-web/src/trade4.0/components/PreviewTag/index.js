/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-16 20:53:12
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-17 18:18:43
 * @FilePath: /trade-web/src/trade4.0/components/PreviewTag/index.js
 * @Description:
 */

import React from 'react';
import { _t } from 'utils/lang';
import { styled, fx, colors, withMedia } from '@/style/emotion';

export const PreviewTagIcon = styled.div`
  width: auto;
  padding: 0 2px;
  height: 16px;
  background: ${(props) => props.theme.colors.primary};
  ${(props) => fx.color(props, 'textEmphasis')};
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  margin-left: 6px;
  word-break: keep-all;
`;

const PreviewTag = (props) => {
  return <PreviewTagIcon>{_t('preview.tips.icon')}</PreviewTagIcon>;
};

export default PreviewTag;
