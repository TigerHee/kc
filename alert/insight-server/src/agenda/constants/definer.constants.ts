enum DEFINER_JOB_ENUMS {
  /**
   * 使用Onetrust探测cookie的diff
   */
  ONETRUST_COOKIE_DETECT_DIFF_V1 = 'ONETRUST:COOKIE_DETECT_DIFF:v1',
  /**
   * 密钥更换通知
   */
  INSIGHT_SECRET_REFRESH_NOTIFY_V1 = 'INSIGHT:SECRET_REFRESH_NOTIFY:v1',

  /**
   * 扫描Bitbucket仓库的package.json
   */
  BITBUCKET_SCAN_REPO_PACKAGE_JSON_V1 = 'BITBUCKET:SCAN_REPO_PACKAGE_JSON:v1',
  /**
   * 扫描Bitbucket仓库的AppH5离线包
   */
  BITBUCKET_SCAN_REPO_APP_H5_OFFLINE_V1 = 'BITBUCKET:SCAN_REPO_APP_H5_OFFLINE:v1',

  /**
   * 扫描Bitbucket仓库的Jscrambler
   */
  BITBUCKET_SCAN_REPO_JSCRAMBLER_V1 = 'BITBUCKET:SCAN_REPO_JSCRAMBLER:v1',

  /**
   * 动态项目自动流程
   */
  DYNAMIC_PROJECT_AUTO_WORKFLOW_V1 = 'DYNAMIC_PROJECT:AUTO_WORKFLOW:v1',

  /**
   * 扫描项目的offline配置
   */
  PROJECT_SCAN_REPO_OFFLINE_V1 = 'PROJECT:SCAN_REPO_OFFLINE:v1',
  /**
   * 扫描项目的jscrambler
   */
  PROJECT_SCAN_REPO_JSCRAMBLER_V1 = 'PROJECT:SCAN_REPO_JSCRAMBLER:v1',

  /**
   * 项目扫描仓库的package.json
   */
  PROJECT_SCAN_REPO_PACKAGE_JSON_V1 = 'PROJECT:SCAN_REPO_PACKAGE_JSON:v1',

  /**
   * 扫描项目的路由配置
   */
  PROJECT_SCAN_REPO_ROUTES_V1 = 'PROJECT:SCAN_REPO_ROUTES:v1',

  /**
   * 合规代码扫描
   */
  COMPLIANCE_CODE_SCAN_V1 = 'COMPLIANCE:CODE_SCAN:v1',

  // /**
  //  * 测试异步长时间任务
  //  */
  // TEST_ASYNC_LONG_RUNNING_JOB_V1 = 'TEST:LONG_RUNNING_JOB:v1',
  // /**
  //  * 测试长定时任务
  //  */
  // TEST_LONG_SCHEDULE_JOB_V1 = 'TEST:LONG_SCHEDULE_JOB:v1',
  // /**
  //  * 测试短定时任务
  //  */
  // TEST_SHORT_SCHEDULE_JOB_V1 = 'TEST:SHORT_SCHEDULE_JOB:v1',
  // /**
  //  * 测试远程异步执行任务
  //  */
  // TEST_REMOTE_ASYNC_JOB_V1 = 'TEST:REMOTE_ASYNC_JOB:v1',
  // /**
  //  * 测试遥远的计划任务
  //  */
  // TEST_FAR_SCHEDULE_JOB_V1 = 'TEST:FAR_SCHEDULE_JOB:v1',
  // /**
  //  * 测试失败任务
  //  */
  // TEST_FAIL_JOB_V1 = 'TEST:FAIL_JOB:v1',

  /**
   * 全量项目路由
   * 定时任务
   * 一天更新一次
   */
  INSIGHT_PROJECTS_ROUTES_JOB_V1 = 'INSIGHT:PROJECTS_ROUTES_JOB:v1',
  /**
   * kucoin 域名 safe browsing
   * 定时任务
   * 一天检查两次
   */

  KUCOIN_SAFE_BROWSING_JOB_V1 = 'KUCOIN:SAFE_BROWSING_JOB:v1',

  /**
   * kucoin 域名 virustotal
   * 定时任务
   * 一天检查4次
   */
  KUCOIN_VIRUSTOTAL_JOB_V1 = 'KUCOIN:VIRUSTOTAL_JOB:v1',

  /**
   * 扫描项目的wiki
   */
  CONFLUENCE_WIKI_VIEWER_UPDATE_V1 = 'CONFLUENCE:WIKI_VIEWER_UPDATE:v1',

  /**
   * 扫描前端kunlun告警列表
   */
  KUNLUN_SCAN_ALERT_V1 = 'KUNLUN:SCAN_ALERT:v1',

  /**
   * 扫描未处理的告警消息
   */
  SCAN_ALERT_BACKLOG_LIST_V1 = 'SCAN_ALERT_BACKLOG_LIST:v1',
}

export default DEFINER_JOB_ENUMS;
