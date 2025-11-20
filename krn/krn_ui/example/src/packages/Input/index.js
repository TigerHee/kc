/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';
import API from 'components/Input/API';

import ExampleHeader from '../../compoents/Header.js';
import ParamList from '../../compoents/ParamList.js';
import DemoList from '../../compoents/DemoList.js';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Input" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Input/Basic').default,
              sourceCode: require('../../demos/Input/Basic.doc').default,
            },
            {
              title: '不同size',
              Component: require('../../demos/Input/Size').default,
              sourceCode: require('../../demos/Input/Size.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
