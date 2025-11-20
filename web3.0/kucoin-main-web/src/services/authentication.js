/**
 * Owner: willen@kupotech.com
 */
import { post } from 'tools/request';

const prefix = '/ucenter';

export const uploadImg = (data) => {
  return post(`${prefix}/apply/unload`, data);
};
