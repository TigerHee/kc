import styled from '@emotion/native';

import {getEnhanceColorByType} from 'utils/color-helper';

export const TPSLFormFieldWrap = styled.View`
  margin-bottom: 20px;
`;

export const InputPrefixText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  margin-right: 4px;
`;

export const InputSuffixText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin-left: 4px;
`;

export const InputTipText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  margin-top: 8px;
`;

export const ErrorTipText = styled(InputTipText)`
  color: ${({theme}) => getEnhanceColorByType(theme.type, 'brandRed')};
`;
