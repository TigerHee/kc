import styled from '@emotion/native';

export const RevertInputWrap = styled.View`
  padding-bottom: 100px;
`;

export const InputLimit = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.5px;
`;

export const MChooseItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-width: 1px;
  border-style: solid;
  border-color: ${({theme, active}) =>
    theme.colorV2[active ? 'text' : 'cover12']};
  border-radius: 8px;
  padding: 16px 12px;
  margin-bottom: 12px;
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin-right: 10px;
`;

export const ReasonWrap = styled.View`
  margin: 24px 0 12px;
`;

export const UndoConfirmDesc = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  margin-top: 8px;
`;

export const MOrderWrap = styled.View`
  align-items: center;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colorV2.cover4};
  padding: 16px 16px 0;
  margin-top: 24px;
  margin-bottom: 16px;
`;

export const MOrderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  width: 100%;
`;

export const OrderLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`;

export const OrderRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OrderRightText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
`;
