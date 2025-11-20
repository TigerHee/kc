/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  color: {
    propTypes: PropTypes.string,
    type: "string",
    comment:
      "占位元素的背景色，子组件Row也支持此属性且优先级高于父组件Skeleton的属性",
  },
  active: {
    propTypes: PropTypes.bool,
    type: "boolean",
    comment:
      "加载动画，仅支持type为line的元素，子组件Row也支持此属性且优先级高于父组件Skeleton的属性",
    defaultValue: false,
  },
  activeColor: {
    propTypes: PropTypes.string,
    type: "string",
    comment:
      "加载动画mask的背景色，子组件Row也支持此属性且优先级高于父组件Skeleton的属性",
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "根元素样式，支持@emotion复写，子组件Col和Row也支持此属性",
  },
};
