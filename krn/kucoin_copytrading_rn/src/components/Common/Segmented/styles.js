import {Animated} from 'react-native';
import styled from '@emotion/native';

export const SegmentedContainer = styled.View`
  padding: 2px;
  height: 24px;
  border-radius: 6px;
  flex-direction: row;
  display: flex;
`;

export const SegmentedItem = styled.TouchableWithoutFeedback`
  border-radius: 6px;
`;

export const SegmentedText = styled.Text`
  color: ${({theme, selected}) =>
    selected ? theme.colorV2.text : theme.colorV2.text40};
  font-size: 12px;
  padding: 2px 12px;
  text-align: center;
`;

export const ActiveSegmentedBlock = styled(Animated.View)`
  height: 24px;
  width: 100px;
  background-color: ${({theme}) => theme.colorV2.cover4};
  border-radius: 4px;
  position: absolute;
  bottom: 0px;
  z-index: -1;
`;
