import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const ContentWrap = styled.ImageBackground`
  width: 319px;
  height: 196px;
  padding: 56px 24px 24px;
  flex-direction: column;
  justify-content: center;
`;

export const TopImage = styled.Image`
  position: absolute;
  width: 172px;
  height: 106px;
  top: -50px;
  left: 74px;
`;

export const Title = styled.Text`
  ${commonStyles.titleStyle}
  font-size: 20px;
  line-height: 26px;
  margin-bottom: 8px;
  text-align: center;
`;

export const CloseImg = styled.Image`
  width: 34px;
  height: 34px;
`;

export const Desc = styled.Text`
  font-size: 16px;
  line-height: 20.8px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-bottom: 21px;
  text-align: center;
`;
