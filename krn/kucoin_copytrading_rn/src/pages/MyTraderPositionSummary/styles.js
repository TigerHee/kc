import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';

export const TraderPositionSummaryPage = styled.View`
  flex: 1;
  padding: 0 16px;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
`;

export const TargetUserName = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 18px;
  font-weight: 600;
  line-height: 23.4px;
  max-width: 200px;
`;

export const TargetUserAvatar = styled.Image`
  border-radius: 24px;
  width: 24px;
  height: 24px;
`;

export const HeaderTitleWrap = styled(RowWrap)`
  flex: 1;
  justify-content: center;
`;
