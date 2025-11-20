import styled, {css} from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const CardWarp = styled(RowWrap)`
  padding: 10px 0;
`;

export const NoColumnWrap = styled.View`
  width: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const NoText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text30};
`;

export const Text = styled.Text`
  ${commonStyles.textStyle};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const SecondaryText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  line-height: 15.6px;
`;

export const TimeIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin-right: 4px;
`;

export const Avatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  margin-right: 8px;
`;

export const AmountWrap = styled.View`
  margin-left: auto;
  align-items: flex-end;
`;

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
