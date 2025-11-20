import styled from '@emotion/native';

import {commonStyles} from './commonStyles';

export const RowWrap = styled.View`
  ${commonStyles.flexRowCenter};
`;

export const SecondaryStyleText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  line-height: 15.6px;
`;

export const BetweenWrap = styled.View`
  ${commonStyles.flexRowCenter}
  ${commonStyles.justifyBetween}
`;
