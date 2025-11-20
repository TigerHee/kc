/**
 * Owner: iron@kupotech.com
 */
import EventEmitter from './EventEmitter';

class RemoteEvent extends EventEmitter {
  evts = {
    GET_REPORT: 'remote-event-get-report',
    GET_SENSORS: 'remote-event-get-sensors',
    GET_DVA: 'remote-event-get-dva',
    GET_HOST: 'remote-event-get-host',
    GET_SOCKET: 'remote-event-get-socket',
    SHOW_ASSETS: 'remote-event-show-assets',
    GET_NOTICE_MSG: 'remote-event-get-notice-msg',
    GET_IP_COUNTRY_CODE: 'remote-event-get-ip-country-code',
    GET_BRAND_INFO: 'remote-event-get-brand-info',
    ON_GET_CSRF: 'remote-on-get-csrf',
    SHOW_CLEAR_USE_DIALOG: 'remote-event-show-clear-user-dialog',
    SHOW_INVITATION_LIST_DIALOG: 'remote-event-show-invitation-list-dialog',
  };
}

export default new RemoteEvent();
