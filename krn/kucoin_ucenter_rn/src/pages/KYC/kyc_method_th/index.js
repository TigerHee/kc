import {
  LeftSlot,
  RightCloseSlot,
  MHeaderMajor,
} from 'components/Common/NavIcons';
import useLang from 'hooks/useLang';
import {
  Body,
  Main,
  Title,
  Intro,
  ItemBox,
  ItemLogo,
  ItemTitle,
  RightArrow,
  ItemLine,
  ItemDesc,
} from './style';
import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import useIconSrc from 'hooks/useIconSrc';
import {useNavigation} from '@react-navigation/native';

export default () => {
  const {_t} = useLang();
  const navigation = useNavigation();

  const arrowRightSrc = useIconSrc('arrowRight');

  const renderItem = ({logo, title, onPress, desc, logoStyle}) => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <ItemBox>
          <ItemLine>
            <ItemLogo source={logo} autoRotateDisable style={logoStyle} />
            <ItemTitle>{title}</ItemTitle>
            <RightArrow source={arrowRightSrc} />
          </ItemLine>
          <ItemDesc>{desc}</ItemDesc>
        </ItemBox>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Body>
      <MHeaderMajor leftSlot={<LeftSlot />} rightSlot={<RightCloseSlot />} />
      <Main>
        <Title>{_t('a6eb33e256bc4000a6eb')}</Title>
        <Intro>{_t('857075a8c2db4000a38b')}</Intro>
        {/* {renderItem({
          logo: useIconSrc('thaid'),
          logoStyle: {height: 20},
          title: 'ThaID',
          desc: _t('627683ae1b544000ae20'),
          onPress: () => {
            navigation.push('KYCOnboardingPage_TH', {
              type: 'thai',
              method: 'thaid',
            });
          },
        })} */}
        {renderItem({
          logo: useIconSrc('ndid'),
          title: 'NDID',
          desc: _t('b06198c3fb194000a709'),
          onPress: () => {
            navigation.push('KYCOnboardingPage_TH', {
              type: 'thai',
              method: 'ndid',
            });
          },
        })}
      </Main>
    </Body>
  );
};
