/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  value: {
    propTypes: PropTypes.number.isRequired,
    type: "number",
    comment: "数值",
  },
  duration: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "动画时长",
    defaultValue: 600,
  },
  textStyle: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "字体样式",
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "根元素样式，支持@emotion复写",
  },
};
