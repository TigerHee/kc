/**
 * Owner: eli.xiang@kupotech.com
 */

import { addSpmIntoQuery, compose } from './addSpmIntoQuery';
import { composeSpmAndSave, saveSpm2Storage } from './composeSpmAndSave';
import { exposeContext, injectExpose, useExpose } from './expose';
import { ga, getGaElement } from './ga';
import { gaClickNew } from './gaClickNew';
import { getPageId } from './getPageId';
import { kcsensorsManualExpose } from './kcsensorsManualExpose';
import { saTrackForBiz } from './saTrackForBiz';
import { track, trackClick, trackRequest } from './track';

export {
  ga,
  getGaElement,
  gaClickNew,
  exposeContext,
  useExpose,
  injectExpose,
  getPageId,
  kcsensorsManualExpose,
  saTrackForBiz,
  track,
  trackClick,
  trackRequest,
  compose,
  addSpmIntoQuery,
  saveSpm2Storage,
  composeSpmAndSave,
};
