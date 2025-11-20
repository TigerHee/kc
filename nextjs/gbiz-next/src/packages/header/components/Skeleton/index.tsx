import React, { CSSProperties, FC } from 'react';
import { useTheme } from '@kux/design';
import clsx from 'clsx';
import styles from './styles.module.scss'
import { usePageProps } from 'provider/PageProvider';

const LIGHT_LINER_GRADIENT_BACKGROUND_COLOR = `linear-gradient(
  90deg,
  rgba(93, 103, 122, 0.04) 25%,
  rgba(29, 29, 29, 0.08) 37%,
  rgba(29, 29, 29, 0.04) 63%
)
`;

const DARK_LINER_GRADIENT_BACKGROUND_COLOR = `linear-gradient(
  90deg,
  rgba(243, 243, 243, 0.08) 25%,
  rgba(129, 129, 129, 0.3) 37%,
  rgba(243, 243, 243, 0.08) 63%
)
`;

interface SkeletonItemProps {
  style?: CSSProperties;
  className?: string;
}

const Skeleton: FC<SkeletonItemProps> = ({ style, className }) => {
  const theme = usePageProps()?.theme;
  return <div style={{
    backgroundImage: theme === 'light'
      ? LIGHT_LINER_GRADIENT_BACKGROUND_COLOR
      : DARK_LINER_GRADIENT_BACKGROUND_COLOR,
    ...style
  }} className={clsx(className, styles.skeletonItem)} />;
};

export default Skeleton;
