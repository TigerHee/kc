/**
 * Owner: willen@kupotech.com
 */
import sensors from '@kucoin-base/sensors';
import { pageIdMap, siteId } from '../sensorsReportConf';

export function init() {
  sensors.registerProject(
    {
      siteId,
      pageIdMap,
    },
    {
      app_name: _APP_NAME_,
    },
  );

  sensors.spmStorage.initSpmParam(window.location.href);
}

export default sensors;
