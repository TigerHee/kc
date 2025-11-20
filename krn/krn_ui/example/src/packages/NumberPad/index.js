/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/NumberPad/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="NumberPad" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/NumberPad/Basic').default,
              sourceCode: require('../../demos/NumberPad/Basic.doc').default,
            },
            {
              title: '自定义键盘',
              Component: require('../../demos/NumberPad/Custom').default,
              sourceCode: require('../../demos/NumberPad/Custom.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
