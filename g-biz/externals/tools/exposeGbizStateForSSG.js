/**
 * Owner: Hanx.Wei@kupotech.com
 */
const GBIZ_INITIAL_STATE_PICKERS = [];
window.getCurGbizState = () => {
  const GBIZ_INITIAL_STATE = {};
  const dvaApp = window.getDvaApp();
  const dvaState = dvaApp?._store?.getState() || {};
  const models = dvaApp?._models || [];
  GBIZ_INITIAL_STATE_PICKERS.forEach((picker) => {
    picker(dvaState, GBIZ_INITIAL_STATE, models);
  });
  return GBIZ_INITIAL_STATE;
};

export const exposeGbizStateForSSG = (picker) => {
  GBIZ_INITIAL_STATE_PICKERS.push(picker);
};
