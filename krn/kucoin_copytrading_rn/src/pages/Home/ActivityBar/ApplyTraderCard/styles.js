import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';
import {getEnhanceColorByType} from 'utils/color-helper';

export const ApplyTraderBannerWrap = styled.View`
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({theme}) => getEnhanceColorByType(theme.type, 'lineGreen4')};
  border-bottom-width: 0.5px;
  border-color: ${({theme}) => getEnhanceColorByType(theme.type, 'lineGreen8')};
  flex-direction: row;
  align-items: center;
`;

export const ContentText = styled.Text`
  font-size: 11px;
  font-weight: 400;
  line-height: 14.3px;
  margin-top: 2px;
  color: ${({theme}) => theme.colorV2.text40};
`;

export const ContentTitle = styled.Text`
  ${commonStyles.textStyle};
  font-size: 13px;
  font-weight: 500;
  line-height: 15.6px;
`;
