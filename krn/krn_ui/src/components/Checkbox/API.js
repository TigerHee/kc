/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  checked: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否选中',
    defaultValue: false,
  },
  onChange: {
    propTypes: PropTypes.func,
    type: 'function',
    comment: '选中状态改变回调',
  },
  children: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '子组件',
  },
  disabled: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否禁用',
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: '根元素样式，支持@emotion复写',
  },
  checkboxStyle: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: 'checkbox样式，支持@emotion复写',
  },
  checkedType: {
    propTypes: PropTypes.oneOf([1, 2]),
    type: 'number',
    comment: '选中样式，1黑，2绿',
    defaultValue: 2,
  },
  size: {
    propTypes: PropTypes.oneOf(['medium', 'large']),
    type: 'string',
    comment: '按钮大小，支持 medium, large',
    defaultValue: 'medium',
  },
};
