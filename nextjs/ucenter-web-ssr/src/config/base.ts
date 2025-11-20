// SEO Meta Configuration
export const SEO_META_CONFIG = [];

// 需要单独处理tdk的路由
export const TDK_EXCLUDE_PATH: RegExp[] = [];

// 需要替换tdk的二级路由
export const TDK_REPLACE_PATH: RegExp[] = [];

// WITHOUT_QUERY_PARAM:不应该出现在 url-query 参数中的参数。
export const WITHOUT_QUERY_PARAM = [
  'rcode',
  'utm_source',
  'utm_campaign',
  'utm_medium',
];

export const RTL_LANGUAGES = ['ar_AE', 'ur_PK'];

// X-Platform 有透传这个 header，值是 default / mobile / app
export const X_PLATFORM_HEADER = 'x-platform';

// 登录、注册、重置成功默认跳转到的路由地址
export const DEFAULT_JUMP_ROUTE = '/account';
export const DEFAULT_JUMP_ROUTE_CL = '/claim';

// ("用户类型 1（普通用户） 2(内部账号）3(子账号） 4(测试账号) 5(返佣做市商) 6(项目方) 7(项目方做市商) 8(固定费率做市商)")
export const ACCOUNT_TYPE = {
  Normal: 1,
  Internal: 2,
  SubAccount: 3,
  Test: 4,
  Return: 5,
  Project: 6,
  ProjectReturn: 7,
  FixedRate: 8,
};
