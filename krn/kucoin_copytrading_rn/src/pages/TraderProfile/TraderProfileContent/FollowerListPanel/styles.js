import styled from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const Title = styled.Text`
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
  margin-bottom: 14px;
`;

export const BarWrap = styled(RowWrap)`
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const BarText = styled.Text`
  ${commonStyles.textSecondaryStyle};
`;
