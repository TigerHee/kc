import React, {memo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from '@emotion/native';

export const TopAreaWrapper = styled.ImageBackground`
  width: 375px;
  margin-top: ${({statusHeight}) => statusHeight + 'px'};
`;

const SafeImageBackground = ({children, style, source}) => {
  const {top} = useSafeAreaInsets() || {};

  return (
    <TopAreaWrapper statusHeight={top} source={source} style={style}>
      {children}
    </TopAreaWrapper>
  );
};

export default memo(SafeImageBackground);
