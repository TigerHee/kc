import styled from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const ExtraItemWrap = styled.View`
  ${commonStyles.flexRowCenter}
  ${commonStyles.justifyBetween}
  margin-top: 8px;
`;

export const LabelWrap = styled(RowWrap)`
  margin-bottom: 8px;
`;

export const LabelText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-right: 4px;
`;

export const TipIcon = styled.Image`
  width: 16px;
  height: 16px;
`;
