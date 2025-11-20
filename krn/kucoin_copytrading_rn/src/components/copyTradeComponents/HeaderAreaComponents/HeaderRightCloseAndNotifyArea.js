import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styled, {css} from '@emotion/native';
import {exitRN} from '@krn/bridge';
import colors from '@krn/ui/lib/theme/colors';

import HeaderCloseIcon from 'assets/common/header-close.svg';
import HeaderNotifyIcon from 'assets/common/header-notify.svg';

const HeaderRightLine = styled.View`
  width: 1px;
  height: 12px;
  background: ${colors.darkV2.cover8};
`;

export const HeaderRightCloseAndNotifyArea = memo(({iconColor}) => {
  return (
    <View style={css('flex-direction: row;align-items: center')}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
        <HeaderNotifyIcon fill={iconColor} style={css('margin-right: 8px')} />
      </TouchableOpacity>
      <HeaderRightLine />
      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
        <HeaderCloseIcon
          onPress={exitRN}
          fill={iconColor}
          style={css('margin-left: 8px')}
        />
      </TouchableOpacity>
    </View>
  );
});
