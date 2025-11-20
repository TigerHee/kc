/**
 * Owner: corki.bai@kupotech.com
 */

import { get } from '@tools/request';

// 获取支持语音的区号列表
export function getValidationCode(param) {
  return get('/ucenter/send-validation-code', param);
}
