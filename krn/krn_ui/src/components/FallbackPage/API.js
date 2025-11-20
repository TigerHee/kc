/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";
export default {
  image: {
    propTypes: PropTypes.node,
    type: "node",
    comment: "自定义空状态图片组件，优先级高于默认图片",
  },
  title: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "页面标题",
  },
  description: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "页面描述",
  },
  buttonText: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "按钮文本，不传则不展示",
  },
  onPressBack: {
    propTypes: PropTypes.func,
    type: "func",
    comment: "左上角返回箭头点击事件",
  },
  onPressButton: {
    propTypes: PropTypes.func,
    type: "func",
    comment: "按钮点击事件",
  },
};
