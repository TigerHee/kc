/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Slider/API';
import { ScrollView } from 'react-native';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Slider" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Slider/Basic').default,
              sourceCode: require('../../demos/Slider/Basic.doc').default,
            },
            {
              title: '自定义样式',
              Component: require('../../demos/Slider/CustomStyle').default,
              sourceCode: require('../../demos/Slider/CustomStyle.doc').default,
            },
            {
              title: '自定义范围',
              Component: require('../../demos/Slider/CustomRange').default,
              sourceCode: require('../../demos/Slider/CustomRange.doc').default,
            },
            {
              title: '两边滑动',
              Component: require('../../demos/Slider/BothSlide').default,
              sourceCode: require('../../demos/Slider/BothSlide.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
