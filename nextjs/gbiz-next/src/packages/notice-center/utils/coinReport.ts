/**
 * Owner: willen@kupotech.com
 */
import remoteEvent from 'tools/remoteEvent';

let coin_start_time;

const coinReport = (symbol) => {
  const stay_time = Date.now() - coin_start_time;
  remoteEvent.emit(remoteEvent.evts.GET_REPORT, (Report) => {
    Report.logSelfDefined('coin_category', { symbol, duration: stay_time });
  });
  coin_start_time = Date.now();
};

export default coinReport;
