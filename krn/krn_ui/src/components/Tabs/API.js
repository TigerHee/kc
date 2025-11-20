/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';
export default {
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: 'Tabs根元素样式，支持@emotion复写',
  },
  variant: {
    propTypes: PropTypes.oneOf(['line', 'isolated', 'border']),
    type: 'string',
    comment: 'Tabs类型，可选值：line、isolated、border，默认值：line',
    defaultValue: 'line',
  },
  size: {
    propTypes: PropTypes.oneOf(['normal', 'large']),
    type: 'string',
    comment: 'Tabs大小，可选值：normal、large，默认值：normal',
    defaultValue: 'normal',
  },
  children: {
    propTypes: PropTypes.array,
    type: 'array',
    comment: 'Tabs内只支持嵌入Tabs.Tab子组件',
  },
  autoCentered: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '触发onChange后，自动将选中的Tab居中',
    defaultValue: true,
  },
  value: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '当前选中Tab的value',
  },
  onChange: {
    propTypes: PropTypes.func,
    type: 'func',
    comment: 'Tab切换时回调函数, 回调参数：(value, index, allProps)',
  },
};
