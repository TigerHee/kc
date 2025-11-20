import styled from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const Label = styled.Text`
  ${commonStyles.textSecondaryStyle}
  line-height: 15.6px;
  margin-bottom: 2px;
`;

export const PnlCard = styled.View`
  margin-bottom: 12px;
  padding: 0 16px;
`;

export const UpOrDownProfitText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  color: ${({theme, isUp, isUndef}) =>
    isUndef
      ? theme.colorV2.text
      : isUp
      ? theme.colorV2.chartUpColor
      : theme.colorV2.chartDownColor};
`;
export const StyledTabs = styled(RowWrap)`
  padding: 2px;
  border-radius: 6px;
  background: ${({theme}) => theme.colorV2.cover4};
`;

export const StyledTab = styled.View`
  padding: 0 12px;
  border-radius: 6px;
  ${({theme, isActive}) =>
    isActive && `background-color: ${theme.colorV2.overlay}`}
`;

export const StyledText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.text : theme.colorV2.text40};
`;
