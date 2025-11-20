/**
 * Owner: willen@kupotech.com
 */
import PropTypes from "prop-types";

export default {
  leftButtons: {
    propTypes: PropTypes.array,
    type: "array",
    comment: "左滑按钮-同右滑rightButtons",
  },
  leftButtonWidth: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "按钮宽-同右rightButtons",
  },
  leftActionActivationDistance: {
    propTypes: PropTypes.number,
    type: "number",
    comment: "左滑激活距离阈值-同右滑rightActionActivationDistance",
  },
  onLeftActionActivate: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "左滑激活回调-同右滑onRightActionActivate",
  },
  onLeftActionDeactivate: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "左滑失活回调-同右滑onRightActionDeactivate",
  },
  onRef: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "滑动组件实例",
  },
  onPanAnimatedValueRef: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "接受滑动动画值 Animated.ValueXY",
  },
  initOpenLeft: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "实例方法，打开左边-同右initOpenRight",
  },
  recenter: {
    propTypes: PropTypes.func,
    type: "function",
    comment: "实例方法，重置动画",
  },
  others: {
    propTypes: PropTypes.any,
    type: "any",
    comment: "fork from: https://github.com/jshanson7/react-native-swipeable",
  },
};
