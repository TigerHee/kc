/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Skeleton component
 */

import React from 'react';
import { clx } from '@/common';
import './style.scss';

export interface ISkeletonBaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface ISkeletonAvatarProps extends ISkeletonBaseProps {
  size?: number;
}

export interface ISkeletonNodeProps extends ISkeletonBaseProps {
  width?: string | number;
  height?: string | number;
}

export interface ISkeletonInputProps extends ISkeletonBaseProps {
  width?: string | number;
  height?: string | number;
}

/**
 * Skeleton Avatar component
 */
function SkeletonAvatar({ size = 32, className, style, ...rest }: ISkeletonAvatarProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clx('kux-skeleton-avatar', className)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        ...style,
      }}
      {...rest}
    />
  );
}

/**
 * Skeleton Node component
 */
function SkeletonNode({ 
  width = 100, 
  height = 16, 
  className, 
  style,
  ...rest
}: ISkeletonNodeProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clx('kux-skeleton-node', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '4px',
        ...style,
      }}
      {...rest}
    />
  );
}

/**
 * Skeleton Input component
 */
function SkeletonInput({ 
  width = 320, 
  height = 32, 
  className, 
  style,
  ...rest
}: ISkeletonInputProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clx('kux-skeleton-input', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: '18px',
        ...style,
      }}
      {...rest}
    />
  );
}

/**
 * Skeleton component
 */
export function Skeleton(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}

Skeleton.Avatar = SkeletonAvatar;
Skeleton.Node = SkeletonNode;
Skeleton.Input = SkeletonInput;
