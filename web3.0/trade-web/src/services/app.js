/**
 * Owner: borden@kupotech.com
 */
import axios from 'axios';

export function getVersion() {
  const { protocol, host } = window.location;
  const prefix = `${protocol}//${host}/trade`;
  return axios.get(`${prefix}/version.json?_ts=${Date.now()}`);
}
