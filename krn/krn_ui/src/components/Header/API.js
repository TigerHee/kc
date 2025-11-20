/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  title: {
    propTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: "string|node",
    comment: "标题",
  },
  leftSlot: {
    propTypes: PropTypes.node,
    type: "node",
    comment: "左侧自定义组件，默认为返回按钮",
  },
  onPressBack: {
    propTypes: PropTypes.func,
    type: "func",
    comment: "左侧默认组件点击事件，leftSlot为空时生效",
  },
  rightSlot: {
    propTypes: PropTypes.node,
    type: "node",
    comment: "右侧自定义组件",
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "根元素样式，支持@emotion复写",
  },
};
