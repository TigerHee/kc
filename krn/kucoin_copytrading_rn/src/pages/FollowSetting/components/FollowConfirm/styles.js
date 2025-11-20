import styled, {css} from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const DescItemWrap = styled(RowWrap)`
  justify-content: space-between;
  padding-bottom: ${({isLast}) => (isLast ? '0' : '10px')};
  margin-bottom: ${({needBottomBorder}) => (!needBottomBorder ? '0' : '10px')};
  border-bottom-width: ${({needBottomBorder}) =>
    needBottomBorder ? '1px' : '0'};
  border-bottom-color: ${({theme}) => theme.colorV2.divider8};
  flex: 1;
  flex-wrap: wrap;
`;

export const DescLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
`;

export const DescValue = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const UserInfoBox = styled.View`
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const AvatarImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 48px;
`;

export const AvatarName = styled.Text`
  ${commonStyles.textStyle}
`;

export const RiskWarp = styled.View`
  margin: 16px 0;
`;

export const ConfirmContent = styled.ScrollView`
  background: ${({theme}) => theme.colorV2.layer};
`;

export const RiskTipCard = styled.View`
  border-radius: 8px;
  margin-bottom: 16px;
  background: ${({theme}) => theme.colorV2.cover4};
  padding: 12px;
`;

export const RiskTipText = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;

export const AgreementText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
`;

export const AgreementLinkText = styled(AgreementText)`
  color: ${({theme}) => theme.colorV2.primary};
  text-decoration-line: underline;
`;

export const userInfoStyles = {
  avatar: css`
    width: 48px;
    height: 48px;
    border-radius: 48px;
  `,
  avatarText: css`
    font-size: 18px;
    line-height: 27px;
  `,
  avatarTextBox: css`
    width: 48px;
    height: 48px;
    border-radius: 48px;
  `,
};
