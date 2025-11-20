import styled from '@emotion/native';

import {SafeAreaView} from 'components/Common/SafeAreaView';
import {commonStyles} from 'constants/styles';

export const IntroTitleCard = styled.View`
  padding: 0 16px 16px;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 8px;
`;

export const Title = styled.Text`
  ${commonStyles.titleStyle}
  font-size: 24px;
  line-height: 31.2px;
  margin-bottom: 8px;
  margin-top: 24.6px;
  text-align: center;
`;

export const SubTitle = styled.Text`
  ${commonStyles.titleStyle}
  text-align: center;
`;

export const GreenSubTitle = styled(SubTitle)`
  ${commonStyles.titleStyle}
  color: ${({theme}) => theme.colorV2.primary};
  text-align: center;
`;

export const BottomBtnArea = styled.View`
  padding: 16px 16px;
`;

export const BannerImg = styled.Image`
  width: 243px;
  height: 143.3px;
  margin-top: 8px;
`;
export const ApplyTraderWrap = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.colorV2.overlay};
  flex: 1;
`;
