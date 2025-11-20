/**
 * 验证码格式化
 * - 去掉非数字部分
 * - 最多保留 6 位
 */
export default function verificationCodeFormat(code) {
  return code.replaceAll(/\D/g, '').slice(0, 6);
}
