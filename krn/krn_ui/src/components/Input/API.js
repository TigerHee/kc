/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';
export default {
  label: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '标题，颜色受colorType控制',
  },
  tips: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '提示文案，颜色受colorType控制',
  },
  value: {
    propTypes: PropTypes.string.isRequired,
    type: 'string',
    comment: '输入框的值，必填项',
  },
  placeholder: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '输入框的placeholder',
  },
  onChange: {
    propTypes: PropTypes.func,
    type: 'func',
    comment: 'value change 事件，返回值为对象：{nativeEvent: { text: "hello" }}',
  },
  allowClear: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示清除按钮，当suffix为空时才能生效',
  },
  prefix: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '输入框的前缀组件',
  },
  suffix: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '输入框的后缀组件',
  },
  size: {
    propTypes: PropTypes.oneOf(['large', 'medium', 'small']),
    type: 'string',
    comment: '输入框大小，可选值为 large、medium、small',
    defaultValue: 'medium',
  },
  colorType: {
    propTypes: PropTypes.oneOf(['normal', 'success', 'error']),
    type: 'string',
    comment: '输入框颜色类型，可选值为 normal、success、error',
    defaultValue: 'normal',
  },
  originInputProps: {
    propTypes: PropTypes.object,
    type: 'object',
    comment:
      '此参数可覆盖TextInput的原生属性，如：autoFocus。具体key值可参考（https://reactnative-archive-august-2023.netlify.app/docs/0.66/textinput）',
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
  disabled: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '按钮禁用状态',
    defaultValue: false,
  },
};
