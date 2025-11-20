/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Radio/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Radio" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Radio/Basic').default,
              sourceCode: require('../../demos/Radio/Basic.doc').default,
            },
            {
              title: '分组选择',
              Component: require('../../demos/Radio/Group').default,
              sourceCode: require('../../demos/Radio/Group.doc').default,
            },
            {
              title: '自定义样式',
              Component: require('../../demos/Radio/Custom').default,
              sourceCode: require('../../demos/Radio/Custom.doc').default,
            },
            {
              title: '禁用状态',
              Component: require('../../demos/Radio/Disabled').default,
              sourceCode: require('../../demos/Radio/Disabled.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
