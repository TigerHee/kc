/**
 * Owner: iron@kupotech.com
 */
import { map } from 'lodash-es';
import React, { useRef } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import type { FirstLevelNavigation, NavigationBanner, NavProps, NavType } from './types';
// import { MENU_CONFIG } from './const';
import { resolveNavBannerAndSearch, resolveNavGroupList } from './utils';
import LinkMenuItem from './LinkMenuItem';
import NavigationColumn from './NavigationColumns';

type ShowMenuType = {
  id?: string;
  name?: string;
};

type Params = NavProps & {
  items: NavType[]; // 此处items是二级菜单列表
  modid: string;
  parentIndex: number;
  parentItem: FirstLevelNavigation;
  inDrawer?: boolean;
  getUrl?: (item: NavType) => string;
  showMenu?: ShowMenuType;
  navigationFunctionBanner?: NavigationBanner;
  navigationActivityBanner?: NavigationBanner;
};

/**
 * 2、3级菜单下拉弹窗组件
 * @param param0
 * @returns
 */
const Overlay = ({
  items,
  modid,
  parentIndex,
  parentItem,
  inDrawer,
  getUrl,
  showMenu,
  navigationActivityBanner,
  navigationFunctionBanner,
  ...props
}: Params) => {
  const groupRef = useRef<HTMLDivElement>(null);

  // 有三级菜单时，三级菜单是链接，这时二级菜单是分组
  if (items[0].level === 2 && !!items[0]?.children?.length) {
    const groupList: NavType[][] = resolveNavGroupList(items);
    const showTradeList = groupList.length < 2;
    if (inDrawer) {
      return (
        <div className={clsx(styles.overlayWrapper, styles.overlayWrapperInDrawer)} ref={groupRef}>
          {map(groupList, (grounpItem: NavType[], grounpIndex) => {
            return (
              <div key={grounpIndex} className={clsx(styles.overlayList, styles.overlayListInDrawer)}>
                {map(grounpItem, (nextItem: NavType, nextIndex) => {
                  return (
                    <div className={styles.grounpDiv} key={nextIndex}>
                      <div className={clsx(styles.navGroupName)}>{nextItem.textMap.name}</div>
                      {map(nextItem.children, (lastItem, lastIndex) => {
                        return (
                          <LinkMenuItem
                            key={lastItem.id}
                            navItem={{ ...lastItem }}
                            showMenu={showMenu}
                            content={{
                              index: lastIndex,
                              modid,
                              parentIndex,
                              parentItem,
                              showTradeList,
                              getUrl,
                            }}
                            parentRef={groupRef}
                            inDrawer
                            {...props}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    const navigationList = resolveNavBannerAndSearch({
      groupList,
      navigationActivityBanner,
      navigationFunctionBanner,
    });

    return (
      <NavigationColumn
        navigationList={navigationList}
        modid={modid}
        key={modid}
        parentIndex={parentIndex}
        parentItem={parentItem}
        inDrawer={inDrawer}
        getUrl={getUrl}
        showMenu={showMenu}
        navigationActivityBanner={navigationActivityBanner}
        navigationFunctionBanner={navigationFunctionBanner}
        {...props}
      />
    );
  }

  /**
   * 暂时保留注释代码，
   * 已与产品确认@yangayang，二级菜单按产品设计不应该是叶子节点。
   * 如果是叶子节点的话是运营人员配置失误，需要运营进行调整。故此处将不做展示处理
   */

  // if (items[0]?.isLeaf) {
  //   const groupList: NavType[][] = [];
  //   let colList: NavType[] = [];
  //   let colNumber = 0;
  //   forEach(items, (i, index) => {
  //     if (colNumber < MENU_CONFIG.MAX_NAV_GROUP_ITEMS) {
  //       colList.push(i);
  //       colNumber += 1;
  //     } else {
  //       const _colList = [...colList];
  //       groupList.push(_colList);
  //       colNumber = 0;
  //       colList = [];
  //       colList.push(i);
  //       colNumber += 1;
  //     }
  //     // 最后一个直接加进数组
  //     if (index === items.length - 1) {
  //       groupList.push(colList);
  //     }
  //   });

  //   const showTradeList = groupList.length < 2;

  //   return (
  //     <div className={clsx(styles.overlayWrapper, inDrawer && styles.overlayWrapperInDrawer)} ref={secondRef}>
  //       {map(groupList, (grounpItem, grounpIndex) => {
  //         return (
  //           <div key={grounpIndex} className={clsx(styles.overlayList, inDrawer && styles.overlayListInDrawer)}>
  //             {map(grounpItem, (nextItem, nextIndex) => {
  //               return (
  //                 <LinkMenuItem
  //                   key={`${grounpIndex}-${nextItem.id}`}
  //                   navItem={{ ...nextItem }}
  //                   showMenu={showMenu}
  //                   content={{
  //                     index: nextIndex,
  //                     modid,
  //                     parentIndex,
  //                     parentItem,
  //                     showTradeList,
  //                     getUrl,
  //                   }}
  //                   parentRef={secondRef}
  //                   inDrawer={inDrawer}
  //                   {...props}
  //                 />
  //               );
  //             })}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // }
  return null;
};

export default Overlay;
