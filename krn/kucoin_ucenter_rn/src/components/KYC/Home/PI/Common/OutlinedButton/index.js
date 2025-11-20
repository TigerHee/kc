import React from 'react';
import {Button, useTheme} from '@krn/ui';
import useIconSrc from 'hooks/useIconSrc';
import {ArrowRightIcon} from 'components/KYC/Home/style';

export default ({onPress, children}) => {
  const theme = useTheme();

  return (
    <Button
      onPress={onPress}
      afterIcon={<ArrowRightIcon source={useIconSrc('btnOutlineArrow')} />}
      styles={{
        buttonOuter: {
          backgroundColor: theme.colorV2.overlay,
          borderWidth: 1,
          borderColor: theme.colorV2.text,
          borderStyle: 'solid',
          borderRadius: 20,
        },
        buttonText: {
          color: theme.colorV2.text,
        },
      }}
      type="secondary">
      {children}
    </Button>
  );
};
