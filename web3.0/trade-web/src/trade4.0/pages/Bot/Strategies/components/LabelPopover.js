/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Popover from 'Bot/components/Common/Popover';
import { getAvailLang } from 'Bot/helper';
import { Text, DashText } from 'Bot/components/Widgets';
import { _t } from 'Bot/utils/lang';
import { botCompEntryConfig } from 'Bot/Strategies';
import { strasNameMap } from 'Bot/config';
import { isFunction } from 'lodash';
import styled from '@emotion/styled';

const MDashText = styled(DashText)`
  color: ${({ theme }) => theme.colors.text40};
`;
/**
 * @description: 纯展示组件
 * @param {*} title
 * @param {*} content
 * @param {*} viewMoreUrl
 * @return {*}
 */
export const LabelPopoverTemp = ({ title, content, viewMoreUrl, children, className }) => {
  return (
    <Popover
      placement="top"
      title={<Text fs={14}>{title}</Text>}
      content={
        <Text fs={12}>
          {content}
          {viewMoreUrl && (
            <div className="right">
              <a
                href={viewMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="color-primary"
              >
                {_t('clsgrid.btchintcancel')}
              </a>
            </div>
          )}
        </Text>
      }
    >
      <MDashText className={className}>{children}</MDashText>
    </Popover>
  );
};
/**
 * @description: tooltip展示文案解释
 * @param {string} tipKey 要展示的tooltip key
 * @param {string} straName 后端策略名字
 * @return {*}
 */
export default ({ children, tipKey, straName, ...restProps }) => {
  const templateId = strasNameMap.get(straName)?.id;
  const config = botCompEntryConfig.get(String(templateId)).get('config');
  if (!config || !config.tipConfig) return children;

  const { title, content, moreLinks } = config.tipConfig()[tipKey];
  let viewMoreUrl = '';
  if (moreLinks) {
    viewMoreUrl = moreLinks[getAvailLang()];
  }
  const _content = isFunction(content) ? content({ ...restProps }) : content;

  return (
    <LabelPopoverTemp title={title} content={_content} viewMoreUrl={viewMoreUrl}>
      {children}
    </LabelPopoverTemp>
  );
};
