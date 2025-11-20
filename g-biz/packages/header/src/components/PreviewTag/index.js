/**
 * Owner: roger@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import { useLang } from '../../hookTool';

const PreviewTag = styled.span`
  display: flex;
  align-items: center;
  height: 15px;
  padding: 0px 3px;
  border-radius: 4px;
  background: rgba(1, 188, 141, 0.08);
  font-weight: 500;
  font-size: 10px;
  color: ${(props) => props.theme.colors.primary};
  margin-left: 4px;
`;

const Tag = () => {
  const { t } = useLang();
  return <PreviewTag>{t('sMUjriV7ZakUsQWbw49gp7')}</PreviewTag>;
};

export default Tag;
