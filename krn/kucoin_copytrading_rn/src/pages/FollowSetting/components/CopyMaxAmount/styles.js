import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';

export const CopyMaxAmountReadText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;

  color: ${({theme}) => theme.colorV2.text};
`;

export const CopyMaxAmountReadLabelWrap = styled(RowWrap)`
  margin-bottom: 12px;
`;

export const PnlInfoWrap = styled.View`
  border-radius: 8px;
  background: ${({theme}) => theme.colorV2.primary8};
  padding: 12px;
  margin-top: 12px;
`;

export const PnlInfoText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`;
export const RightRow = styled(RowWrap)`
  justify-content: flex-end;
`;

export const ExtraAmountText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

export const ConvertIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;
