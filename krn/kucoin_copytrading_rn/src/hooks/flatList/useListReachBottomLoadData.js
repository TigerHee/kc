import {useEffect, useMemo} from 'react';

export const useListReachBottomLoadData = (props, onEndReached) => {
  const {initScreen, onEndReached: registerOnEndReached} = props;

  const isScrollTabViewInside = !!initScreen;
  // 如果是在 ScrollTabView 里面， 利用ScrollTabView注入子组件的registerOnEndReached与 init 注册绑定下拉加载事件
  useEffect(() => {
    if (!isScrollTabViewInside) return;
    initScreen();
    registerOnEndReached(onEndReached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrollTabViewInside, onEndReached]);

  const flatListonEndReached = useMemo(
    () => (isScrollTabViewInside ? undefined : onEndReached),
    [isScrollTabViewInside, onEndReached],
  );

  return {
    flatListonEndReached,
  };
};
