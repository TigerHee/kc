/**
 * Owner: tiger@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  lang: {
    propTypes: PropTypes.string.isRequired,
    type: "string",
    comment: "语言",
    defaultValue:'en_US'
  },
  children: {
    propTypes: PropTypes.string.isRequired,
    type: "number",
    comment: "需要被格式化的数字",
  },
  options: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "Intl.NumberFormat额外的参数",
    defaultValue: {},
  },
};
