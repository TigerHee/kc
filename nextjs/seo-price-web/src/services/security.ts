/**
 * Owner: willen@kupotech.com
 */
import { postJson, pull as originPull } from 'gbiz-next/request';
import { pullWrapper } from '@/tools/pullCache';

const pull = originPull;
const prefix = '/ucenter';



/**
 * @description 检验需要验证的类型
 * @param bizType
 * @return {Promise<*>}
 */
export async function checkValidations(params) {
  return originPull(`${prefix}/check-required-validations`, { ...params, seq: 1 });
}
