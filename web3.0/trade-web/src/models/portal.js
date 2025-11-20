/**
 * Owner: harry.lai@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';

// portal model负责管控全局弹窗 一些依赖上下文
export default extend(base, {
  namespace: 'portal',
  state: {
    // 用户满意度调研弹窗展示条件
    satisfiedSurveyPlaceOrderCondition: false,
  },

  reducers: {
    /** 用户满意度调研弹窗展示条件： 标记已下单 */
    markSatisfiedSurveyPlaceOrderCondition(state) {
      return {
        ...state,
        satisfiedSurveyPlaceOrderCondition: true,
      };
    },
  },
  subscriptions: {},
});
