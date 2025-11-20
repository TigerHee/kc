/**
 * Owner: brick.fan@kupotech.com
 */
import { post, pull } from 'tools/request';

export const searchAccount = (params) => {
  return post('/official-channel/channel/validate', params, false, true);
};

export const getQrCodeDetail = (id) => {
  return pull(`/cert-config/web/dynamic-qrcode/get/${id}`);
};
