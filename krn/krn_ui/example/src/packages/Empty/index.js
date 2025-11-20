/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Empty/API';
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
              Component: require('../../demos/Empty/Basic').default,
              sourceCode: require('../../demos/Empty/Basic.doc').default,
            },
            {
              title: '自定义',
              Component: require('../../demos/Empty/Custom').default,
              sourceCode: require('../../demos/Empty/Custom.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
