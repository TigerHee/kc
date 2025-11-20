import React, {memo} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled from '@emotion/native';

const CardWrapper = styled.View`
  padding: 16px;
  margin-bottom: 16px;
  min-height: 32px;
  background: ${({theme}) => theme.colorV2.overlay};
  border: 1px solid ${({theme}) => theme.colorV2.divider8};
  border-radius: 12px;
`;

const Card = ({style, children, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CardWrapper style={style}>{children}</CardWrapper>
    </TouchableWithoutFeedback>
  );
};

export default memo(Card);
