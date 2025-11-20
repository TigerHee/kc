/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  dot: {
    propTypes: PropTypes.bool,
    type: "boolean",
    comment: "是否显示小数点",
    defaultValue: true,
  },
  onChange: {
    propTypes: PropTypes.func,
    type: "func",
    comment: "按键点击事件，返回点击的按键值",
  },
  deleteImage: {
    propTypes: PropTypes.node,
    type: "node",
    comment: "自定义删除键图片组件，优先级高于默认图片组件",
  },
  numberFontSize: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "按键文字大小",
    defaultValue: 24,
  },
  itemHeight: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "单个按键高度",
    defaultValue: 46,
  },
  dotStyle: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "小数点样式",
  },
  touchHighlightColor: {
    propTypes: PropTypes.string,
    type: "string",
    comment: "点击高亮背景色，默认为主题色的complementary4",
  },
  throttleDuration: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "按键点击的节流间隔，单位ms，默认不节流",
    defaultValue: 0,
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: "object|array",
    comment: "根元素样式，支持@emotion复写",
  },
  gutter: {
    propTypes: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    type: "number|array",
    comment: "按钮间距，传数字相同间距，传数组，[水平间距, 垂直间距]",
  },
};
