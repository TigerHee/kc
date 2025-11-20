/**
 * Owner: willen@kupotech.com
 */
import Report from 'tools/ext/kc-report';

let coin_start_time;

const coinReport = (symbol) => {
  const stay_time = Date.now() - coin_start_time;
  Report.logSelfDefined('coin_category', { symbol, duration: stay_time });
  coin_start_time = Date.now();
};

export default coinReport;
