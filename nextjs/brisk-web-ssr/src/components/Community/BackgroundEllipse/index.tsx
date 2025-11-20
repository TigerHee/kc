import React from 'react';
import BackgroundEllipseIcon from '@/static/banner/background-ellipse.svg';
import BackgroundEllipseDarkIcon from '@/static/banner/background-ellipse-dark.svg';

import styles from './index.module.scss';
import clsx from 'clsx';
import useTheme from '@/hooks/useTheme';

type Props = {
  isHover?: boolean;
};
const BackgroundEllipse: React.FC<Props> = ({ isHover = false }) => {

  const {theme} = useTheme();

  return (
    <img
      src={theme === 'dark' ? BackgroundEllipseDarkIcon : BackgroundEllipseIcon} alt="background-ellipse"
      className={clsx(styles.ellipse, isHover && styles.ellipseHover)}
    />
  );
};

export default BackgroundEllipse;
