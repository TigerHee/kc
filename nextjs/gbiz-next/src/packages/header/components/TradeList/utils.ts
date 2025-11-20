import { OVERLAY_CONTENT_FLAG } from 'packages/header/Header/Nav/NavigationColumns/constants';

export const FUNCTION_BANNER_CLASS = 'function-banner';
export const ACTIVITY_BANNER_CLASS = 'activity-banner';
export const NAVIGATION_COLUMN_CLASS = 'nav-group-container';

export const MIN_HEIGHT = 400;

/**
 * 获取当前窗口下搜索列表最大高度
 * 比较:
 * 功能资源位: .function-banner > div
 * 菜单列表: .nav-group-container 总和
 * 活动资源位: .activity-banner > div
 *
 * 设置:
 * 搜索列表: .virtualized-list
 * @returns {number} result
 */

export const getSearchMinHeight = (containerRef: React.RefObject<HTMLDivElement | null>): number => {
  if (!containerRef.current) {
    return 0;
  }

  const root = containerRef.current.closest(`#${OVERLAY_CONTENT_FLAG}`);
  if (!root) {
    return 0;
  }

  const functionBannerHeight = (root.querySelector(`.${FUNCTION_BANNER_CLASS} > div`) as any)?.offsetHeight || 0;
  const activityBannerHeight = (root.querySelector(`.${ACTIVITY_BANNER_CLASS} > div`) as any)?.offsetHeight || 0;
  const navigationList = root.querySelectorAll<HTMLDivElement>(`.${NAVIGATION_COLUMN_CLASS}`) || [];

  let navigationHeight = 0;

  navigationList.forEach((item, index) => {
    if (item?.offsetHeight > 0) {
      navigationHeight += item.offsetHeight;
    }
    if (index < navigationList.length - 1) {
      navigationHeight += 8;
    }
  });

  // 元素距离容器高度差
  navigationHeight -= 110;

  return Math.max(MIN_HEIGHT, functionBannerHeight, activityBannerHeight, navigationHeight);
};
