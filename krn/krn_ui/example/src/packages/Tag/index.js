/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';
import API from 'components/Tag/API';

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
      <ExampleHeader title="Tag" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/Tag/Basic.js').default,
              sourceCode: require('../../demos/Tag/Basic.doc.js').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
