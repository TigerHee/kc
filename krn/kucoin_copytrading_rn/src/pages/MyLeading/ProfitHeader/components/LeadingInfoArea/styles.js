import styled, {css} from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const userInfoBarStyles = {
  card: css`
    margin-bottom: 16px;
    min-height: 32px;
  `,
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

export const NameText = styled.Text`
  ${commonStyles.textStyle}
  margin-left: 8px;
  margin-right: 4px;
`;

export const ArrowImage = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;
