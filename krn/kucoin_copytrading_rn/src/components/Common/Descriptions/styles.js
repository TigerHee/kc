import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const RowWrap = styled.View`
  ${commonStyles.flexRowCenter};
  ${commonStyles.justifyBetween};
  margin-bottom: 10px;
`;

export const LabelWrap = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const Label = styled.Text`
  ${commonStyles.textSecondaryStyle};
`;

export const ValueText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  flex: 1;
  text-align: right;
`;
