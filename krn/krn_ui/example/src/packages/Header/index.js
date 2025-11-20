/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Header/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Header" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Header/Basic').default,
              sourceCode: require('../../demos/Header/Basic.doc').default,
            },
            {
              title: '自定义Header',
              Component: require('../../demos/Header/Custom').default,
              sourceCode: require('../../demos/Header/Custom.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
