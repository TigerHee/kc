import {useReducer} from 'react';

import {ACTION_TYPE_SET_STEP, APPLY_TRADER_STEPS} from './constants';

const initialState = {
  currentStep: APPLY_TRADER_STEPS.UN_APPLY,
};

const applyTraderReducer = (state, action) => {
  switch (action.type) {
    case [ACTION_TYPE_SET_STEP]:
      return {...state, currentStep: action.payload};
    default:
      return state;
  }
};

const useApplyStep = () => {
  const [state, dispatch] = useReducer(applyTraderReducer, initialState);

  /**
   * 更新申请交易员step
   * @param {string} step - valueof APPLY_TRADER_STEPS.
   */
  const setStep = step => {
    dispatch({type: ACTION_TYPE_SET_STEP, payload: step});
  };

  return [state, setStep];
};

export default useApplyStep;
