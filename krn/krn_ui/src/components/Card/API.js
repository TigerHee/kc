/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  children: {
    propTypes: PropTypes.node,
    type: "node",
    comment: "子组件",
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "根元素样式，支持@emotion复写",
  },
};
