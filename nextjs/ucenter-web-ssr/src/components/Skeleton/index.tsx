import React from 'react';
import styles from './styles.module.scss';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}

export default function Skeleton({ width, height, borderRadius, margin }: SkeletonProps) {
  const style = {
    width: width || '100%',
    height: height || '28px',
    borderRadius: borderRadius || '4px',
    margin: margin || '0',
  };

  return <div className={styles.skeletonBase} style={style} />;
}
