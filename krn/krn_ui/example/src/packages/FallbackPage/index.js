/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/FallbackPage/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Empty" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/FallbackPage/Basic').default,
              sourceCode: require('../../demos/FallbackPage/Basic.doc').default,
            },
            {
              title: '跳转到错误页',
              Component: require('../../demos/FallbackPage').default,
              sourceCode: require('../../demos/FallbackPage/index.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
