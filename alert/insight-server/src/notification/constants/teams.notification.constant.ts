export enum TeamsConversationEnum {
  /**
   * 值班信息通知群
   */
  ONCALL,
  /**
   * 预警信息通知群
   */
  WARNING,
  /**
   * 测试信息通知群
   */
  TEST,
}

export const TeamsConversation: Record<TeamsConversationEnum, string> = {
  [TeamsConversationEnum.ONCALL]: '19:ecc4c4410af6417daccb764e998fafaa@thread.v2',
  [TeamsConversationEnum.WARNING]: '19:8925b2f1c94d4f7e9ee9f272ca7821c3@thread.v2',
  [TeamsConversationEnum.TEST]:
    'a:1H0omnSsD8sYgTJJk2b15hiVZLduGKHKvHsgztMwYMITZ2W3Iuu_cKJm5QPJTYBrWRKvM0jVaPCKNNMh0YZ4RLTW0_jmyuM9RpKadTV5qVtBl0pLYGWAjTP_5iNA9acE_',
};
