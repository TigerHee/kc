/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';
import API from 'components/Alert/API';

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
      <ExampleHeader title="Alert" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Alert/Basic.js').default,
              sourceCode: require('../../demos/Alert/Basic.doc.js').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
