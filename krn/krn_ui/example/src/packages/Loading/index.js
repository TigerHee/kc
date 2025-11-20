/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Loading/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Loading" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '不同尺寸',
              Component: require('../../demos/Loading/MultiSize').default,
              sourceCode: require('../../demos/Loading/MultiSize.doc').default,
            },
            {
              title: '包裹元素',
              Component: require('../../demos/Loading/WrapElement').default,
              sourceCode: require('../../demos/Loading/WrapElement.doc').default,
            },
            {
              title: '自定义颜色',
              Component: require('../../demos/Loading/MultiColor').default,
              sourceCode: require('../../demos/Loading/MultiColor.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
