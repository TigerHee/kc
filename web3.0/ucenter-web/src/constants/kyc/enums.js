/**
 * Owner: vijay.zhou@kupotech.com
 * 收录 kyc 使用的各种枚举
 */

/** kyc 类型
 * 接入 kyc 中台之后提供的接口才用这个类型
 * 使用前先确认！！！
 */
export const KYC_TYPE = {
  /** 无 */
  NONE: 0,
  /** 个人认证 */
  PERSONAL: 1,
  /** 机构认证 */
  INSTITUTIONAL: 2,
};

/** KYC 认证状态枚举，全认证类型共用 */
export const KYC_STATUS_ENUM = {
  /** 未认证 */
  UNVERIFIED: -1,
  /** 认证中断 */
  SUSPEND: 0,
  /** 认证中 */
  VERIFYING: 1,
  /** 认证成功 */
  VERIFIED: 2,
  /** 认证失败 */
  REJECTED: 3,
};

/** kyc 认证标准枚举 */
export const KYC_CERT_ENUM = {
  /** 澳洲基础 KYC 认证 */
  AU_BASIC_KYC: 'AU_BASIC_KYC',
  /** 欧洲迁移前补充基础 KYC 认证 */
  AU_BASIC_KYC_MIGRATE: 'AU_BASIC_KYC_MIGRATE',
  /** 澳洲高级零售认证 */
  AU_ADVANCE_RETAIL: 'AU_FINANCE_RETAIL_LEVEL2',
  /** 澳洲批发认证 */
  AU_WHOLESALE: 'AU_FINANCE_WHOLESALE',
  /** 欧洲基础 KYC 认证 */
  EU_BASIC_KYC: 'EU_BASIC_KYC',
  /** 欧洲高级认证 */
  EU_KYC_ADVANCE: 'EU_KYC_ADVANCE',
  /** 欧洲迁移前补充基础 KYC 认证 */
  EU_BASIC_KYC_MIGRATE: 'EU_BASIC_KYC_MIGRATE',
  /** 欧洲基础 KYB 认证 */
  EU_BASIC_KYB: 'EU_BASIC_KYB',
  /** 欧洲迁移前补充基础 KYB 认证 */
  EU_BASIC_KYB_MIGRATE: 'EU_BASIC_KYB_MIGRATE',
  /** 欧洲专业投资者认证 KYC */
  EU_KYC_PRO_USER: 'EU_KYC_PRO_USER',
  /** 欧洲专业投资者认证 KYB */
  EU_KYB_PRO_USER: 'EU_KYB_PRO_USER',
};

/**
 * 用户认证标签枚举
 * - 做了完认证就会打上对应的标签
 * */
export const KYC_LABEL_ENUM = {
  AU_FINANCE_RETAIL_LEVEL2: 'AU_FINANCE_RETAIL_LEVEL2',
  AU_FINANCE_WHOLESALE: 'AU_FINANCE_WHOLESALE',
  EU_ADVANCE: 'EU_ADVANCE',
};

/**
 * kyc 认证标准与标签 list 的映射
 * - 只要用户有一个标签对上，代表这个认证已经完成，不需要请求 kyc 中台
 */
export const KYC_CERT_PASSED_ENUM = {
  [KYC_CERT_ENUM.AU_BASIC_KYC]: [
    KYC_LABEL_ENUM.AU_FINANCE_RETAIL_LEVEL2,
    KYC_LABEL_ENUM.AU_FINANCE_WHOLESALE,
  ],
  [KYC_CERT_ENUM.AU_ADVANCE_RETAIL]: [KYC_LABEL_ENUM.AU_FINANCE_RETAIL_LEVEL2],
  [KYC_CERT_ENUM.AU_WHOLESALE]: [KYC_LABEL_ENUM.AU_FINANCE_WHOLESALE],
  [KYC_CERT_ENUM.EU_BASIC_KYC]: [KYC_LABEL_ENUM.EU_ADVANCE],
  [KYC_CERT_ENUM.EU_KYC_ADVANCE]: [KYC_LABEL_ENUM.EU_ADVANCE],
};

// AU KYB 认证类型枚举
export const AU_KYB_LEVEL_ENUM = {
  KYB1: 'AU_BASIC_ADMIN_KYB',
  KYB1_MIGRATE: 'AU_BASIC_ADMIN_KYB_MIGRATE',
  KYB2: 'AU_FINANCE_RETAIL_LEVEL2_ADMIN_KYB',
  KYB3: 'AU_FINANCE_WHOLESALE_ADMIN_KYB',
};

/** 可选角色枚举 */
export const KYC_ROLE_ENUM = {
  /** 零售用户 */
  RETAIL: 'RETAIL',
  /** 批发用户 */
  WHOLESALE: 'WHOLESALE',
};
