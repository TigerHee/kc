/**
 * Owner: clyne@kupotech.com
 */

import { evtEmitter as eventEmmiter } from 'helper';

const event = eventEmmiter.getEvt();

const CHECK_ERROR = 'CHECK_ERROR';

export const emit = () => {
  event.emit(CHECK_ERROR);
};

export const on = (cb) => {
  event.on(CHECK_ERROR, cb);
};

export const off = (cb) => {
  event.off(CHECK_ERROR, cb);
};
