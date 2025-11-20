import styled, {css} from '@emotion/native';

import Card from 'components/Common/Card';
import NumberFormat from 'components/Common/NumberFormat';
import {Percent} from 'components/Common/UpOrDownNumber';
import {commonStyles, RowWrap} from 'constants/styles';

export const userInfoStyles = {
  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 32px;
  `,
  avatarText: css`
    font-size: 13px;
    line-height: 19.5px;
  `,
  avatarTextBox: css`
    width: 32px;
    height: 32px;
    border-radius: 32px;
    margin-top: 3px;
  `,
};

export const TraderInfoCardWrap = styled(Card)`
  margin-bottom: 0;
  ${({homeNewUI, theme}) =>
    !homeNewUI
      ? ''
      : `
      padding: 16px;
      background: ${theme.colorV2.overlay};
      border: 0px;
    `}
`;

export const AvatarImg = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 32px;
`;

export const TraderNameAndUsersWrap = styled.View`
  margin-left: 8px;
  flex: 1;
`;

export const TraderName = styled.Text`
  ${commonStyles.textStyle};
  font-size: 14px;
  line-height: 18.2px;
  margin-bottom: 2px;
`;

export const ExistPersonText = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 400;
  line-height: 15.6px;
`;

export const TraderInfoUserIconWrap = styled.View`
  margin-right: 4px;
`;

export const AllPersonText = styled(ExistPersonText)`
  color: ${({theme}) => theme.colorV2.text40};
`;

export const styles = {
  copyBtn: css`
    justify-content: flex-end;
  `,
};

export const DescText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  max-width: 96%;
`;

export const PnLPercentNumberFormat = styled(Percent)`
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
  margin-top: 2px;
`;

export const PnLNumberFormat = styled(NumberFormat)`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  margin-top: 2px;
`;

export const PnlNumberUnitText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  margin-top: 2px;
`;

export const TraderDescAndProfitWrap = styled.View`
  height: 62px;
  flex-direction: column;
  justify-content: space-between;
`;

export const FirstLineWrapper = styled.View`
  ${commonStyles.flexRowCenter};
  border-bottom-width: 1px;
  ${({homeNewUI, theme}) => `
  padding-bottom: ${homeNewUI ? '16px' : '12px'};
  margin-bottom: ${homeNewUI ? '16px' : '12px'};
  border-bottom-color: ${theme.colorV2.divider4};
  `};
`;

export const FollowerProfitAndAssetSizeWrapper = styled(RowWrap)`
  justify-content: space-between;
  padding-top: ${({homeNewUI}) => (homeNewUI ? '16px' : '12px')};
  margin-top: ${({homeNewUI}) => (homeNewUI ? '16px' : '12px')};
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.colorV2.divider4};
`;

export const FollowerAndProfitNumberFormat = styled.Text`
  color: ${({homeNewUI, theme}) =>
    homeNewUI ? theme.colorV2.text : theme.colorV2.text60};
  font-size: 12px;
  line-height: 15.6px;
  font-weight: 400;
  margin-left: 4px;
`;

export const FitText = styled.Text`
  max-width: 150px;
`;

export const GapLine = styled.View`
  width: 1px;
  height: 12px;
  margin: 0 8px;
  background: ${({theme}) => theme.colorV2.divider8};
`;

export const TimeIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin-right: 4px;
`;

export const TraderIntroRowWrap = styled(RowWrap)`
  flex: 1;
  flex-wrap: wrap;
  margin-top: ${({homeNewUI}) => (homeNewUI ? '4px' : '2px')};
  flex-shrink: 0;
`;
