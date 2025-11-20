import React, {forwardRef, memo, useCallback} from 'react';

import InnerScrollableTabView from './components/InnerScrollableTabView';
import {useMakeScrollableTabStyle} from './useMakeScrollableTabStyle';

const ScrollableTabView = forwardRef((props, ref) => {
  const {
    stacks,
    title = null,
    firstIndex = 0,
    header = null,
    scrollableOptions = {},
    onTabChange,
    styles = {},
    ...others
  } = props;
  const {
    toTabsOnTab = true,
    oneTabHidden = true,
    enableCachePage = true,
    ...options
  } = scrollableOptions;

  const styleProps = useMakeScrollableTabStyle(styles);
  const onTabViewChanged = useCallback(
    idx => {
      onTabChange?.(idx);
    },
    [onTabChange],
  );

  return (
    <InnerScrollableTabView
      sectionListProps={{
        bounces: false, // 禁用回弹效果
        alwaysBounceVertical: false, // 禁用垂直方向的回弹
        alwaysBounceHorizontal: false, // 禁用水平方向的回弹
      }}
      syncToSticky={true}
      fixedTabs
      title={title}
      ref={ref}
      onTabviewChanged={onTabViewChanged}
      mappingProps={{}}
      stacks={stacks}
      header={header}
      fillScreen={true}
      firstIndex={firstIndex}
      toTabsOnTab={toTabsOnTab}
      oneTabHidden={oneTabHidden}
      enableCachePage={enableCachePage}
      {...styleProps}
      {...others}
      {...options}
    />
  );
});

export default memo(ScrollableTabView);
