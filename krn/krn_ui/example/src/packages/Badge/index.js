/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Badge/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Badge" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Badge/Basic').default,
              sourceCode: require('../../demos/Badge/Basic.doc').default,
            },
            {
              title: '自定义样式',
              Component: require('../../demos/Badge/Custom').default,
              sourceCode: require('../../demos/Badge/Custom.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
