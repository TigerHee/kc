/**
 * Owner: willen@kupotech.com
 */
import { client } from './client.gen';

export const setCookies = data => client.post('/_api/setCookies', data);
