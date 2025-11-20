import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTheme } from '@kux/design';
import styles from './styles.module.scss';
import type { NavType } from '../types';
import clsx from 'clsx';
import { usePageProps } from 'provider/PageProvider';

type Props = {
  navItem: NavType;
  inDrawer?: boolean;
};
const NavIcon: React.FC<Props> = ({ navItem, inDrawer }) => {
  if (inDrawer) {
    return (
      <div className={styles.menuItemDotWrapper}>
        <div className={styles.menuItemDot} />
      </div>
    );
  }

  const theme = useTheme();
  const src = theme === 'light' ? navItem.daySrcImgMap?.icons : navItem.nightSrcImgMap?.icons;
  if (!src) {
    return null;
  }

  return (
    <div className={clsx([styles.menuItemIcon, inDrawer && styles.drawerMenu])}>
      <LazyLoadImage src={src} className={styles.menuItemImg} alt="" />
    </div>
  );
};

export default React.memo(NavIcon);
