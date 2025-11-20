import type { ReactNode } from 'react';
import type { MENU_CONFIG } from './const';

export enum MarkType {
  Promote = 1, // 推广标识
  Unread = 2, // 未读标识, 新的标识，等价于原来的showNew逻辑
  Intro = 3, // 说明性标识
}

// 1,2

// 2 导航标识， 等价于原来的3
/**
 * - showNew 字段怎么逻辑判断 mark.type === 2
 * - tradeType 有可能是多个吗
 */

export enum TradeType {
  Spot = 'SPOT', // 现货
  Margin = 'MARGIN', // 杠杆
  FuturesUSDT = 'FUTURES_USDT', // u本位合约
  FuturesCurrency = 'FUTURES_CURRENCY', // 币本位合约
  TradingBot = 'TRADING_BOT', // 机器人策略列表
}

export type Mark = {
  type: MarkType;
  name: string;
};

export type TextMapType = {
  [key: string]: ReactNode;
};

export type ImageMapType = {
  icons: string;
  img: string;
  [key: string]: string;
};

export type ExtContextType = {
  tradeType?: TradeType[]; // 目前都是只有一个的，所以取值第一个即可
  [key: string]: any;
};

export enum LocalNavType {
  navigation = 'navigation',
  banner = 'banner',
  search = 'search',
}

export enum BannerType {
  function = 'function',
  activity = 'activity',
}

export type NavigationDetail = {
  id: string;
  uri: string;
  level: number;
  userType?: number;
  sort?: number;
  createdAt?: number;
  textMap: TextMapType;
  extContext?: ExtContextType;
  daySrcImgMap?: ImageMapType;
  nightSrcImgMap?: ImageMapType;
  marks?: Mark[] | null;
  children?: NavType[];
  isLeaf?: boolean;
};

export type LocalNavigationType = {
  // 前端侧维护的字段
  parentId?: string | null;
  localNavType?: LocalNavType;
  onClick?: (e: any) => void;
  showTooltip?: (children: ReactNode) => ReactNode;
  complianceSPM?: string;
  simpleIcon?: ReactNode;
};

export type NavType = NavigationDetail & LocalNavigationType;

export type RenderNavType = NavType | NavigationBanner;

export type FirstLevelNavigation = {
  navigationDetail: NavType;
  navigationFunctionBanner?: NavigationBanner;
  navigationActivityBanner?: NavigationBanner;
};

// 导航 API 响应类型
export type NavigationResponse = {
  success: boolean;
  code: string;
  msg: string;
  retry: boolean;
  data: {
    navigation: FirstLevelNavigation[];
  };
};

// 菜单悬停状态
export type MenuHoverState = {
  isHovering: boolean;
  activeMenuId: string | null;
  hoverTimer: NodeJS.Timeout | null;
};

// 菜单配置常量类型
export type MenuConfigType = typeof MENU_CONFIG;

// 二级菜单分组结构
export interface MenuGroup {
  id: string;
  name: string;
  explain?: string;
  items: NavType[];
  originalIndex: number; // 原始顺序索引
}

// 菜单列配置
export interface MenuColumn {
  groups: MenuGroup[];
  totalItems: number;
}

// 处理后的菜单结构
export interface ProcessedMenu {
  columns: MenuColumn[];
  hiddenItems: NavType[]; // 被隐藏的菜单项
  totalVisibleItems: number;
}

// 菜单位置类型
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'bottom-center';

// 菜单位置信息
export interface MenuPosition {
  left: number;
  top: number;
  placement: MenuPlacement;
}

// 合并算法测试结果
export interface MergeTestResult {
  result: number[];
  steps: Array<{
    step: number;
    description: string;
    result: number[];
  }>;
}

// 菜单验证结果
export interface MenuValidationResult {
  isValid: boolean;
  errors: string[];
}

// 分组限制处理结果
export interface GroupLimitResult {
  processedGroups: MenuGroup[];
  hiddenItems: NavType[];
}

export type NavigationBanner = {
  id?: string;
  webUrl?: string; // 点击后跳转的url
  appUrl?: string;
  daySrcImgMap?: ImageMapType; // 亮色图片资源，活动资源位才有
  nightSrcImgMap?: ImageMapType; // 暗色图片资源，活动资源位才有
  srcTextMap: TextMapType; // 资源位所有文案
  imgAlt?: string;
  title: string; // 埋点title，非文案展示

  businessLine?: string;
  siteType?: string;
  positionCode?: string;
  adPosition?: any;
  releasedAt?: any;
  canceledAt?: any;
  countDown?: number;
  isMarketing?: boolean;
  dayImageUrl?: any;
  nightImgUrl?: any;
  language: string;
  defaultLanguage: string;
  // 前端维护字段
  localNavType?: LocalNavType;
  bannerType?: BannerType;
} | null;

export type NavProps = {
  userInfo: any;
  isSub: boolean;
  inDrawer?: boolean;
  hostConfig: any;
  navStatus: number;
  inTrade?: boolean;
};
