import { EmailThinIcon, GaThinIcon, PhoneThinIcon, TradingpasswordThinIcon } from '@kux/iconpack';
import { _t } from 'src/tools/i18n';

export const RESET_SECURITY_RESULT = {
  /** 无 */
  NONE: -1,
  /** 处理中 */
  PROCESSING: 0,
  /** 通过 */
  SUCCESS: 1,
  /** 拒绝 */
  FAIL: 2,
  /** 自动审核通过 */
  AUTO_SUCCESS: 10,
  /** 系统拒绝 */
  SYSTEM_REJECT: 11,
};

export const RESET_SECURITY_SCENES = {
  /** 初始 */
  INIT: 'INIT',
  /** 选择重置项 */
  SELECT_ITEMS: 'SELECT_ITEMS',
  /** kyc 人脸验证 */
  KYC_FACE_VERIFICATION: 'KYC_FACE_VERIFICATION',
  /** kyc 证件验证 */
  KYC_CERT_VERIFICATION: 'KYC_CERT_VERIFICATION',
  /** 账单验证 */
  BILL_VERIFICATION: 'BILL_VERIFICATION',
  /** 问题验证 */
  QUESTION_VERIFICATION: 'QUESTION_VERIFICATION',
  /** 绑定邮箱 */
  BIND_EMAIL: 'BIND_EMAIL',
  /** 重置项 */
  RESET_ITEMS: 'RESET_ITEMS',
  /** 重置结果-审核中 */
  RESULT_VERIFYING: 'RESULT_VERIFYING',
  /** 重置结果-审核失败 */
  RESULT_FAILED: 'RESULT_FAILED',
};

/** 支持重置的项目 */
export const RESET_ITEMS = {
  PHONE: 'phone',
  EMAIL: 'email',
  G2FA: 'g2fa',
  TRADE_PASSWORD: 'tp',
};

/** 操作类型 */
export const OPERATE_TYPES = {
  [RESET_ITEMS.PHONE]: 'RESET_PHONE',
  [RESET_ITEMS.EMAIL]: 'RESET_EMAIL',
  [RESET_ITEMS.G2FA]: 'RESET_2FA',
  [RESET_ITEMS.TRADE_PASSWORD]: 'RESET_TP',
};

/** UC 里重置安全项提交时的类型 */
export const REBIND_TYPES = {
  [RESET_ITEMS.PHONE]: 'rebind_phone',
  [RESET_ITEMS.EMAIL]: 'rebind_email',
  [RESET_ITEMS.G2FA]: 'rebind_g2fa',
  [RESET_ITEMS.TRADE_PASSWORD]: 'reset_trade_password',
};

/** 选择项目顺序 */
export const SELECT_ITEM_ORDERS = {
  [RESET_ITEMS.PHONE]: 1,
  [RESET_ITEMS.EMAIL]: 2,
  [RESET_ITEMS.G2FA]: 3,
  [RESET_ITEMS.TRADE_PASSWORD]: 4,
};

export const SELECT_ITEM_LIST = Object.values(RESET_ITEMS).sort(
  (a, b) => SELECT_ITEM_ORDERS[a] - SELECT_ITEM_ORDERS[b],
);

/** 重置顺序 */
export const RESET_ITEM_ORDERS = {
  [RESET_ITEMS.EMAIL]: 1,
  [RESET_ITEMS.G2FA]: 2,
  [RESET_ITEMS.TRADE_PASSWORD]: 3,
  [RESET_ITEMS.PHONE]: 4,
};

export const SELECT_ITEM_INFOS = {
  [RESET_ITEMS.G2FA]: {
    key: RESET_ITEMS.G2FA,
    title: () => _t('validation.g2fa'),
    icon: () => <GaThinIcon width={20} />,
  },
  [RESET_ITEMS.EMAIL]: {
    key: RESET_ITEMS.EMAIL,
    title: () => _t('email'),
    icon: () => <EmailThinIcon width={20} />,
  },
  [RESET_ITEMS.PHONE]: {
    key: RESET_ITEMS.PHONE,
    title: () => _t('phone'),
    icon: () => <PhoneThinIcon width={20} />,
  },
  [RESET_ITEMS.TRADE_PASSWORD]: {
    key: RESET_ITEMS.TRADE_PASSWORD,
    title: () => _t('trade.code'),
    icon: () => <TradingpasswordThinIcon width={20} />,
  },
};

export const RESET_ITEM_INFOS = {
  [RESET_ITEMS.G2FA]: {
    key: RESET_ITEMS.G2FA,
    title: () => _t('0f783c80d8ad4000aa5e'),
  },
  [RESET_ITEMS.EMAIL]: {
    key: RESET_ITEMS.EMAIL,
    title: () => _t('899fc6ac6c0c4000abc1'),
  },
  [RESET_ITEMS.PHONE]: {
    key: RESET_ITEMS.PHONE,
    title: () => _t('8879daa7a9f24000aadd'),
  },
  [RESET_ITEMS.TRADE_PASSWORD]: {
    key: RESET_ITEMS.TRADE_PASSWORD,
    title: () => _t('a19effafde314000adff'),
  },
};

export const UPLOAD_ACCEPT = [
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-excel', // xls
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/pdf', // pdf
].join(',');

export const UPLOAD_SIZE = 5 * 1024 * 1024;

/** 提交结果失败错误码 */
export const APPLY_RESULT_ERRORS = {
  /** 有在途工单 */
  HAS_PENDING_TICKET: '500850',
  /** 缺少绑定项 */
  LACK_OF_BIND_ITEM: '500852',
};
