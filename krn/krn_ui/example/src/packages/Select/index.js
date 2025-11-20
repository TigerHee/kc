/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';
import API from 'components/Select/API';

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
      <ExampleHeader title="Select" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '竖向用法',
              Component: require('../../demos/Select/Basic.js').default,
              sourceCode: require('../../demos/Select/Basic.doc.js').default,
            },
            {
              title: '横向用法',
              Component: require('../../demos/Select/Row.js').default,
              sourceCode: require('../../demos/Select/Row.doc.js').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
