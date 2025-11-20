/**
 * Owner: melon@kupotech.com
 */

export const cashbackReferral = 'cashbackReferral';

// 注册点击提交按钮自定义文案配置
export const SIGN_UP_BTN_TEXT_KEY = (_t: (key: string) => string) => ({
  inviteToEarn: () => _t('7b593a10281a4000add6'), // 砍一刀注册文案 - 注册后即可助力
} as const);
