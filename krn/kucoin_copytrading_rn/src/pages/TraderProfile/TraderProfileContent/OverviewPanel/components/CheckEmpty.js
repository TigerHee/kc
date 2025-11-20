import React from 'react';
import {View} from 'react-native';
import styled from '@emotion/native';
import {Empty, Loading} from '@krn/ui';

import useLang from 'hooks/useLang';

const LoadingWrap = styled.View`
  justify-content: center;
  align-items: center;
  height: 170px;
`;

export default ({children, isEmpty, isLoading}) => {
  const {_t} = useLang();

  if (isLoading) {
    return (
      <LoadingWrap>
        <Loading spin />
      </LoadingWrap>
    );
  }
  if (isEmpty && !isLoading) {
    return (
      <View style={{minHeight: 162}}>
        <Empty
          style={{marginTop: 16, marginBottom: 16, minHeight: 130}}
          text={_t('4597a0f251644000a761')}
        />
      </View>
    );
  }
  return children;
};
