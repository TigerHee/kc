/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  id: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '弹窗唯一id，多个弹窗同时使用时可能需要用到',
    defaultValue: 'defaultDrawer',
  },
  headerType: {
    propTypes: PropTypes.string,
    type: 'string',
    comment:
      '抽屉Header类型，normal为正常关闭按钮+居中标题。native为添加一个手势bar可以手势关闭+居左标题',
    defaultValue: 'normal',
  },
  show: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示',
  },
  title: {
    propTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: 'string|node',
    comment: '标题内容',
  },
  header: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: 'Header自定义组件，有此字段时，预设Header不生效',
  },
  onClose: {
    propTypes: PropTypes.func,
    type: 'function',
    comment: '点击取消按钮或蒙层回调',
  },
  leftSlot: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '左侧自定义组件，默认为关闭按钮',
  },
  rightSlot: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '右侧自定义组件',
  },
  children: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '正文内容子组件',
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
  },
};
