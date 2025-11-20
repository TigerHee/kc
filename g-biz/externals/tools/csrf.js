/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';

let csrf = null;

export const setCsrf = (value) => {
  csrf = value;
  remoteEvent.emit(remoteEvent.evts.ON_GET_CSRF);
};
export const getCsrf = () => csrf;
