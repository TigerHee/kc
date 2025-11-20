/**
 * Owner: solar.xia@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';

export default extend(base, {
  namespace: 'dialog',
  state: {
    visible: false,
    content: '',
    title: '',
    buttonText: '',
    // 默认都是原页面跳转
    buttonLink: '',
    cancelText: '',
    taxInfoCollectDialogConfig: null,
  },
  effects: {
    // type区分新老ui弹窗。
    *openDialog(
      {
        payload: {
          content,
          title,
          buttonText,
          buttonLink,
          type = 'old',
          cancelText = '',
          confirmAction = () => {},
          cancelAction = () => {},
          closeAction = () => {},
        },
      },
      { put },
    ) {
      yield put({
        type: 'update',
        payload: {
          visible: true,
          content,
          title,
          buttonText,
          buttonLink,
          type,
          cancelText,
          cancelAction,
          confirmAction,
          closeAction,
        },
      });
    },
    *closeDialog(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          visible: false,
          content: '',
          title: '',
          buttonText: '',
          buttonLink: '',
          type: 'old',
          confirmAction: () => {},
          cancelAction: () => {},
          closeAction: () => {},
        },
      });
    },
  },
  reducers: {
    updateTaxInfoCollectDialogConfig(state, { payload }) {
      return {
        ...state,
        taxInfoCollectDialogConfig: {
          ...state.taxInfoCollectDialogConfig,
          ...payload,
        },
      };
    },
  },
  subscriptions: {},
});
