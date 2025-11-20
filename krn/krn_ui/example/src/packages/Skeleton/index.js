/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

import API from 'components/Skeleton/API';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Skeleton" />
      <ScrollView>
        <ParamList
          list={{
            ...API,
            'type[Skeleton.Row]': {
              type: 'string',
              comment: '*子组件Row的渲染类型，可选值为line、circle、square，默认为line',
              defaultValue: 'line',
            },
          }}
        />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Skeleton/Basic').default,
              sourceCode: require('../../demos/Skeleton/Basic.doc').default,
            },
            {
              title: '动画效果',
              Component: require('../../demos/Skeleton/Active').default,
              sourceCode: require('../../demos/Skeleton/Active.doc').default,
            },
            {
              title: '自定义颜色',
              Component: require('../../demos/Skeleton/Custom').default,
              sourceCode: require('../../demos/Skeleton/Custom.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
