import styled from '@emotion/native';

import NumberFormat from 'components/Common/NumberFormat';
import Percent from 'components/Common/Percent';
import {commonStyles, RowWrap} from 'constants/styles';

export const Label = styled.Text`
  ${commonStyles.textSecondaryStyle}
  line-height: 15.6px;
  margin-bottom: 2px;
`;

export const PnlCard = styled.View`
  margin-bottom: 12px;
`;

export const UpOrDownProfitText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  color: ${({theme, isUp}) =>
    isUp ? theme.colorV2.chartUpColor : theme.colorV2.chartDownColor};
`;

export const TinyProfitText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
  margin-left: 2px;
  color: ${({theme, isUp}) =>
    isUp ? theme.colorV2.chartUpColor : theme.colorV2.chartDownColor};
`;

export const PnlValueWrap = styled(RowWrap)`
  align-items: flex-end;
`;

export const RightTextNumberFormat = styled(NumberFormat)`
  text-align: right;
  font-weight: 500;
`;

export const RightTextPercent = styled(Percent)`
  text-align: right;
  font-weight: 500;
`;
