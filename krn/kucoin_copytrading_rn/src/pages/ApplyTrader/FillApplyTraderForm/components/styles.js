import styled from '@emotion/native';

export const CurrentInfo = styled.View`
  align-items: center;
  justify-content: center;
`;

export const CurrentAvatarTextBox = styled.View`
  width: 88px;
  height: 88px;
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
  border-radius: 88px;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  border: solid ${({theme}) => theme.colorV2.cover8};
`;

export const CurrentAvatar = styled.Image`
  width: 88px;
  height: 88px;
  margin-bottom: 8px;
`;

export const CurrentAvatarBoxInnerText = styled.Text`
  font-weight: 600;
  color: ${({theme}) => theme.colorV2.text};
  font-size: 32px;
  line-height: 41.6px;
`;

export const ChangeText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  margin-right: 4px;
`;
