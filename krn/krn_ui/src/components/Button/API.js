/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  children: {
    propTypes: PropTypes.string.isRequired,
    type: 'string',
    comment: '按钮文本，必填',
  },
  size: {
    propTypes: PropTypes.oneOf(['mini', 'small', 'medium', 'large']),
    type: 'string',
    comment: '按钮大小，支持 mini, small, medium, large',
    defaultValue: 'medium',
  },
  color: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '按钮背景颜色，文字颜色会自动适应为白色或黑色',
  },
  onPress: {
    propTypes: PropTypes.func,
    type: 'func',
    comment: '按钮点击事件',
  },
  disabled: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '按钮禁用状态',
    defaultValue: false,
  },
  loading: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '按钮加载状态对象,参数参考Loading组件',
    defaultValue: {},
  },
  textStyle: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '按钮文字样式',
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: '根元素样式，支持@emotion复写',
  },
  icon: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '文字前 icon',
  },
  afterIcon: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '文字后 icon',
  },
  type: {
    propTypes: PropTypes.oneOf(['primary', 'secondary']),
    type: 'string',
    comment: '按钮类型，支持 primary, secondary',
    defaultValue: 'primary',
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
};
