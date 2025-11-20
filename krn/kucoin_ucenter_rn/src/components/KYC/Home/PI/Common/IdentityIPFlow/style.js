import styled from '@emotion/native';

export const Wrapper = styled.View``;
export const Item = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({isLast}) => (isLast ? '0' : '12px')};
`;
export const Icon = styled.Image`
  height: 16px;
  width: 16px;
  margin-right: 4px;
`;
export const LabelText = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
`;
