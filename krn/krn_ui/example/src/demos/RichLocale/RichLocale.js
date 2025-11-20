import React from 'react';
import styled from '@emotion/native';
import {RichLocale} from '@krn/ui';
// 业务项目中 _t 从 useLang 获取
import {_t} from './mock';

const Content = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;
const RichText = styled.Text`
  color: ${({color, theme}) => {
    return color || theme.color.secondary;
  }};
  font-weight: 500;
`;

// 示例文案
// '{{del}}测试翻译<GET>{{get}}</GET>泰裤辣<POST>{{post}}</POST>测试翻译<TEST>888</TEST><NO>不替换标签</NO>'

export default () => {
  return (
    <Content>
      <RichLocale
        message={_t('intl.key.test', {
          post: 'post的value',
          get: 'get的value',
          del: 'del的value',
        })}
        renderParams={{
          POST: {
            component: RichText,
            componentProps: {color: 'blue'},
          },
          GET: {}, // 空对象默认使用Text替换
          TEST: {
            component: RichText,
          },
        }}
      />
    </Content>
  );
};
