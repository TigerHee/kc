/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  id: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '弹窗唯一id，多个弹窗同时使用时可能需要用到',
    defaultValue: 'defaultConfirm',
  },
  title: {
    propTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: 'string|node',
    comment: '标题内容',
  },
  message: {
    propTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: 'string|node',
    comment: '正文内容',
  },
  show: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示',
  },
  cancelText: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '取消按钮文本，此字段不传则不显示取消按钮',
  },
  confirmText: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '确认按钮文本，此字段不传则不显示取消按钮',
  },
  onClose: {
    propTypes: PropTypes.func,
    type: 'function',
    comment: '点击取消按钮回调',
  },
  onConfirm: {
    propTypes: PropTypes.func,
    type: 'function',
    comment: '点击确认按钮回调',
  },
  children: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '自定义弹窗，当有此字段时，title、message、cancelText、confirmText字段将不起作用无效',
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: '弹窗主内容样式，支持@emotion复写',
  },
  footerDirection: {
    propTypes: PropTypes.oneOf(['row', 'column']),
    type: 'string',
    comment: 'footer按钮布局：row横，column竖',
    defaultValue: 'row',
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
  showCloseX: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示关闭按钮',
    defaultValue: false,
  },
  closeIcon: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '关闭按钮图标',
  },
};
