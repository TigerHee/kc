/**
 * Owner: jesse.shao@kupotech.com
 */
let coin_start_time;

const coinReport = (symbol, init = false) => {
  // if (!_IS_SERVER_) {
    if (init) {
      coin_start_time = Date.now();
    } else {
      const stay_time = Date.now() - coin_start_time;
      window._KC_REPORT_.logSelfDefined('coin_category', { symbol, duration: stay_time });
      coin_start_time = Date.now();
    }
  // }
};

export default coinReport;
