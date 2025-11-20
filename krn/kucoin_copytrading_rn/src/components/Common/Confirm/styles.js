import styled from '@emotion/native';

export const PopupTitle = styled.Text`
  font-weight: 600;
  padding-top: 0px;
  font-size: 18px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const ButtonAreaWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
`;

export const ModalTitle = styled.Text`
  font-weight: 600;
  padding-bottom: 12px;
  line-height: 26px;
  font-size: 20px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const ModalMessageText = styled.Text`
  font-weight: 400;
  line-height: 24px;
  font-size: 16px;
  color: ${({theme}) => theme.colorV2.text60};
`;

export const ConfirmModalWrap = styled.View`
  width: 85%;
  padding: 32px 24px;
  background: ${({theme}) => theme.colorV2.backgroundMajor};
  border-radius: 16px;
  flex-direction: column;
`;
