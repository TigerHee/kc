import styled from '@emotion/native';

export const HeaderWrapper = styled.SafeAreaView`
  background: ${({theme}) => theme.colorV2.backgroundMajor};
`;

export const InnerHeaderBar = styled.View`
  flex-direction: row;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  height: 44px;
`;

export const Left = styled.View`
  min-width: 60px;
`;

export const Center = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: ${({theme}) => theme.colorV2.text};
  line-height: 23.4px;
`;

export const Right = styled.View`
  min-width: 60px;
  flex-direction: row;
  justify-content: flex-end;
`;

export const LeftArrowIcon = styled.Image`
  width: 20px;
  height: 20px;
`;
