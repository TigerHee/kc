/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from '@knb/native-bridge';

export const resetAppHeader = () => {
  const isApp = JsBridge.isApp();
  if (isApp) {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'updateHeader',
        visible: true,
      },
    });
  }
};

export const hideAppHeader = () => {
  const isApp = JsBridge.isApp();
  if (isApp) {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'updateHeader',
        visible: false,
        // title: _t('34b9def8544a4800a99b'),
        // statusBarIsLightMode: false, // 状态栏文字颜色 false白色 true黑色
        // statusBarTransparent: true,
        // background: '#ffffff',
      },
    });
  }
};
