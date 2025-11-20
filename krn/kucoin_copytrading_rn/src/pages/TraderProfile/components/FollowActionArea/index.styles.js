import styled from '@emotion/native';

export const ShareBox = styled.View`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: ${({theme}) => theme.colorV2.cover4};
`;

export const ShareImage = styled.Image`
  width: 16px;
  height: 16px;
`;

export const FollowBox = styled.View`
  padding: 7px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  margin-left: 16px;
  background-color: ${({theme, isFollowed}) =>
    !isFollowed ? theme.colorV2.text : theme.colorV2.cover8};
`;

export const FollowText = styled.Text`
  color: ${({theme, isFollowed}) =>
    !isFollowed ? theme.colorV2.textEmphasis : theme.colorV2.text};
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
`;
