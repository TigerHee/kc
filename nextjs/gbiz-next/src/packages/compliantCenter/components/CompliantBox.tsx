/**
 * Owner: terry@kupotech.com
 */
import React from 'react';
import { IS_SSG_ENV, IS_SERVER_ENV } from 'kc-next/env';
import { useCompliantShow } from '../hooks';

const CompliantBoxInner = ({ spm, children = null }: any = {}) => {
  // 显示控制逻辑
  const show = useCompliantShow(spm, { track: true });
  return show ? children : null;
};

interface CompliantBoxProps {
  spm: string;
  children?: React.ReactNode;
}

export const CompliantBox = (props: CompliantBoxProps) => {
  if (IS_SSG_ENV || IS_SERVER_ENV) return null;
  return (
    <CompliantBoxInner {...props} />
  );
};
