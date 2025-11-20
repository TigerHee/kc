/**
* Owner: melon@kupotech.com
* Create Date: 2025/01/13 17:49:50
* Tools for FusionInputFormItem - converted to TypeScript
*/

export const FUSION_INPUT_TYPE = {
  PHONE: 'phone',
  EMAIL: 'email',
} as const;

export type FusionInputType = typeof FUSION_INPUT_TYPE[keyof typeof FUSION_INPUT_TYPE];

// 常用正则
export const REGEXP = {
  // pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{10,32}$/, // 至少包含大小写字母跟数字，不支持空格，暂时没用到，注释掉
  email: /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  phone: /^\d{5,13}$/, // 5-13位的纯数字
};

// 检测账号类型（邮箱/手机号/未知）
export const checkAccountType = (value: string, type?: FusionInputType): FusionInputType | null => {
  if (value) {
    const trimmedValue = value.trim();
    if (type === 'phone') {
      if (REGEXP.phone.test(trimmedValue)) return 'phone';
    } else if (type === 'email') {
      if (REGEXP.email.test(trimmedValue)) return 'email';
    } else {
      if (REGEXP.phone.test(trimmedValue)) return 'phone';
      if (REGEXP.email.test(trimmedValue)) return 'email';
    }
  }
  return null;
};
