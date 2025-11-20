import React from 'react';
import styled from '@emotion/native';
import {TouchableOpacity, Platform} from 'react-native';

export const BaseVerifyWrapper = styled.View`
  margin-bottom: 24px;
`;
export const VerifyBoxWrapper =
  Platform.OS === 'ios'
    ? styled.View`
        padding-bottom: ${({hidePrivacy}) => (hidePrivacy ? '24px' : 0)};
        border-radius: 12px;
        background-color: ${({theme, hidePrivacy}) =>
          hidePrivacy ? theme.colorV2.cover2 : theme.colorV2.overlay};
        align-items: center;
        shadow-color: ${({theme}) => theme.colorV2.divider8};
        shadow-opacity: 1;
        shadow-radius: 2px;
        shadow-offset: 0 0;
      `
    : styled.View`
        padding-bottom: ${({hidePrivacy}) => (hidePrivacy ? '24px' : 0)};
        border-radius: 12px;
        background-color: ${({theme, hidePrivacy}) =>
          hidePrivacy ? theme.colorV2.cover2 : theme.colorV2.overlay};
        align-items: center;
        /* elevation: 0.1; */
        overflow: hidden;
      `;
export const VerifyBoxTop = styled.View`
  align-items: center;
  padding: 24px 24px 0;
  width: 100%;
`;
export const ImageVerifying = styled.Image`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
`;
export const ImageVerified = styled.Image`
  width: 120px;
  height: 120px;
`;
export const SecurityIcon = styled.Image`
  width: 14px;
  height: 14px;
`;

export const VerifiedTag = styled.View`
  border-radius: 39px;
  background-color: ${({theme}) => theme.colorV2.primary8};
  padding: 4px 9px;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 8px;
`;
export const VerifiedTagText = styled.Text`
  font-size: 12px;
  font-style: normal;
  font-weight: normal;
  line-height: 15.6px;
  margin-left: 4px;
  color: ${({theme}) => theme.colorV2.primary};
`;
export const Title = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  margin-bottom: 8px;
`;
export const SubTitle = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  line-height: 21px;
`;
export const BtnBox = styled.View`
  margin-top: 16px;
`;
const AButton = styled.View`
  margin-top: 16px;
  border-radius: 24px;
  min-width: 166px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 0 16px;
  background: ${({theme}) =>
    theme.colorV2[theme.type === 'dark' ? 'primary' : 'cover']};
`;
export const MButton = props => {
  const {onPress, disabled} = props;
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} disabled={disabled}>
      <AButton {...props}>{props.children}</AButton>
    </TouchableOpacity>
  );
};

export const MButtonText = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
`;

export const ArrowRightIcon = styled.Image`
  height: 16px;
  width: 16px;
  margin-left: 4px;
`;

export const MessageBox = styled.View`
  flex-direction: row;
  margin-top: 8px;
  padding: 0 20px;
  border-radius: 8px;
`;
export const MessageText = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 18.2px;
  /* text-align: center; */
  color: ${({theme, textColor}) =>
    textColor.includes('#') ? textColor : theme.colorV2[textColor]};
`;
export const StrongText = styled.Text`
  font-weight: bold;
  text-decoration-line: underline;
`;
export const ImageIcon = styled.Image`
  height: 16px;
  width: 16px;
  margin-right: 4px;
  margin-top: 1px;
`;

export const RightsTable = styled.View`
  margin-top: 32px;
  margin-bottom: 32px;
`;
export const Table = styled.View``;

