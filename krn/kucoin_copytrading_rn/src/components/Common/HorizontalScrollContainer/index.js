import React from 'react';
import {ScrollView, View} from 'react-native';
import styled from '@emotion/native';

const StyledContentContainer = styled(View)(({theme}) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));

// 横向滚动容器组件
const HorizontalScrollContainer = ({
  children,
  style,
  showScrollIndicator = false,
  ...others
}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={showScrollIndicator}
      style={style}
      contentContainerStyle={{flexGrow: 1}}
      {...others}>
      <StyledContentContainer>{children}</StyledContentContainer>
    </ScrollView>
  );
};

export default HorizontalScrollContainer;
