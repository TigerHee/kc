/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';

export async function getSMSCountry() {
  return pull('/ucenter/country-codes');
}
