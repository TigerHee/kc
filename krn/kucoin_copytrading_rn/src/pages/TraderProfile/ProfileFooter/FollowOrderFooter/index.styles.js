import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';

export const BottomUserIconBox = styled(RowWrap)`
  border-radius: 16px;
  width: 32px;
  height: 32px;
  justify-content: center;
  background-color: ${({theme}) => theme.colorV2.cover4};
  margin-bottom: 2px;
`;

export const AllCopyText = styled.Text`
  color: ${({theme}) => theme.colorV2.text30};
  font-size: 12px;
  font-weight: 600;
  line-height: 15.6px;
`;

export const AlreadyCopyText = styled(AllCopyText)`
  color: ${({theme}) => theme.colorV2.text};
`;

export const AlreadyCopyDayText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin: 0 8px;
`;

export const AlreadyCopyProfitText = styled.Text`
  color: ${({theme, isUp}) =>
    isUp ? theme.colorV2.chartUpColor : theme.colorV2.chartDownColor};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const AlreadyLeftBox = styled.View`
  justify-content: flex-start;
  margin-right: 10px;
  align-items: center;
`;

export const QuestionIconImg = styled.Image`
  width: 20px;
  height: 20px;
`;
