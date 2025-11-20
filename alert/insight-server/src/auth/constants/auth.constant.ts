export const ROLES_KEY = 'insight:roles';
export const JWT_TOKEN_KEY_FOR_COOKIES = 'INSIGHT_TOKEN';

export const NO_AUTH_WHITE_LIST = [
  /**
   * Hello World 接口
   */
  '/',
  /**
   * 健康检查
   */
  '/health',
  /**
   * 登录
   */
  '/auth/login*',
  /**
   * 获取登录授权地址
   */
  '/auth/getAuthUrl',
  /**
   * 登出
   */
  '/auth/logout',
  /**
   * Azure AD 登录回调
   */
  '/auth/callback*',
  /**
   * 同步用户
   */
  '/user/sync',

  /**
   * webhook 回调地址
   */
  '/test*',

  /**
   * web-checker
   */
  '/stats',

  /**
   * kc-web-checker
   */
  '/tasks*',
  '/checker/tasks/wiki-status*',

  /**
   * page-speed
   */
  '/projects*',

  /**
   * 测试refresh_token接口
   */
  '/auth/refresh',

  /**
   * 终端路由，使用独立模式
   */
  '/terminal/*',

  '/rag/2md/*',

  '/rag/2html/*',

  /**
   * 流水线结果通知
   */
  '/pipeline/report',
];
