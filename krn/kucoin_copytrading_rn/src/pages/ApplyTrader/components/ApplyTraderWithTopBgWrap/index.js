import React, {memo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HEADER_NAV_HEIGHT} from 'components/Common/Header/constant';
import {ApplyTraderTopAreaImageBgWrap, styles} from './styles';

const ApplyTraderWithTopBgWrap = ({children, style}) => {
  const {top} = useSafeAreaInsets() || {};
  // 容器顶部挤压高度为状态栏高度+Header导航栏高度
  const topPaddingHeight = top + HEADER_NAV_HEIGHT;
  return (
    <ApplyTraderTopAreaImageBgWrap
      resizeMode="contain"
      topPaddingHeight={topPaddingHeight}
      top={0}
      style={style}
      imageStyle={styles.applyTraderTopAreaImage}
      source={null}>
      {children}
    </ApplyTraderTopAreaImageBgWrap>
  );
};

export default memo(ApplyTraderWithTopBgWrap);
