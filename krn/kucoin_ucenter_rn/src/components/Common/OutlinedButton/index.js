import React from 'react';
import {Button, useTheme} from '@krn/ui';

export default ({onPress, children, afterIcon, outerStyle, ...otherProps}) => {
  const theme = useTheme();

  return (
    <Button
      {...otherProps}
      onPress={onPress}
      afterIcon={afterIcon}
      styles={{
        buttonOuter: {
          ...{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colorV2.text,
            borderStyle: 'solid',
            borderRadius: 20,
          },
          ...outerStyle,
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
