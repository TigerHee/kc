import React, {useMemo} from 'react';
import {useTheme} from '@krn/ui';
import useLang from 'hooks/useLang';
import {Wrapper, Item, Icon, LabelText} from './style';

const iconsConfig = {
  light: {
    personal: require('assets/light/pi/personal.png'),
    photo: require('assets/light/pi/photo.png'),
    facial: require('assets/light/pi/facial.png'),
    business: require('assets/light/pi/business.png'),
    upload: require('assets/light/pi/upload.png'),
  },
  dark: {
    personal: require('assets/dark/pi/personal.png'),
    photo: require('assets/dark/pi/photo.png'),
    facial: require('assets/dark/pi/facial.png'),
    business: require('assets/dark/pi/business.png'),
    upload: require('assets/dark/pi/upload.png'),
  },
};

export default ({type = 'KYC'}) => {
  const {_t} = useLang();
  const theme = useTheme();

  const list = useMemo(() => {
    if (type === 'PI') {
      return [
        {
          label: _t('a279676c69734000a122'),
          icon: 'business',
        },
        {
          label: _t('edb8be65563e4000a96a'),
          icon: 'upload',
        },
      ];
    }

    return [
      {
        label: _t('fbb55413cc554000a732'),
        icon: 'personal',
      },
      {
        label: _t('b4bdbb8aee704000a025'),
        icon: 'photo',
      },
      {
        label: _t('7fbf82fc557a4000a01e'),
        icon: 'facial',
      },
    ];
  }, [type]);

  return (
    <Wrapper>
      {list.map(({label, icon}, index) => {
        return (
          <Item isLast={index === list.length - 1} key={icon}>
            <Icon source={iconsConfig[theme.type][icon]} />
            <LabelText>{label}</LabelText>
          </Item>
        );
      })}
    </Wrapper>
  );
};
