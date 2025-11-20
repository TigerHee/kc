/**
 * Owner: willen@kupotech.com
 */
import { client } from './client.gen';

export function getMaintenanceStatusFailBack(opts = {}) {
  return client.pull(
    'https://assets.staticimg.com/static/maintenance-status.json',
    opts
  );
}
