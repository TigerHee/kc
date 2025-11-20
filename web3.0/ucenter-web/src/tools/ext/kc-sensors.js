/**
 * Owner: willen@kupotech.com
 */
import sensors from '@kucoin-base/sensors';
import { setSensors } from '@kucoin-gbiz-next/sensors';
import { pageIdMap, siteId } from '../sensorsReportConf';

sensors.registerProject({ siteId, pageIdMap }, { app_name: _APP_NAME_, norm_version: 1 });
setSensors(sensors);
sensors.spmStorage.initSpmParam(window.location.href);

export default sensors;
