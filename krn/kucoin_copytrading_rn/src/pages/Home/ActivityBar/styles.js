import {View} from 'react-native';
import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';
import {convertPxToReal} from 'utils/computedPx';

export const CarouselWidth = convertPxToReal(343, false);

export const BarWrapper = styled.View`
  padding: 0 16px;
  margin-top: 16px;
`;

export const ActivityCard = styled(View)`
  ${commonStyles.flexRowCenter};
  height: ${convertPxToReal(85)};
  width: ${convertPxToReal(343)};
  background: ${({theme}) => theme.colorV2.overlay};
  border: 1px solid ${({theme}) => theme.colorV2.divider8};
  border-radius: 12px;
  justify-content: space-between;
  margin-bottom: 0;
  margin-top: ${({isLeadTrader}) => (isLeadTrader ? '24px' : '16px')};
  position: relative;
  overflow: hidden;
`;

export const ActivityRightWrap = styled.View`
  ${commonStyles.flexRowCenter}
`;

export const RightText = styled.Text`
  ${commonStyles.textStyle};
  font-weight: 500;
  font-size: 12px;
  line-height: 15.6px;
  margin-left: 4px;
`;

export const LeftIcon = styled.Image`
  width: ${convertPxToReal(40)};
  height: ${convertPxToReal(40)};
  margin-right: ${convertPxToReal(8)};
`;

export const RightIcon = styled.Image`
  width: ${convertPxToReal(16)};
  height: ${convertPxToReal(16)};
`;
