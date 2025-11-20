import {ScrollView} from 'react-native';
import styled from '@emotion/native';

import Card from 'components/Common/Card';
import {BetweenWrap, commonStyles} from 'constants/styles';

export const FilterBarWrap = styled.View`
  ${commonStyles.flexRowCenter};
  background: ${({theme}) => theme.colorV2.overlay};
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  height: 32px;
  padding-left: 16px;
  margin-top: 16px;
`;

export const ConditionLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin-bottom: 8px;
`;

export const PopupTitle = styled.Text`
  font-weight: 600;
  padding-top: 0px;
  font-size: 18px;
  color: ${({theme}) => theme.colorV2.text};
  margin-right: 24px;
`;

export const FilterScrollWrap = styled(ScrollView)`
  background-color: ${({theme}) => theme.colorV2.layer};
`;

export const ConditionText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-bottom: 8px;
`;

export const SlideCard = styled(Card)`
  margin-bottom: 0;
  margin-top: 0;
  margin-bottom: 24px;
  background: ${({theme}) => theme.colorV2.layer};
`;

export const SlideTopLabel = styled.Text`
  ${commonStyles.textSecondaryStyle}
  font-size: 14px;
  line-height: 18.2px;
  font-weight: 400;
`;

export const RadioText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin-left: 4px;
`;

export const RightPressable = styled.Pressable`
  flex-direction: row;
  flex: 1;
`;

export const FilterTitleWrap = styled(BetweenWrap)`
  background: ${({theme}) => theme.colorV2.layer};
  width: 100%;
`;
