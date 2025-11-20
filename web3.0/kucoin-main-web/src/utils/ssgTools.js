/**
 * Owner: Hanx.Wei@kupotech.com
 */
/**
 * 将state 暴露给ssg，用于初始化页面时注入
 * @param   {[type]}  fn  [fn description]
 * @return  {[type]}      [return description]
 */
export const exposePageStateForSSG = (fn) => {
  window.getCurPageState = () => {
    const dvaApp = window.getDvaApp();
    const dvaState = dvaApp?._store?.getState() || {};
    const models = dvaApp?._models || [];
    return fn(dvaState, models);
  };
};
