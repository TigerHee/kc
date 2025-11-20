import React, {memo, useCallback, useLayoutEffect} from 'react';
import {View} from 'react-native';

import HorizontalScrollContainer from 'components/Common/HorizontalScrollContainer';
import {useStore} from './useStore';

export const TabList = memo(({children, style, enableScroll = false}) => {
  const {activeKey, changeTab} = useStore();

  useLayoutEffect(() => {
    collectTabList();
  }, [collectTabList]);

  const collectTabList = useCallback(() => {
    if (activeKey) return;
    const panes = React.Children.map(children, child => {
      if (!child) return undefined;
      const {tab, icon, disabled, itemKey, closable} = child.props;
      return {tab, icon, disabled, itemKey, closable};
    });

    changeTab(panes[0].itemKey);
  }, [activeKey, changeTab, children]);

  const WrapComp = enableScroll ? HorizontalScrollContainer : View;
  return <WrapComp style={style}>{children}</WrapComp>;
});
