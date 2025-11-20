/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  children: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '子组件',
  },
  defaultTheme: {
    propTypes: PropTypes.oneOf(['light', 'dark']),
    type: 'string',
    comment: '默认主题色，可选值为 light 或 dark',
    defaultValue: 'light',
  },
  cstyle: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment:
      '控制colorV2下chartUpColor与chartDownColor的色值，当值为true时，绿涨红跌。当值为false时，红涨绿跌',
    defaultValue: true,
  },
  lang: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '当前语言Code，用于判断是否启动RTL布局，当传入ar_AE、ur_PK时，开启RTL布局',
    defaultValue: 'en_US',
  },
  appVersion: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '当前App版本，根据不同的版本使用不同的字体',
  },
  EmotionProviderInstance: {
    propTypes: PropTypes.func.isRequired,
    type: 'function',
    comment: '为了与外层的@emotion的主题Provider共享实例，需将外部的Provider传入',
  },
  options: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: `
    传入配置，如loadingIconSource，可以修改loading组件kucoin icon;
    options = {
    loadingIconSource: {uri: 'https://www.kucoin.com/kucoin-base-web/img/logo/192.png'},
    loadingIconSource: require('../../src/assets/dark/search.png')
  }
    `,
  },
};
