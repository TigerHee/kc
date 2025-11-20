/**
 * Owner: willen@kupotech.com
 */
import toolProxy from 'utils/toolProxy';
import message from '@kc/ui/lib/message';

export default toolProxy(message, function () {
  this.config({
    top: 120,
    duration: 4.5,
  });
});
