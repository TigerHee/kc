import styled from '@emotion/native';
import {Button} from '@krn/ui';

import {Number, Percent} from 'components/Common/UpOrDownNumber';
import {commonStyles} from 'constants/styles';

export const RowWrap = styled.View`
  ${commonStyles.flexRowCenter};
  align-items: flex-end;
`;

export const Circle = styled.Pressable`
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
  padding: 16px 0;
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

export const TodayPnlValue = styled(Number)`
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
`;

export const PnlValueRowWrap = styled(RowWrap)`
  justify-content: space-between;
  width: 100%;
`;

export const PnlRowWrap = styled(PnlValueRowWrap)`
  margin-bottom: 4px;
`;

export const HistoryCopyBtn = styled(Button)`
  font-size: 12px;
  font-weight: 600;
  line-height: 15.6px;
  align-items: center;
  justify-content: center;
  /* padding: 7px 16px; */
`;
export const StyledText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-right: 4px;
`;
