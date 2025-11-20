import React, { useRef } from 'react';
import styles from './index.module.scss';
import { map } from 'lodash-es';
import {
  LocalNavType,
  type NavigationBanner,
  type NavType,
  type NavProps,
  type RenderNavType,
  type FirstLevelNavigation,
} from '../types';

import NavList from './NavList';
import Banner from './Banner';
import SearchColumn from './SearchColumn';
import { checkIsTwoBanner, getNavTypeClassFromGroupList } from '../utils';
import clsx from 'clsx';
import { OVERLAY_CONTENT_FLAG } from './constants';
import { ACTIVITY_BANNER_CLASS } from 'packages/header/components/TradeList/utils';
import { trackClick } from 'tools/sensors';

type ShowMenuType = {
  id?: string;
  name?: string;
};

type Props = NavProps & {
  navigationList: RenderNavType[][];
  modid: string;
  parentIndex: number;
  parentItem: FirstLevelNavigation;
  getUrl?: (item: NavType) => string;
  showMenu?: ShowMenuType;
  navigationFunctionBanner?: NavigationBanner;
  navigationActivityBanner?: NavigationBanner;
};
const NavigationColumn: React.FC<Props> = ({ navigationList = [], ...props }) => {
  const groupRef = useRef<HTMLDivElement>(null);

  const showTradeList = navigationList.length < 2;
  const isTwoBanner = checkIsTwoBanner(navigationList);

  return (
    <div id={OVERLAY_CONTENT_FLAG} className={clsx([styles.overlayContainer])} ref={groupRef}>
      <div className={styles.overlayWrapper} ref={groupRef}>
        {map(navigationList, (grounpItem: RenderNavType[], grounpIndex) => {
          const navTypeClassName = getNavTypeClassFromGroupList(grounpItem);

          const onClick = e => {
            e.stopPropagation();
            e.preventDefault();
            const webUrl = (grounpItem[0] as NavigationBanner)?.webUrl || '';
            if (navTypeClassName.indexOf(ACTIVITY_BANNER_CLASS) > -1) {
              trackClick(['navigationDropRightBanner', '1'], {
                postId: grounpItem[0]?.id,
                url: webUrl,
              });
              window.location.href = webUrl;
            }
          };

          return (
            <div
              key={grounpIndex}
              onClick={onClick}
              className={clsx([
                styles.headerOverlayColumn,
                styles.overlayList,
                styles.scroll,
                navTypeClassName,
                isTwoBanner && styles.hasTwoBanner,
              ])}
            >
              {map(grounpItem, (nextItem: RenderNavType, nextIndex) => {
                if (nextItem?.localNavType === LocalNavType.search) {
                  return (
                    <SearchColumn
                      parentRef={groupRef}
                      key={nextItem.id || nextIndex}
                      showIndex={nextIndex}
                      item={nextItem as NavType}
                      {...props}
                    />
                  );
                }

                if (nextItem?.localNavType === LocalNavType.banner) {
                  return (
                    <Banner
                      isTwoBanner={isTwoBanner}
                      key={nextItem?.id || nextIndex}
                      showIndex={nextIndex}
                      item={nextItem as NavigationBanner}
                      {...props}
                    />
                  );
                }

                // 菜单配置组件渲染
                return (
                  <NavList
                    navigationItem={nextItem as NavType}
                    key={nextItem?.id || nextIndex}
                    showIndex={nextIndex}
                    showTradeList={showTradeList}
                    {...props}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationColumn;
