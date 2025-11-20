/**
 * Owner: community module
 * Community Zustand Store
 */

import { getCommunityGroupConfigUsingGet } from '@/api/kucoin-config';
import type { CommunityGroupModel, CommunityGroupResponse } from '@/api/kucoin-config/types.gen';
import { getCurrentLang } from 'kc-next/i18n';
import { create } from 'zustand';

// 社群平台分组接口
export interface CommunityPlatformGroup {
  platform: string;
  items: CommunityGroupModel[];
  isMultiple: boolean;
}

// 社群状态接口
export interface CommunityState {
  // 社群配置数据（按语言分组）
  communitys: Record<string, CommunityGroupResponse>;
  // 当前语言的社群平台分组列表（前5个）
  communityPlatformGroups: CommunityPlatformGroup[];
  // 是否正在加载
  loading: boolean;
  // 错误信息
  error: string | null;
}

// 社群操作接口
export interface CommunityActions {
  // 获取社群配置
  getCommunitys: () => Promise<void>;
  // 重置状态
  reset: () => void;
}

// 组合状态和操作
export type CommunityStore = CommunityState & CommunityActions;

// 初始状态
const initialState: CommunityState = {
  communitys: {},
  communityPlatformGroups: [],
  loading: false,
  error: null,
};

export const useCommunityStore = create<CommunityStore>(set => ({
  ...initialState,

  getCommunitys: async () => {
    try {
      set({ loading: true, error: null });

      const data = await getCommunityGroupConfigUsingGet();

      if (data?.success && data.data && data.data.length > 0) {
        const items = data.data || [];
        const currentLang = getCurrentLang();

        // 查找当前语言对应的配置
        const current = items.find(item => currentLang === item.language);

        const communitys = {};
        if (current) {
          communitys[currentLang] = current;
        }

        // 处理社群平台分组
        const platforms = current?.communityPlatforms || [];
        const platformGroups = processCommunityPlatforms(platforms);

        set({
          communitys,
          communityPlatformGroups: platformGroups,
          loading: false,
        });
      } else {
        set({
          loading: false,
          error: 'Failed to fetch community config',
        });
      }
    } catch (error) {
      console.error('getCommunitys error:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));

// 处理社群平台分组
function processCommunityPlatforms(platforms: CommunityGroupModel[]): CommunityPlatformGroup[] {
  // 按平台分组
  const platformMap = new Map<string, CommunityGroupModel[]>();

  platforms.forEach(platform => {
    const platformKey = platform.platform || 'unknown';
    if (!platformMap.has(platformKey)) {
      platformMap.set(platformKey, []);
    }
    platformMap.get(platformKey)!.push(platform);
  });

  // 转换为分组数组并排序
  const groups: CommunityPlatformGroup[] = Array.from(platformMap.entries()).map(([platform, items]) => ({
    platform,
    items,
    isMultiple: items.length > 1,
  }));

  // 只返回前5个
  return groups.slice(0, 5);
}
