/**
 * Owner: borden@kupotech.com
 */
import { getDvaApp } from '@kucoin-base/dva';
import bizTools from '@kucoin-biz/tools';
import Report from './report';

const { remoteEvent } = bizTools;


remoteEvent.on(remoteEvent.evts.GET_REPORT, (sendReport) => {
  if (typeof sendReport === 'function') {
    sendReport(Report);
  }
});

remoteEvent.on(remoteEvent.evts.GET_SENSORS, (sendSensors) => {
  if (typeof sendSensors === 'function') {
    sendSensors(window.$KcSensors);
  }
});

remoteEvent.on(remoteEvent.evts.GET_DVA, (sendDva) => {
  if (typeof sendDva === 'function') {
    sendDva(getDvaApp());
  }
});
