/**
 * Owner: iron@kupotech.com
 */
import init, { fastFetchABTest } from './init';
import login from './login';
import trackClick from './trackClick';
import observeExpose from './observeExpose';
import getAnonymousID from './getAnonymousID';
import * as spm from './spm';
import * as spmStorage from './spmStorage';
import registerProject from './registerProject';

export default {
  getSensors: () => window.sensors,
  init,
  trackClick,
  observeExpose,
  getAnonymousID,
  login,
  track: (...args) => window.sensors.track(...args),
  spm,
  fastFetchABTest,
  spmStorage,
  registerProject,
};
