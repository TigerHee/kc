import styled from '@emotion/native';

import Card from 'components/Common/Card';
import {commonStyles} from 'constants/styles';
import {convertPxToReal} from 'utils/computedPx';

export const BarWrapper = styled.View`
  margin-top: 16px;
`;

export const ActivityCard = styled(Card)`
  ${commonStyles.flexRowCenter};
  justify-content: space-between;
  background-color: ${({theme}) => theme.colorV2.primary8};
  margin-bottom: 0;
  padding: 16px 12px;
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

export const ContentTitle = styled.Text`
  ${commonStyles.textStyle};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
  width: ${convertPxToReal(242)};
`;

export const LeftIcon = styled.Image`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;

export const RightIcon = styled.Image`
  width: 16px;
  height: 16px;
`;
