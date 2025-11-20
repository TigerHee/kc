import styled, {css} from '@emotion/native';
import {fadeColor} from '@krn/ui';

import Header from 'components/Common/Header';
import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import {commonStyles, RowWrap} from 'constants/styles';
import {convertPxToReal} from 'utils/computedPx';

export const HeaderContentWrap = styled.ImageBackground`
  background-color: #121212;
  padding: 16px 16px 24px;
  margin-bottom: -16px;
`;

export const StyledHeader = styled(Header)`
  background-color: #121212;
`;

export const userInfoStyles = {
  avatar: css`
    width: 56px;
    height: 56px;
    border-radius: 56px;
  `,
  avatarText: css`
    font-size: 24px;
    line-height: 36px;
  `,
  avatarTextBox: css`
    width: 56px;
    height: 56px;
    border-radius: 56px;
  `,
};

export const UserNameText = styled.Text`
  color: #f3f3f3;
  font-size: 24px;
  font-weight: 600;
  line-height: 31.2px;
  max-width: ${convertPxToReal(240)};
`;

export const UserIntroBox = styled.View`
  margin-left: 16px;
`;

export const InfoTagText = styled.Text`
  color: ${fadeColor('#F3F3F3', '0.6')};
  font-size: 12px;
  font-weight: 600;
  line-height: 15.6px;
`;

export const InfoTagTextBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 18px;
  border-width: 1px;
  border-color: #121212;
  background: ${fadeColor('#f3f3f3', '0.08')};
  border-radius: 18px;
  margin-top: 8px;
  padding: 2px 10px;
  margin-right: 8px;
`;

export const EditInfoIc = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;

export const DescWrap = styled(RowWrap)`
  ${commonStyles.flexRowCenter}
  ${commonStyles.justifyBetween}
  margin-top: 16px;
  margin-bottom: 16px;
  min-height: 16px;
`;

export const DescText = styled.Text`
  ${commonStyles.textSecondaryStyle}
  line-height: 15.6px;
  margin-right: 16px;
`;

export const ArrowIc = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: auto;
`;

export const FollowerInfoWrap = styled(RowWrap)`
  margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colorV2.divider8};
  background: ${({theme}) => theme.colorV2.cover2};
  justify-content: space-between;
  width: 100%;
`;

export const FollowerInfoBox = styled.View`
  flex-direction: column;
  flex: 1;
  align-items: ${({isLast, isFirst}) =>
    isFirst ? 'flex-start' : isLast ? 'flex-end' : 'center'};
  /* align-items: flex-start; */
  /* background-color: red; */
`;

export const FollowerInfoLabel = styled.Text`
  ${commonStyles.textSecondaryStyle}
  line-height: 15.6px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-bottom: 2px;
`;

export const FollowerInfoValue = styled.Text`
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const TopBannerTipArea = styled.View`
  border-radius: 8px;
  padding: 12px;
  background: transparent;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 16px;
  background-color: ${({theme}) => theme.colorV2.complementary8};
`;

export const TopBannerTipText = styled.Text`
  margin-left: 8px;
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  line-height: 21px;
  flex-wrap: wrap;
  flex: 1;
`;

export const HiddenToMeasureTextHeight = styled(DescText)`
  position: absolute;
  opacity: 0;
  flex-wrap: wrap;
  flex: 1;
  width: 100%;
`;

export const IntroTagBarScroll = styled(HorizontalScrollContainer)`
  margin-left: 16px;
  max-width: ${convertPxToReal(280)};
`;

export const EmptyUserDescFillView = styled.View`
  height: 16px;
  width: 100%;
`;

export const ProfileUserWrap = styled(RowWrap)`
  min-height: 60px;
`;
