/**
 * Owner: tiger@kupotech.com
 */
import PropTypes from 'prop-types';
export default {
  type: {
    propTypes: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
    type: 'string',
    comment: '类型，支持: success, warning, error, info',
    defaultValue: 'info',
  },
  content: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '内容',
  },
  size: {
    propTypes: PropTypes.oneOf(['medium', 'small']),
    type: 'string',
    comment: '大小，支持 medium, small',
    defaultValue: 'medium',
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
};
