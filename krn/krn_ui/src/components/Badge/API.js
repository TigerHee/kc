/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  text: {
    propTypes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: "number|string",
    comment:
      "展示的数字或文案，当为数字时候，大于 overflowCount 时显示为 ${overflowCount}+，为 0 或不传时显示点",
  },
  overflowCount: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "展示封顶的数字值",
    defaultValue: 99,
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
