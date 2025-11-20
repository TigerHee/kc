/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  value: {
    propTypes: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    type: "number|array",
    comment: "滑块值",
  },
  onValueChange: {
    propTypes: PropTypes.func,
    type: "func",
    comment: "滑动事件",
  },
  thumbStyle: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "滑块样式",
  },
  trackStyle: {
    propTypes: PropTypes.object,
    type: "object",
    comment: "轨道样式",
  },
  maximumValue: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "滑块最大值",
  },
  minimumValue: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "滑块最小值",
  },
  step: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "步长",
  },
  other: {
    propTypes: PropTypes.string,
    type: "string",
    comment:
      "此slider封装自@miblanchard/react-native-slider，其他参数详见 https://github.com/miblanchard/react-native-slider",
  },
};
