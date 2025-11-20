import styled from '@emotion/native';

export const ProfileFooterArea = styled.View`
  padding: 16px 16px 28px; // 底部安全区域 12 + 16px
  background: ${({theme}) => theme.colorV2.overlay};
  border-color: ${({theme}) => theme.colorV2.divider4};
  border-style: solid;
  border-top-width: ${({showBorder}) => (showBorder ? '1px' : '0')};
`;

export const MOrderWrap = styled.View`
  align-items: center;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colorV2.cover4};
  padding: 16px 16px 0;
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
  line-height: 21px;
  margin-right: 12px;
`;

export const PopContent = styled.View`
  padding: 20px 16px;
`;

export const SuccessIcon = styled.Image`
  width: 148px;
  height: 148px;
  margin-left: auto;
  margin-right: auto;
`;

export const SuccessText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  margin-bottom: 4px;
`;

export const SuccessDesc = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 24px;
  text-align: center;
`;
