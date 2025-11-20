import extend from 'dva-model-extend';
import {isUndefined} from 'lodash';

import {baseModel} from 'utils/dva';

export default extend(baseModel, {
  namespace: 'globalModal',
  state: {
    kycModalVisible: false,
    traderApprovalModalVisible: false,
    restrictModal: {
      visible: false,
      restrictType: '',
    },
    kycLevelRestrictModal: {
      interceptType: '',
      visible: false,
    },
  },
  reducers: {
    toggleKYCModal(state) {
      return {...state, kycModalVisible: !state.kycModalVisible};
    },
    toggleTraderApprovalModal(state, {payload}) {
      return {
        ...state,
        traderApprovalModalVisible: isUndefined(payload)
          ? !state.traderApprovalModalVisible
          : payload,
      };
    },
  },
  effects: {},
});
