/**
 * Owner: vijay.zhou@kupotech.com
 */
import { post, get } from '@tools/request';

const prefix = '/risk-validation-center/v1';
// 请求头，操作记录的id，后端需要
const TRANSACTION_ID_KEY = 'X-VERIFY-TRANSACTION-ID';

/**
 * 探测功能可用性
 * @param bizType 业务场景的枚举
 */
export function getAvailable({ bizType }) {
  return get(`${prefix}/available/verify`, { bizType });
}

/**
 * 获取二步验证撮合结果
 * @param type 业务场景的枚举
 * @returns
 */
export function getValidationRating({ type, data = {}, permitValidateType }) {
  return post(`${prefix}/security/validation/combine`, { bizType: type, data, permitValidateType });
}

/**
 * 发送验证码
 * @param bizType 业务场景的枚举
 * @param sendChannel 发送通道枚举 MY_SMS-短信；MY_EMAIL-邮箱；MY_VOICE-语音；
 * @param transactionId
 * @returns
 */
export function sendValidationCode({ bizType, sendChannel, transactionId }) {
  return post(
    `${prefix}/security/validation/send-validation-code`,
    { bizType, sendChannel, transactionId },
    true,
    {
      headers: { [TRANSACTION_ID_KEY]: transactionId },
    },
  );
}

/**
 * 校验
 * @param bizType 业务场景的枚举
 * @param validations 校验内容，map对象 <K,V><验证方式，验证码>，例如<SMS，452541>
 * @param transactionId
 */
export function verifyValidationCode({ bizType, validations, transactionId }) {
  return post(
    `${prefix}/security/validation/risk/verify`,
    { bizType, validations, transactionId },
    false,
    {
      headers: { [TRANSACTION_ID_KEY]: transactionId },
    },
  );
}

// 获取支持语音的区号列表
export function getVoiceSupportCountry(param) {
  return get('/ucenter/country-codes/voice-support', param);
}

/** 获取 passkey 信息 */
export function getPasskeyInfo() {
  return get(`${prefix}/security/validation/inner/user-info`);
}
