import { WITH_SEARCH_LIST } from 'packages/header/components/TradeList/config';
import { MENU_CONFIG } from './const';
import { BannerType, LocalNavType, type NavigationBanner, type NavType, type RenderNavType } from './types';
import { find, forEach, map } from 'lodash-es';
import clsx from 'clsx';
import { ACTIVITY_BANNER_CLASS, FUNCTION_BANNER_CLASS } from 'packages/header/components/TradeList/utils';

/**
 * 整合处理二级菜单
 * @param {NavType[]} items
 * @returns {NavType[][]}
 */
export const resolveNavGroupList = (items: NavType[] = []): NavType[][] => {
  const groupList: NavType[][] = [];
  let colList: NavType[] = [];
  let colNumber = 0;

  if (items[0]?.level === 2 && !!items[0]?.children?.length) {
    // i是二级分组菜单
    forEach(items, (i: NavType, index) => {
      if (i.children) {
        // 每个分类不超过6个元素
        i.children = i.children.slice(0, MENU_CONFIG.MAX_NAV_GROUP_ITEMS);
        // 三级链接菜单数量
        const len = i.children.length;

        if (colNumber + len <= MENU_CONFIG.MAX_NAV_GROUP_ITEMS) {
          // 最多6个一列
          colList.push(i);
          colNumber += len;
        } else if (groupList.length < getMaxColumns()) {
          // 最多4列
          groupList.push(colList);
          colList = [];
          colList.push(i);
          colNumber = len;
        }
        // 最后一个直接加进数组
        if (index === items.length - 1 && groupList.length < getMaxColumns()) {
          groupList.push(colList.slice(0, MENU_CONFIG.MAX_NAV_GROUP_ITEMS));
        }
      }
    });
  }

  return groupList;
};

export const getWindowWidth = (): number => {
  // 服务端环境检测
  if (typeof window === 'undefined') return 0;
  // 客户端处理
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

/**
 * 获取当前最大的可展示列数
 * @returns
 */
export const getMaxColumns = (): number => {
  // const windowWidth = getWindowWidth();
  // const maxWindowWidth = Math.min(MENU_CONFIG.MAX_NAV_CONTAINER_WIDTH, windowWidth);
  // const columns = Math.floor(maxWindowWidth / MENU_CONFIG.MIN_NAV_COLUMN_WIDTH);
  // const result = Math.min(MENU_CONFIG.MAX_COLUMNS, columns);
  // return result;
  return MENU_CONFIG.MAX_COLUMNS;
};

const searchTradeTypeMap = {};
WITH_SEARCH_LIST.forEach(key => {
  searchTradeTypeMap[key] = 1;
});

const findChildrenSearchNav = (children: NavType[]): NavType | undefined => {
  let childrenList: NavType[] = [];
  let result;

  children.forEach(item => {
    const tradeType = item?.extContext?.tradeType?.[0] || '';
    if (result) {
      return;
    }

    if (searchTradeTypeMap[tradeType]) {
      result = item;
    }

    if (item.children?.length) {
      childrenList = childrenList.concat(item.children);
    }
  });

  // 递归遍历子节点
  if (childrenList.length > 0 && !result) {
    result = findChildrenSearchNav(childrenList);
  }

  return result;
};

/**
 * 检查该菜单下是否有搜索的
 * @param groupList
 * @returns
 */
const findSearchNav = (groupList: NavType[][]): NavType | undefined => {
  let result: NavType | undefined;
  let childrenList: NavType[] = [];

  for (let index = 0; index < groupList.length; index++) {
    const itemList = groupList[index];
    for (let idx = 0; idx < itemList.length; idx++) {
      const navItem = itemList[idx];
      const tradeType = navItem.extContext?.tradeType?.[0] || '';

      if (WITH_SEARCH_LIST.includes(tradeType)) {
        result = navItem;
        break;
      }
      if (navItem.children?.length) {
        childrenList = childrenList.concat(navItem.children);
      }
    }
    if (result) {
      break;
    }
  }

  if (childrenList.length > 0 && !result) {
    result = findChildrenSearchNav(childrenList);
  }

  return result;
};

type ResolveNavBannerAndSearchType = {
  groupList: NavType[][];
  navigationFunctionBanner?: NavigationBanner;
  navigationActivityBanner?: NavigationBanner;
};

/**
 * 整合资源位和搜索栏到下拉弹窗中 (仅下拉菜单使用)
 * - 返参的 groupList 最多不超过4列
 * - 优先级: 入参groupList菜单内容 > 搜索(如果有在最右侧) > 功能资源位  > 活动资源位
 * - 入参的groupList有可能多列，搜索、功能资源位，活动资源位各都是一列的
 * - 功能推广资源位在最左侧， 活动推广资源位在最右侧
 * @param {ResolveNavBannerAndSearchType} param
 * @returns {NavType[][]} newList
 */
export const resolveNavBannerAndSearch = ({
  groupList = [],
  navigationFunctionBanner = null,
  navigationActivityBanner = null,
}: ResolveNavBannerAndSearchType): RenderNavType[][] => {
  const len = groupList.length;
  const maxLen = getMaxColumns();
  if (len >= maxLen) {
    return groupList;
  }

  const newList: RenderNavType[][] = [
    ...groupList.map(list => [...list.map(item => ({ ...item, localNavType: LocalNavType.navigation }))]),
  ];

  const searchItem = findSearchNav(groupList);

  if (searchItem) {
    newList.push([{ ...searchItem, localNavType: LocalNavType.search }]);
  }

  if (navigationFunctionBanner && newList.length < maxLen) {
    newList.unshift([
      {
        ...navigationFunctionBanner,
        localNavType: LocalNavType.banner,
        bannerType: BannerType.function,
      },
    ]);
  }

  if (navigationActivityBanner && newList.length < maxLen) {
    newList.push([{ ...navigationActivityBanner, localNavType: LocalNavType.banner, bannerType: BannerType.activity }]);
  }

  return newList.slice(0, maxLen);
};

export const checkIsTwoBanner = (navigationList: RenderNavType[][]): boolean => {
  let count = 0;

  navigationList.forEach((list = []) => {
    list?.forEach(item => {
      if (item?.localNavType === LocalNavType.banner) {
        count++;
      }
    });
  }, 0);

  return count === 2;
};

export const getNavTypeClassFromGroupList = (groupList: RenderNavType[]) => {
  if (!groupList?.length) {
    return '';
  }
  const navType = groupList[0]?.localNavType || '';
  const bannerType = (groupList[0] as NavigationBanner)?.bannerType || '';

  const classMap = {
    [LocalNavType.banner]: 'banner-column-box',
    [LocalNavType.navigation]: 'navigation-column-box',
    [LocalNavType.search]: 'search-column-box',
  };

  const bannerClassMap = {
    [BannerType.function]: FUNCTION_BANNER_CLASS,
    [BannerType.activity]: ACTIVITY_BANNER_CLASS,
  };
  const result = clsx([classMap[navType] || '', bannerClassMap[bannerType] || '']);

  return result;
};