export const THeader = styled.View`
  border-radius: 8px;
  background-color: ${({theme}) => theme.colorV2.cover2};
  height: 32px;
  margin-top: 16px;
  margin-bottom: 16px;
  flex-direction: row;
  padding-left: 8px;
  padding-right: 8px;
  align-items: center;
`;
export const TBody = styled.View``;
export const TR = styled.View`
  flex-direction: row;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 12px;
`;
export const Cell = styled.Text`
  width: ${({cellWidth}) => cellWidth ?? '33.3%'};
  text-align: ${({align}) => align ?? 'left'};
  font-size: 12px;
  font-style: normal;
  color: ${({theme, textColor}) => theme.colorV2[textColor]};
  font-weight: ${({fw}) => fw ?? 'normal'};
  line-height: 15.6px;
`;
export const CellText = styled.Text`
  font-size: 12px;
  font-style: normal;
  color: ${({theme, textColor}) => theme.colorV2[textColor]};
  font-weight: ${({fw}) => fw ?? 'normal'};
`;
export const CellView = styled.View`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: ${({viewWidth}) => viewWidth};
  justify-content: ${({align}) => align};
  align-items: center;
`;
export const RightsTitle = styled.Text`
  font-size: 15px;
  font-style: normal;
  font-weight: bold;
  line-height: 19.5px;
  color: ${({theme}) => theme.colorV2.text};
`;
export const TagBox = styled.View`
  border-radius: 4px;
  background-color: ${({theme}) => theme.colorV2.primary4};
  padding: 0 6px;
  margin-left: 4px;
  height: 17px;
  flex-direction: row;
  align-items: center;
`;
export const TagText = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
  font-size: 10px;
  font-style: normal;
  font-weight: bold;
`;
export const CheckIcon = styled.Image`
  height: 16px;
  width: 16px;
`;

export const NavIcon = styled.Image`
  height: 20px;
  width: 20px;
`;
export const Row = styled.View`
  flex-direction: row;
`;
export const Divider = styled.Text`
  margin-left: 16px;
`;
export const VerifiedTitle = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
  line-height: 24px;
  margin: 8px 0 8px;
  text-align: center;
`;
export const M = {
  QuestionIcon: styled.Image`
    width: 120px;
    height: 120px;
  `,
  Title: styled.Text`
    color: ${({theme}) => theme.colorV2.text};
    font-size: 16px;
    font-style: normal;
    font-weight: bold;
    line-height: 20.8px;
    margin: 8px 0;
    text-align: center;
  `,
  SubTitle: styled.Text`
    color: ${({theme, textColor}) => theme.colorV2[textColor ?? 'text60']};
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 21px;
    text-align: center;
  `,
  CommunityDes: styled.Text`
    color: ${({theme, textColor}) => theme.colorV2[textColor ?? 'text60']};
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 21px;
    margin-top: 16px;
  `,
  CommunityDesLink: styled.Text`
    color: ${({theme}) => theme.colorV2.text};
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 21px;
    margin-top: 16px;
    text-decoration: underline;
  `,
  Horizatal: styled.View`
    margin-top: 32px;
    border: 0.5px solid ${({theme}) => theme.colorV2.divider4};
  `,
};

export const HighlightText = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  line-height: 21px;
`;

export const ColorText = styled.Text`
  color: ${({theme, textColor}) => theme.colorV2[textColor]};
  font-weight: bold;
`;

export const KybLinkBtn = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 21px;
  text-decoration-line: underline;
`;

export const PrivacyWrapper = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 16px 24px;
  margin-top: 16px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${({theme}) => theme.colorV2.divider8};
`;
export const PrivacyImg = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
`;
export const PrivacyText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0px;
  word-wrap: break-word;
  color: ${({theme}) => theme.colorV2.text40};
`;

export const FailReasonText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0px;
  color: ${({theme}) => theme.colorV2.text60};
`;

export const FailReasonScrollView = styled.ScrollView`
  margin: 12px 16px;
`;

export const DrawerContent = styled.View`
  padding: 20px 16px 12px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  flex-direction: column;
  align-items: center;
`;
export const CloseBox = styled.View`
  width: 100%;
  flex-direction: row-reverse;
`;
export const CloseIcon = styled.Image`
  height: 24px;
  width: 24px;
`;
export const UserTypeIcon = styled.Image`
  height: 148px;
  width: 148px;
`;
export const VerifyTipText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  color: ${({theme}) => theme.colorV2.text60};
`;
export const VerifyTipFooter = styled.View`
  margin-top: 24px;
  flex-direction: row;
  gap: 8px;
`;
