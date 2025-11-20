declare interface Window {
  __KC_CRTS__?: {
    activeBrandKeys: string[]; // 支持多多租户的数组
    exact: boolean; // 是否精确匹配
    path: string;
  }[];
}
