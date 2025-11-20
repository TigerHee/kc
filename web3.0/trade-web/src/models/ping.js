/**
 * Owner: borden@kupotech.com
 */
export default {
  namespace: 'ping',
  state: {
    delayHTTP: 0,
  },
  reducers: {
    setDelayHTTP(state, { payload: { delayHTTP } }) {
      return {
        ...state,
        delayHTTP,
      };
    },
  },
};
