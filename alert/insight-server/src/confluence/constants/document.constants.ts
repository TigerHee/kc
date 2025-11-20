const TECH_KEYS = [
  '方案背景',
  'PRD链接',
  'JIRA链接',
  '方案简述',
  '观测方案',
  '灰度方案',
  '回滚方案',
  '评审参与人',
  '评审时间',
  // "资源协调与排期(非必填)",
  // "风险评估(非必填)",
  '评审结果',
  // "参考文档",
];
const SEO_KEYS: string[] = ['URL', 'TDK', 'H1标签内容', 'SSG', 'Alternate标签', 'Canonical标签'];
const PRD_SEO_KEY = '是否登录前可访问页面';
const TECH_TEMPLATE_PAGE_ID = 127272278;
const PRD_TEMPLATE_PAGE_ID = 149492720;
const APP_HYBRID_AUDIT_RECORD_PAGE_ID = 686069375;
// 测试PAGE_ID
// const APP_HYBRID_AUDIT_RECORD_PAGE_ID = 687285813;
const PRD_IS_CONTENT_APP_STORE_KEY = '是否通过APP商店内容审核';
const PRD_IS_CONTENT_APP_STORE_KEY_VALUE = ['是', '否', '不需要'];

export {
  TECH_KEYS,
  SEO_KEYS,
  PRD_IS_CONTENT_APP_STORE_KEY,
  PRD_IS_CONTENT_APP_STORE_KEY_VALUE,
  PRD_TEMPLATE_PAGE_ID,
  TECH_TEMPLATE_PAGE_ID,
  PRD_SEO_KEY,
  APP_HYBRID_AUDIT_RECORD_PAGE_ID,
};
