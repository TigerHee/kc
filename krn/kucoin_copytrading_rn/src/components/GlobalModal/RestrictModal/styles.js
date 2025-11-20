import styled from '@emotion/native';
import {Button} from '@krn/ui';

export const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const Content = styled.View`
  background-color: ${({theme}) => theme.colorV2.layer};
  border-radius: 20px;
  flex: 1;
  margin: 0 16px;
  padding: 40px 24px 32px;
  align-items: center;
  flex: 1;
`;
export const Title = styled.Text`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 12px;
  color: ${({theme}) => theme.colorV2.text};
  line-height: 26px;
`;

export const DescScroller = styled.ScrollView`
  margin-bottom: 24px;
`;

export const Desc = styled.Text`
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: ${({theme}) => theme.colorV2.text60};
  text-align: center;
`;

export const CenterImg = styled.Image`
  width: 148px;
  height: 148px;
  margin-left: auto;
  margin-right: auto;
`;

export const ImageWrapper = styled.View`
  width: 136px;
  height: 136px;
`;
export const ButtonBox = styled.View`
  flex-direction: row;
`;
export const ExButton = styled(Button)`
  flex: 1;
`;

export const CancelButton = styled(ExButton)`
  margin-right: ${({gap}) => (gap ? '12px' : 0)};
`;
export const ConfirmButton = styled(ExButton)``;
