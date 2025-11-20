import {useMount, useUnmount} from 'ahooks';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {ThemeProvider, useTheme} from '@krn/ui';

import useIsFocused from 'hooks/hybridNavigation/useIsFocused';
import {eventBus, GlobalEventBusType} from 'utils/event-bus';
import {StyledHeader} from './styles';

const StatusHeader = memo(({rightSlot = null}) => {
  const {colorV2} = useTheme();
  const [lastStatusStyle, setLastStatusStyle] = useState();
  const isFocused = useIsFocused();

  const recoveryStatusStyle = useCallback(() => {
    eventBus.emit(GlobalEventBusType.UpdateStatusBarStyle, lastStatusStyle);
  }, [lastStatusStyle]);

  useEffect(() => {
    if (isFocused) {
      eventBus.emit(GlobalEventBusType.UpdateStatusBarStyle, {
        backgroundColor: colorV2.overlay,
        barStyle: 'light-content', // 设置状态栏文字颜色为浅色
      });
      return;
    }
    recoveryStatusStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // 卸载时 恢复状态栏颜色
  useUnmount(() => {
    recoveryStatusStyle();
  });

  //  设置亮色状态栏 匹配交易员详情黑色Banner背景色
  useMount(async () => {
    const lastStatusStyle = await eventBus.emitWithReturn(
      GlobalEventBusType.GetStatusBarStyle,
    );

    setLastStatusStyle(lastStatusStyle);
  });

  return <StyledHeader rightSlot={rightSlot} />;
});

const ProviderStatusHeader = props => {
  return (
    <ThemeProvider defaultTheme="dark" EmotionProviderInstance={EThemeProvider}>
      <StatusHeader {...props} />
    </ThemeProvider>
  );
};
export default memo(ProviderStatusHeader);
