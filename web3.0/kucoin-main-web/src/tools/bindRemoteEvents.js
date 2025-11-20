/**
 * Owner: willen@kupotech.com
 */
import bizTools from '@kucoin-biz/tools';
import { getDvaApp } from '@kucoin-base/dva';

const { remoteEvent } = bizTools;

remoteEvent.on(remoteEvent.evts.GET_REPORT, (sendReport) => {
  if (typeof sendReport === 'function') {
    const Report = require('tools/ext/kc-report').default;
    sendReport(Report);
  }
});

remoteEvent.on(remoteEvent.evts.GET_SENSORS, (sendSensors) => {
  if (typeof sendSensors === 'function') {
    const sensors = require('tools/ext/kc-sensors').default;
    sendSensors(sensors);
  }
});

remoteEvent.on(remoteEvent.evts.GET_DVA, (sendDva) => {
  if (typeof sendDva === 'function') {
    sendDva(getDvaApp());
  }
});

remoteEvent.on(remoteEvent.evts.GET_SOCKET, (sendWS) => {
  if (typeof sendWS === 'function') {
    import('src/utils/socket').then(({ kcWs: socket, Topic }) => {
      sendWS(socket, Topic);
    });
  }
});
