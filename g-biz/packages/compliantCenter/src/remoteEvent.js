/**
 * Owner: terry@kupotech.com
 */
import EventEmitter from '@tools/EventEmitter';

class RemoteEvent extends EventEmitter {
  evts = {
    RULE_READY: 'COMPLIANCE_RULE_READY',
  };
}

export default new RemoteEvent();
