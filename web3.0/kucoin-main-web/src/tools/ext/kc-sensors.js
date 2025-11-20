/**
 * Owner: willen@kupotech.com
 */
import sensors from '@kucoin-base/sensors';
import { pageIdMap, siteId } from '../sensorsReportConf';
import { injectPageTitleWhenExpose } from '../injectCodeByMatch';

export function init() {
  sensors.registerProject(
    {
      siteId,
      pageIdMap,
    },
    {
      app_name: _APP_NAME_,
      pageTitle: injectPageTitleWhenExpose,
    },
  );

  sensors.spmStorage.initSpmParam(window.location.href);
}

export default sensors;
