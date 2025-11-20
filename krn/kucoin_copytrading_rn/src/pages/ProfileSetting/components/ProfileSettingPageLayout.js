import React, {memo} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import Header from 'components/Common/Header';
import PageLayout from 'components/copyTradeComponents/TraderProfileComponents/PageLayout';
import {isIOS} from 'utils/helper';
import {ProfileSettingFooterArea} from '../styles';

const ProfileSettingPageLayout = ({content, footer}) => {
  const insets = useSafeAreaInsets() || {};
  const safeBottomHeight = isIOS ? `${insets.bottom}px` : '12px';
  const {colorV2} = useTheme();

  return (
    <PageLayout
      style={css`
        padding-bottom: ${safeBottomHeight};
      `}
      header={
        <Header
          style={css`
            background-color: ${colorV2.overlay};
          `}
          contentStyle={css`
            background-color: ${colorV2.overlay};
          `}
        />
      }
      content={
        <View
          style={css`
            flex: 1;
          `}>
          {content}
        </View>
      }
      footer={
        !!footer && (
          <ProfileSettingFooterArea>{footer}</ProfileSettingFooterArea>
        )
      }
    />
  );
};

export default memo(ProfileSettingPageLayout);
