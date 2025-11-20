/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import API from 'components/Button/API';
import { ScrollView } from 'react-native';

import ExampleHeader from '../../compoents/Header';
import ParamList from '../../compoents/ParamList';
import DemoList from '../../compoents/DemoList';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Button" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Button/Basic').default,
              sourceCode: require('../../demos/Button/Basic.doc.js').default,
            },
            {
              title: '长按钮',
              Component: require('../../demos/Button/FullWidth').default,
              sourceCode: require('../../demos/Button/FullWidth.doc.js').default,
            },
            {
              title: '多尺寸',
              Component: require('../../demos/Button/MultiSize').default,
              sourceCode: require('../../demos/Button/MultiSize.doc.js').default,
            },
            {
              title: '自定义颜色',
              Component: require('../../demos/Button/MultiColor').default,
              sourceCode: require('../../demos/Button/MultiColor.doc.js').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
