import styled from '@emotion/native';

import Button from 'components/Common/Button';
import Header from 'components/Common/Header';
import {commonStyles} from 'constants/styles';

export const Container = styled.SafeAreaView`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  flex: 1;
`;

export const StyledHeader = styled(Header)``;

export const Content = styled.View`
  padding-top: 48px;
  align-items: center;
`;

export const SuccessIcon = styled.Image`
  width: 148px;
  height: 148px;
`;

export const SuccessText = styled.Text`
  ${commonStyles.textStyle}
  font-size: 20px;
  line-height: 31.2px;
  margin-top: 12px;
  margin-bottom: 4px;
  padding: 0 24px;
  text-align: center;
`;

export const SuccessDesc = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colorV2.text60};
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  padding: 0 24px;
`;

export const FixedBottomArea = styled.View`
  width: 100%;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  position: absolute;
  bottom: 16px;
  padding: 16px;
  align-items: center;
`;

export const StyledSubmitBtn = styled(Button)`
  width: 100%;
`;

export const CancelText = styled.Text`
  ${commonStyles.textStyle}
  padding: 13.5px;
  font-size: 16px;
  line-height: 20.8px;
  margin-top: 16px;
`;
