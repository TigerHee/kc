/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import * as services from 'services/nps';
import base from 'utils/common_models/base';

export default extend(base, {
  namespace: 'nps',
  state: {
    // 弹窗 1: 感谢您对KuCoin的支持！
    // 弹窗 2: 开始答题
    showModalType: 0,
    // 详情
    // option增加selected;content;
    surveyinfo: {},
    // 当前题目的标号，纯展示用;只受上下一题按钮点击改变；从1开始
    curNum: 1,
    // 类似: [0, 3, 5, 8] 最后一项为当前面板的题目的索引。此数组维护题目前后关系
    linkedList: [0],
  },
  effects: {
    *getSurveyinfo({ payload }, { call, put }) {
      // 问卷信息-预览 : surveyId
      // 问卷信息: deliverId
      try {
        const res = yield call(
          payload?.surveyId ? services.surveyinfopreview : services.surveyinfo,
          payload,
        );
        const { code = '', data } = res || {};

        console.log('getSurveyinfo res', res);
        yield put({
          type: 'update',
          payload: {
            surveyinfo: data || {},
          },
        });
        return res;
      } catch (error) {
        console.error('nps api error:', error);
      }
    },
    *surveysubmit({ payload }, { call, put }) {
      const res = yield call(services.surveysubmit, payload);

      return res;
    },
  },
  subscriptions: {},
});
