import styled from '@emotion/native';

export const Wrapper = styled.View`
  padding-top: 20px;
`;
export const StepItem = styled.View``;
export const StepItemHeader = styled.View`
  align-items: center;
  flex-direction: row;
`;
export const StepIconBox = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background-color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.cover : theme.colorV2.text20};
`;
export const StepIcon = styled.Image`
  width: 16px;
  height: 16px;
`;
export const StepIconText = styled.Text`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.textEmphasis};
`;
export const StepItemHeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  /* flex-wrap: wrap; */
  flex: 1;
  max-width: 100%;
`;
export const StepItemHeaderTitle = styled.Text`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20.8px;
  margin-right: 4px;
  flex-shrink: 1;
  color: ${({theme}) => theme.colorV2.text};
`;
export const VerifiedTag = styled.View`
  border-radius: 4px;
  padding: 2px 4px;
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colorV2.primary4};
`;
export const SecurityIcon = styled.Image`
  width: 14px;
  height: 14px;
`;
export const VerifiedTagText = styled.Text`
  font-size: 12px;
  font-style: normal;
  line-height: 15.6px;
  margin-left: 2px;
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.primary};
`;
export const StepItemContentBox = styled.View`
  flex-direction: row;
  margin-left: 10px;
  margin-bottom: 6px;
  margin-top: 6px;
`;
export const Line = styled.View`
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.cover16};
  border-style: dashed;
  height: 100%;
  width: 0;
`;
export const StepItemContent = styled.View`
  padding-bottom: 18px;
  padding-left: 18px;
  flex: 1;
`;
export const StepTitle = styled.Text``;
export const StepDesc = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text60};
`;
export const PIFlowWrapper = styled.View`
  width: 100%;
  border-radius: 16px;
  padding: 16px;
  padding-bottom: 24px;
  margin-top: 12px;
  margin-top: ${({isLittleMt}) => (isLittleMt ? '6px' : '12px')};
  background-color: ${({theme}) => theme.colorV2.cover2};
`;
export const PIFlowTitle = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 21px;
  color: ${({theme}) => theme.colorV2.text};
`;
export const PIFlowDesc = styled.Text`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16.9px;
  margin-bottom: 12px;
  color: ${({theme}) => theme.colorV2.text40};
`;
export const ButtonBox = styled.View`
  width: 100%;
  margin-top: 20px;
`;
export const ErrorButtonBox = styled.View`
  width: 100%;
  margin-top: 16px;
`;
