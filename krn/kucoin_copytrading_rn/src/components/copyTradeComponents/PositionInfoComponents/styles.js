import styled, {css} from '@emotion/native';

import {Number, Percent} from 'components/Common/UpOrDownNumber';
import {commonStyles} from 'constants/styles';
import {convertPxToReal} from 'utils/computedPx';

export const RowWrap = styled.View`
  ${commonStyles.flexRowCenter};
`;

export const TitleWrap = styled(RowWrap)`
  ${commonStyles.flexRowCenter};
  justify-content: space-between;
`;

export const Circle = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background: ${({theme}) => theme.colorV2.cover4};
  align-items: center;
  justify-content: center;
`;

export const ActionIcon = styled.Image`
  width: 16px;
  height: 16px;
`;

export const PnlLabel = styled.Text`
  ${commonStyles.textSecondaryStyle};
`;

export const TotalPnlWrap = styled.View`
  align-items: flex-end;
`;

export const PnlInfoWrap = styled.View`
  align-items: flex-start;
  padding-bottom: 16px;
`;

export const TotalPnlValue = styled(Number)`
  font-size: 16px;
  font-weight: 700;
  line-height: 20.8px;
`;

export const TotalMinPnlPercent = styled(Percent)`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

export const PnlValueRowWrap = styled(RowWrap)`
  justify-content: space-between;
  width: 100%;
  flex: 1;
`;

export const PnlRowWrap = styled(PnlValueRowWrap)`
  margin-bottom: 4px;
`;

export const Title = styled.Text`
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const TagUserInfoWrap = styled(RowWrap)`
  border-radius: 20px;
  border: 1px solid ${({theme}) => theme.colorV2.divider4};
  align-self: flex-start;
  padding: 6px 8px;
  margin: ${convertPxToReal(12)} 0;
  max-width: ${convertPxToReal(320)};
`;

export const AvatarImg = styled.Image`
  width: 16px;
  height: 16px;
  border-radius: 16px;
`;

export const TagText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const TagChartColorText = styled(TagText)`
  color: ${({theme, isLong}) =>
    isLong ? theme.colorV2.chartUpColor : theme.colorV2.chartDownColor};
`;

export const TagGap = styled.View`
  background-color: ${({theme}) => theme.colorV2.divider8};
  width: 1px;
  height: 15px;
  margin: 0 6px;
`;

export const StyledText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const userInfoStyles = {
  avatar: css`
    width: 16px;
    height: 16px;
    border-radius: 16px;
  `,
  avatarText: css`
    font-size: 8px;
    line-height: 12px;
  `,
  avatarTextBox: css`
    width: 16px;
    height: 16px;
    border-radius: 16px;
  `,
};
