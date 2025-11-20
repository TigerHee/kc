/**
 * Owner: melon@kupotech.com
 * Create Date: 2025/01/13 19:42:41
 * PhoneAreaSelector service - converted to TypeScript
 */
import { debounce } from 'lodash-es';
import { client } from '@/api/client.gen';

export const getUserArea = debounce(
  (param?: any) => {
    return client.pull('/_api/universal-core/ip/country', param);
  },
  400,
  {
    leading: true,
    trailing: false,
  }
);
