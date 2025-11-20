/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';
export default {
  text: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '空状态文案展示',
  },
  textStyle: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '空状态文案样式',
  },
  image: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '自定义空状态图片组件，优先级高于默认图片',
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: '根元素样式，支持@emotion复写',
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
  imgType: {
    propTypes: PropTypes.oneOf([
      'empty',
      'systemBusy',
      'suspension',
      'network',
      'loading',
      'warning',
      'success',
      'error',
    ]),
    type: 'string',
    comment: '预设几种图片类型',
    defaultValue: 'empty',
  },
};
