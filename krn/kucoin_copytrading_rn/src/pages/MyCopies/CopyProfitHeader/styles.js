import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const CopyProfitHeaderWrap = styled.View``;

export const SecondaryFilterBarWrap = styled.View`
  ${commonStyles.flexRowCenter};
  margin: 12px 16px;
`;

export const SecondaryTabText = styled.Text`
  font-size: 12px;
  color: ${({theme, active}) =>
    !active ? theme.colorV2.text40 : theme.colorV2.text};
  font-weight: 500;
`;

export const FillHeight = styled.View`
  height: 16px;
`;
