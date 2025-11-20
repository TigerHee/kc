/**
 * Owner: willen@kupotech.com
 */
import { client } from './client.gen';

export const setCookies = data => client.postRaw('/_api/setCookies', data);
