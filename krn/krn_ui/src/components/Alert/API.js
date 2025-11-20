/**
 * Owner: tiger@kupotech.com
 */
import PropTypes from 'prop-types';
export default {
  type: {
    propTypes: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
    type: 'string',
    comment: '指定警告提示的样式，支持: success, warning, error, info',
    defaultValue: 'info',
  },
  title: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '警告提示内容',
  },
  showTypeIcon: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示类型图标',
    defaultValue: true,
  },
  showArrowIcon: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示箭头图标',
    defaultValue: false,
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
};
