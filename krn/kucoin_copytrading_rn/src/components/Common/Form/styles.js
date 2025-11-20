import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';
import {getEnhanceColorByType} from 'utils/color-helper';

export const FormLabelWrap = styled.View`
  ${commonStyles.flexRowCenter}
  margin-bottom: 8px;
`;

export const FormLabelText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 500;
  line-height: 18.2px;
`;

export const FormLabelRequiredText = styled(FormLabelText)`
  color: ${({theme}) => getEnhanceColorByType(theme.type, 'brandRed')};
`;

export const LabelLengthText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin-bottom: 8px;
  margin-left: 4px;
`;
