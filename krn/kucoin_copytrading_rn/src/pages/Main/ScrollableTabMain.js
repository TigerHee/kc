import {useMemoizedFn} from 'ahooks';
import React, {memo, useEffect, useMemo, useRef} from 'react';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import ScrollableTabView from 'components/ScrollableTabView';
import MorePointsDrawer from './components/MorePointsDrawer';
import {MainWrap} from './styles';

export const ScrollableMain = memo(
  ({mainTabList, handleActiveTab, activeTabKey, onLayout}) => {
    const {colorV2} = useTheme();
    const scrollTabRef = useRef(null);

    useEffect(() => {
      if (!mainTabList) {
        return;
      }
      const targetIndex = mainTabList.findIndex(
        i => i.itemKey === activeTabKey,
      );

      const checkedIndex = scrollTabRef.current?.state?.checkedIndex;

      if (targetIndex === checkedIndex) {
        return;
      }

      scrollTabRef.current?.toTabView?.(targetIndex);
    }, [activeTabKey, mainTabList]);

    const onTabChange = useMemoizedFn(idx => {
      handleActiveTab(mainTabList[idx]?.itemKey);
    });

    return useMemo(
      () => (
        <MainWrap
          onLayout={onLayout}
          style={
            __DEV__ &&
            css`
              margin-top: 40px;
            `
          }>
          <ScrollableTabView
            ref={scrollTabRef}
            hiddenUnderLine
            tabRightNode={<MorePointsDrawer />}
            onTabviewChanged={onTabChange}
            styles={{
              tabsStyle: css`
                height: 40px;
                min-height: 40px;
                border-radius: 0;
              `,
              tabWrapStyle: css`
                height: 40px;
                padding-top: 12px;
              `,
              tabsOuterWrapStyle: css`
                background: ${colorV2.overlay};
                padding-right: 16px;
                height: 40px;
                border-bottom-width: 0.5px;
                border-style: solid;
                border-color: ${colorV2.divider8};
              `,
              textActiveStyle: css`
                font-size: 14px;
                font-weight: 600;
              `,
              textStyle: css`
                font-size: 14px;
                font-weight: 500;
              `,
            }}
            style={css`
              background: ${colorV2.overlay};
            `}
            stacks={mainTabList}
          />
        </MainWrap>
      ),
      [colorV2.divider8, colorV2.overlay, mainTabList, onTabChange],
    );
  },
);
