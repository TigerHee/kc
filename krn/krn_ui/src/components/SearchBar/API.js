/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  value: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "搜索框的当前值",
  },
  onChange: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "value change 事件",
  },
  handleSearch: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "value change 事件的回调",
  },
  placeholder: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "搜索框的placeholder",
  },
  searchIcon: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    type: "object|boolean",
    comment: "搜索框图标，默认搜索图标，不传没有，可自定义",
  },
  showClear: {
    propTypes: PropTypes.bool,
    type: "boolean",
    comment: "是否显示清楚图标，默认显示",
  },
  disabled: {
    propTypes: PropTypes.bool,
    type: "boolean",
    comment: "是否禁用",
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "根元素样式，支持@emotion复写",
  },
  inputProps: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "input属性",
  },
};
