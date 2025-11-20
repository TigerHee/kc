import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {css} from '@emotion/native';

import {isIOS} from 'utils/helper';

export const SafeAreaView = ({style, ...others}) => {
  const insets = useSafeAreaInsets() || {};
  const safeBottomHeight = isIOS ? `${insets.bottom}px` : '12px';

  return (
    <View
      {...others}
      style={[
        style,
        css`
          padding-bottom: ${safeBottomHeight};
        `,
      ]}
    />
  );
};
