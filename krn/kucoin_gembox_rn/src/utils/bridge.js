/**
 * Owner: roger.chen@kupotech.com
 */
import {
  showToast,
  setStatusStyle,
  getStatusStyle,
  notifyH5,
  KRNEventEmitter,
  exitRN,
  openNative,
  getAppSession,
  sensorsTrack,
  favCoin,
  checkIsFavor,
} from '@krn/bridge';

const Bridge = {
  exitRN,
  Toast: showToast,
  setStatusStyle,
  getStatusStyle,
  notifyH5,
  openNative,
  getAppSession,
  sensorsTrack,
  EventEmitter: KRNEventEmitter,
  favCoin,
  checkIsFavor,
};

export default Bridge;
