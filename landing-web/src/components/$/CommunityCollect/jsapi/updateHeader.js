/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { omit } from 'lodash';
import JsBridge from 'utils/jsBridge';

export function updateHeader(options = {}) {
  const { darkMode, supportNew } = options;

  if (supportNew) {
    // @TODO: 支持皮肤
    const colors = {
      background: '#FFFFFF',
      titleColor: '#1D1D1D',
      leftTint: '#1D1D1D',
      rightTint: '#1D1D1D',
    };

    const jsApiOptions = omit(options, ['darkMode', 'supportNew']);

    const _options = {
      name: 'updateHeader',
      statusBarIsLightMode: true,
      visible: true,
      ...colors,
      ...jsApiOptions,
    };

    JsBridge.open({
      type: 'event',
      params: _options,
    });
  } else {
    JsBridge.open({
      type: 'event',
      params: {
        name: 'updateHeader',
        statusBarTransparent: true,
        // 状态栏文字颜色为白色
        statusBarIsLightMode: true,
        visible: false,
      },
    });
  }
}
