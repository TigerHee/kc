/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  checked: {
    propTypes: PropTypes.bool,
    type: "boolean",
    comment: "是否选中",
  },
  onChange: {
    propTypes: PropTypes.func,
    type: "func",
    comment: "变化时回调函数",
  },
  size: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "switch大小",
    defaultValue: 12,
  },
  disabled: {
    propTypes: PropTypes.bool,
    type: "boolean",
    comment: "是否可用",
    defaultValue: false,
  },
  checkedBg: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "选中时背景",
  },
  unCheckedBg: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "未选中时背景",
  },
};
