/**
 * Owner: borden@kupotech.com
 * Desc: AppLoading改成SSG直出到文档，在整个应用ready后，需要将直出的loading节点移除
 */
import { useSelector } from 'dva';
import React, { useEffect } from 'react';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';

const AppLoading = React.memo(() => {
  const currentSymbol = useGetCurrentSymbol();
  const appReady = useSelector((state) => state.app.currentLangReady);
  const layoutLoading = useSelector((state) =>
    Boolean(!state.setting.currentLayout && state.loading.effects['setting/getLayouts']),
  );

  const appLoading = !appReady || !currentSymbol || layoutLoading;

  useEffect(() => {
    if (!appLoading) {
      const loadingElement = document.getElementById('loading_lcp');
      if (loadingElement) {
        loadingElement.parentNode.removeChild(loadingElement);
      }
    }
  }, [appLoading]);

  return null;
});

export default AppLoading;
