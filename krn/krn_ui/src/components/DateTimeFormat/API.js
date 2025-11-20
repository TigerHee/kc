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
    type: "number｜string",
    comment: "需要被格式化的时间",
  },
  options: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "Intl.DateTimeFormat 额外的参数",
    defaultValue: {},
  },
};
