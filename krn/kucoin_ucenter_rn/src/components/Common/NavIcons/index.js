import React from 'react';
import {Header} from '@krn/ui';
import {NavIcon, Divider, Row} from './style';
import {openNative, exitRN} from '@krn/bridge';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from '@emotion/native';
import useIconSrc from 'hooks/useIconSrc';

export const RightSlot = () => {
  const onGuide = () => {
    openNative('/help');
  };
  const onService = () => {
    openNative('/help/customerservice');
  };
  return (
    <Row>
      <TouchableWithoutFeedback onPress={onGuide}>
        <NavIcon source={useIconSrc('guide')} autoRotateDisable />
      </TouchableWithoutFeedback>
      <Divider />
      <TouchableWithoutFeedback onPress={onService}>
        <NavIcon source={useIconSrc('service')} autoRotateDisable />
      </TouchableWithoutFeedback>
    </Row>
  );
};

export const RightCloseSlot = () => {
  const onPressClose = () => {
    exitRN();
  };
  return (
    <TouchableWithoutFeedback onPress={onPressClose}>
      <NavIcon source={useIconSrc('close')} />
    </TouchableWithoutFeedback>
  );
};

const BackIcon = styled.Image`
  width: 20px;
  height: 20px;
`;
export const LeftSlot = () => {
  const navigation = useNavigation();
  const onPressBack = () => {
    navigation.canGoBack() ? navigation.goBack() : exitRN();
  };
  return (
    <TouchableWithoutFeedback onPress={onPressBack}>
      <BackIcon source={useIconSrc('back')} />
    </TouchableWithoutFeedback>
  );
};

export const Title = styled.Text`
  font-size: 18px;
  line-height: 23.4px;
  font-weight: bold;
  text-align: center;
  color: ${({theme}) => theme.colorV2.text};
`;

export const MHeader = styled(Header)`
  background-color: ${({theme, useOldBg}) =>
    useOldBg ? theme.colorV2.background : theme.colorV2.overlay};
`;

export const MHeaderMajor = styled(Header)`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
`;
