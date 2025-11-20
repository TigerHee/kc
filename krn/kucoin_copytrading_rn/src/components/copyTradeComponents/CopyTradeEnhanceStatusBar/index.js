import React, {memo} from 'react';

import KRNStatusBar from 'components/Common/KRNStatusBar';
import {useEnhanceKRNStatusBar} from 'hooks/useEnhanceKRNStatusBar';

const CopyTradeEnhanceStatusBar = ({isDarkMode, isMainPage}) => {
  const statusBarOptions = useEnhanceKRNStatusBar(isDarkMode);
  // useDebugLog({insets});

  // 嵌套行情tab 页面 无需statusbar
  if (isMainPage) {
    return null;
  }

  return <KRNStatusBar {...statusBarOptions} />;
};

export default memo(CopyTradeEnhanceStatusBar);
