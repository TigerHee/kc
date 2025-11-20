/**
 * Owner: iron@kupotech.com
 */
import { get } from '@tools/request';

// 获取支持语音的区号列表
export function getVoiceSupportCountry(param) {
  return get('/ucenter/country-codes/voice-support', param);
}
