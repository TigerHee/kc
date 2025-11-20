/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, useEffect, FC } from 'react';
import { useHeaderStore } from 'packages/header/Header/model';

interface LoaderComponentProps {
  children: React.ReactNode;
  show: boolean;
  fallback?: React.ReactNode;
}

const LoaderComponent:FC<LoaderComponentProps> = ({ children, show: visible, fallback }) => {
  const thunkLoaded = useHeaderStore(state => state.thunkLoaded);
  const updateHeader = useHeaderStore(state => state.updateHeader);

  useEffect(() => {
    if (visible) {
      // 全局加载
      updateHeader?.({
        thunkLoaded: true,
      });
    }
  }, [visible, updateHeader]);

  if (thunkLoaded || visible) {
    return children;
  }

  return <>{fallback}</>;
};

export default memo(LoaderComponent);
