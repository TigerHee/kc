/**
 * Owner: iron@kupotech.com
 */
import axios from 'axios';
import { cmsHost } from './config';
import getTimestamp from './getTimestamp';

export default (key, lang) => {
  return axios.get(`${cmsHost}/h_${key}_${lang}.json`, {
    params: {
      t: getTimestamp(),
    },
  });
};
