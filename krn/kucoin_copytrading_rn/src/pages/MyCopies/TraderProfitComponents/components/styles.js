import styled from '@emotion/native';

import {getEnhanceColorByType} from 'utils/color-helper';
import {convertPxToReal} from 'utils/computedPx';

export const FailHeaderCard = styled.View`
  padding: 12px;
  background-color: ${({theme}) =>
    getEnhanceColorByType(theme.type, 'brandRed8')};
  margin-top: 16px;
  border-radius: 8px;
`;

export const FailText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;
export const CancelCopyText = styled.Text`
  color: ${({theme}) => getEnhanceColorByType(theme.type, 'brandRed')};
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
  margin-top: 4px;
`;

export const CancelText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
  margin-left: 4px;
  max-width: ${convertPxToReal(160)};
`;

export const TraderCardWaitIc = styled.Image`
  width: 16px;
  height: 16px;
`;
