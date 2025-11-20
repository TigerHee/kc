import styled from '@emotion/native';

export const AlertWrap = styled.View`
  border-radius: 8px;
  padding: 12px;
  flex-direction: row;
  background-color: ${({theme}) => theme.colorV2.complementary8};
`;

export const AlertMsgText = styled.Text`
  margin-left: 8px;
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  line-height: 21px;
  flex-wrap: wrap;
  flex: 1;
`;
