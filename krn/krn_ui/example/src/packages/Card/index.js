/**
 * Owner: willen@kupotech.com
 */

import React from 'react';
import ExampleHeader from '../../compoents/Header';
import styled from '@emotion/native';
import ParamList from '../../compoents/ParamList';
import API from 'components/Card/API';
import { ScrollView } from 'react-native';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

export default () => {
  return (
    <Wrapper>
      <ExampleHeader title="Card" />
      <ScrollView>
        <ParamList list={API} />
      </ScrollView>
    </Wrapper>
  );
};
