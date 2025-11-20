export interface HeaderProps {
  /**
   * header 自身主题
   */
  theme: 'light' | 'dark'; // header 自身主题
  /**
   * 主工程 主题
   */
  mainTheme?: 'light' | 'dark';
  /**
   * 平台
   */
  platform: 'pc' | 'mobile' | 'app';

  /**
   * 主题变化回调
   */
  onThemeChange: (theme: 'light' | 'dark') => void;

  transparent?: boolean; // 后期可能要单独实现一次 @deprecated
  currentLang?: string; // header 内部已经能否拿到语言 @deprecated
  KUCOIN_HOST?: string; // kucoin主站地址 @deprecated
  TRADE_HOST?: string; // 交易地址， @deprecated
  KUMEX_HOST?: string; // kumex地址， @deprecated
  KUMEX_BASIC_HOST?: string; // KuMEX简约版地址 @deprecated
  SANDBOX_HOST?: string; // 沙盒地址 @deprecated
  FASTCOIN_HOST?: string; // 一键买币地址 @deprecated
  MAINSITE_API_HOST?: string; // kucoin主站API地址 @deprecated
  POOLX_HOST?: string; // pool-x地址 @deprecated
  KUCOIN_HOST_CHINA?: string; //  kucoin国内站地址 @deprecated
  LANDING_HOST?: string; // 流量落地页地址 @deprecated
  pathname?: string; // 当前页面路径 @deprecated

  /**
   * 当前用户信息，重要
   */
  userInfo: undefined | null | Record<string, any>;

  // header顶部需要动态插入的内容
  topInsertRender?: () => React.ReactNode;
  /**
   *
   * TODO:待后续开发补充
   */
  renderLogoSuffix?: () => React.ReactNode;
  /**
   * 菜单配置
   */
  menuConfig: Record<string, any>;
  /**
   * TODO:
   * 需要检查是否可废弃，最新的设计风格应该已经兼容了交易，最新的设计高度默认为 72px
   * 是否是迷你导航模式（在交易页面使用）， 正常导航：常规高度80px，h5:64px  mini导航常规高度56px，h5:48px
   **/
  miniMode?: boolean;

  /**
   * TODO: 同上，需要检查是否可废弃，是否在交易页面
   */
  inTrade?: boolean; // TODO: 同上，需要检查是否可废弃，是否在交易页面

  /**
   * 自定义登录动作，需要g-biz把登录操作放出来
   */
  customLogin?: () => void;

  /**
   * 最简化header，为true后只保留登录注册按钮，默认 false
   */
  simplify?: boolean; // 最简化header，为true后只保留登录注册按钮，默认 false

  /**
   * TODO: 新版组件库 @kux/design Drawer 是否支持该项，需要检查
   * seo 需要保持 menuDrawer 内容保持始终挂载到dom，默认 true
   */
  drawKeepMounted?: boolean;

  /**
   * 用户发生过页面交互（鼠标移动、触屏移动）且页面停留超过指定秒数（默认10秒）。认定为真实用户而非SEO爬虫
   */
  restrictNoticeStayDuration?: number;

  // TODO: 看起来同上，需要检查
  userRestrictedStayDuration?: number;

  /**
   * 是否展示 Web3 切换控件，默认 true
   */
  showWeb3EntranceTab?: boolean;

  // 合伙人侧需要自定义LOGO
  brandLogoUrl?: string;

  currency?: string | null;

  // 注意要跟 simplify 模式配合使用
  inviter?: Record<string, any>;

  onHeaderHeightChange?: (height: number) => void;

  onCurrencyChange?: (currency: string) => void;

  onLangChange?: (lang: string) => void;

  dva?: any;

  [key: string]: any;
}
