/**
 * Owner: tiger@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  message: {
    propTypes: PropTypes.string.isRequired,
    type: "string",
    comment: "翻译文案",
  },
  renderParams: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "需要被替换的标签\n [component]: 标签渲染组件\n [componentProps]: 渲染组件的props",
  },
  TextComponent: {
    propTypes: PropTypes.node,
    type: "node",
    comment: " 除了组件之外的文本包裹组件， 默认Text",
  },
  style: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "除了组件之外的文本样式",
  },
};
