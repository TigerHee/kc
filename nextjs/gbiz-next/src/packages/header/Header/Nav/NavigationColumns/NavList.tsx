import React, { useRef } from 'react';
import { map } from 'lodash-es';
import type { FirstLevelNavigation, NavType } from '../types';
import LinkMenuItem from '../LinkMenuItem';
import styles from './NavList.module.scss';
import clsx from 'clsx';
import { NAVIGATION_COLUMN_CLASS } from 'packages/header/components/TradeList/utils';
import AnimatedContent from 'packages/header/components/AnimatedContent';

type ShowMenuType = {
  id?: string;
  name?: string;
};

type Props = {
  navigationItem: NavType;
  showTradeList?: boolean;

  modid: string;
  parentIndex: number;
  parentItem: FirstLevelNavigation;
  inDrawer?: boolean;
  getUrl?: (item: NavType) => string;
  showIndex?: number;
  showMenu?: ShowMenuType;
};
const NavList: React.FC<Props> = ({
  navigationItem,
  showTradeList,
  modid,
  parentIndex,
  parentItem,
  inDrawer,
  getUrl,
  showMenu,
  showIndex = 0,
  ...props
}) => {
  const groupRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatedContent delay={0.1}>
      <div className={clsx([styles.grounpDiv, NAVIGATION_COLUMN_CLASS])}>
        <div className={styles.navGroupName}>{navigationItem?.textMap.name}</div>
        {map(navigationItem.children, (lastItem, lastIndex) => {
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
              inDrawer={false}
              {...props}
            />
          );
        })}
      </div>
    </AnimatedContent>
  );
};

export default NavList;
