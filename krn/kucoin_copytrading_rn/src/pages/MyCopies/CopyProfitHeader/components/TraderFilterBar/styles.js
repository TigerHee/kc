import styled, {css} from '@emotion/native';

export const userInfoStyles = {
  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 32px;
  `,
  avatarText: css`
    font-size: 13px;
    line-height: 19.5px;
  `,
  avatarTextBox: css`
    width: 32px;
    height: 32px;
    border-radius: 32px;
  `,
};

export const PickLeaderAllText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 500;
  line-height: 20.8px;
  margin-left: 8px;
`;
