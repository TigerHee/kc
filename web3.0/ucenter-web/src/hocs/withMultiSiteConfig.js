/**
 * Owner: corki.bai@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { useEffect } from 'react';
import { push } from 'src/utils/router';

const withMultiSiteForbiddenPage = (WrappedComponent, module, key, backUrl) => {
  return (props) => {
    const { multiSiteConfig } = useMultiSiteConfig();
    const isInApp = JsBridge.isApp();

    useEffect(() => {
      if (multiSiteConfig && multiSiteConfig?.[module] && !multiSiteConfig?.[module]?.[key]) {
        // 如果是在app中，则直接跳转回上个页面，或者关闭当前页面
        if (isInApp) {
          if (document.referrer) {
            window.location.replace(document.referrer);
          } else {
            JsBridge.open({
              type: 'func',
              params: { name: 'exit' },
            });
          }
        } else {
          push(backUrl);
        }
      }
    }, [isInApp, multiSiteConfig]);

    if (!multiSiteConfig) {
      return null;
    }

    // 如果未被屏蔽，则渲染传入的组件
    return <WrappedComponent {...props} multiSiteConfig={multiSiteConfig} />;
  };
};

export default withMultiSiteForbiddenPage;
