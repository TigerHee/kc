import styled from '@emotion/native';

export const MigrateWrapper = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colorV2.complementary12};
`;
export const InfoIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-top: 2px;
`;
export const CloseIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-top: 2px;
`;
export const MigrateContent = styled.View`
  flex: 1;
  margin: 0 8px;
`;
export const MigrateText = styled.Text`
  word-wrap: break-word;
  margin-bottom: 8px;
`;
