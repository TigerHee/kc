import styled from '@emotion/native';

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

export const LegendScroll = styled.ScrollView`
  height: 140px;
  flex: 1;
  margin-right: 16px;
`;

export const LegendBox = styled.View`
  padding: 8px 0;
  width: 120px;
  margin-left: auto;
  min-height: 120px;
  justify-content: flex-start;
`;

export const LegendSymbol = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 0.8px;
  margin-right: 10px;
  background-color: ${({color}) => color};
`;

export const LegendCoinText = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colorV2.text};
  line-height: 15.6px;
  width: 60px;
`;

export const LegendRate = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colorV2.text60};
  line-height: 15.6px;
`;
