/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';
import API from 'components/DateTimeFormat/API';
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
      <ExampleHeader title="DateTimeFormat" />
      <ScrollView>
        <ParamList list={API} />
        <DemoList
          list={[
            {
              title: '基础用法',
              Component: require('../../demos/DateTimeFormat').default,
              sourceCode: require('../../demos/DateTimeFormat/index.doc').default,
            },
          ]}
        />
      </ScrollView>
    </Wrapper>
  );
};
