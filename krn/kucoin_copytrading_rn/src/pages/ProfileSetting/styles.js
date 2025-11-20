/**
 * Owner: mike@kupotech.com
 */
import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const Box = styled.ScrollView`
  padding: 16px 16px 0;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 31.2px;
  margin-bottom: 16px;
`;

export const Desc = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;

export const AvatarContent = styled.View`
  flex: 1;
  padding-bottom: 40px;
`;

export const AvatarBox = styled.Pressable`
  width: 64px;
  height: 64px;
  border-radius: 64px;
  border: ${({isActive, theme}) =>
    isActive
      ? `2px solid ${theme.colorV2.text}`
      : `2px solid ${theme.colorV2.backgroundMajor}`};
`;

export const AvatarIcon = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  ${({isActive, theme}) => {
    if (isActive) {
      return `border: 2px solid ${theme.colorV2.background}`;
    }
  }}
`;

export const AvatarTextBox = styled.View`
  ${commonStyles.flexRowCenter};
  width: 60px;
  height: 60px;
  justify-content: center;
  border-radius: 60px;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  border: solid ${({theme}) => theme.colorV2.cover8};
`;

export const AvatarTextBoxInnerText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 28px;
  font-weight: 600;
  line-height: 36.4px;
`;

export const CurrentInfo = styled.View`
  margin: 32px 0;
  align-items: center;
  justify-content: center;
`;

export const CurrentAvatarTextBox = styled.View`
  width: 88px;
  height: 88px;
  justify-content: center;
  align-items: center;
  border-radius: 88px;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  border: solid ${({theme}) => theme.colorV2.cover8};
`;

export const CurrentAvatar = styled.Image`
  width: 88px;
  height: 88px;
`;

export const CurrentAvatarBoxInnerText = styled(AvatarTextBoxInnerText)`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 32px;
  line-height: 41.6px;
`;

export const ErrorMessage = styled.Text`
  color: ${({theme}) => theme.colorV2.secondary};
  font-size: 12px;
  margin-top: 8px;
`;

export const AvatarRowWarp = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin-top: 24px;
`;

export const CurrentOuterName = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 20px;
  line-height: 26px;
  padding-top: 8px;
`;

export const ProfileSettingFooterArea = styled.View`
  padding: 16px;
  background: ${({theme}) => theme.colorV2.overlay};
`;
