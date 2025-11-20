/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'packages/header/components/ResizeObserver';
import clsx from 'clsx';
import loadable from '@loadable/component';
import { find, includes, throttle } from 'lodash-es';
import { useIsomorphicLayoutEffect } from 'hooks'
import RestrictNotice from '../RestrictNotice';
import styles from './styles.module.scss'

const MaintenanceNotice = loadable(() => import('../MaintenanceNotice'));

interface HeadRoomProps {
  children: React.ReactNode;
  miniMode?: boolean;
  maintenance?: any;
  pathname?: string;
  maintainancePath?: string;
  showMaintenance?: boolean;
  onCloseMaintenance?: () => void;
  topInsertRender?: () => React.ReactNode;
  userInfo?: any;
  currentLang?: string;
  restrictNoticeStayDuration?: number;
}

const HeadRoom = ({ children, miniMode, ...otherProps }: HeadRoomProps) => {
  const {
    maintenance,
    pathname,
    maintainancePath,
    showMaintenance,
    onCloseMaintenance,
    topInsertRender,
    userInfo,
    currentLang,
    restrictNoticeStayDuration,
  } = otherProps || {};

  const [roomHeight, setRoomHeight] = useState(0);
  const fixedRef = useRef<HTMLDivElement>(null);

  const isShowMaintenance = useMemo(() => {
    if (!showMaintenance) return false;
    if (!pathname || !maintainancePath || !maintenance) return false;
    // 主站 首页/行情/交易/资产界面才需要显示停机公告
    const matchPath = find(maintainancePath, ({ path }) => path === pathname);
    if (matchPath) {
      return (
        maintenance.maintenance === true && includes(maintenance.pcNoticeLocation, matchPath.code)
      );
    }
    return false;
  }, [pathname, maintenance, maintainancePath, showMaintenance]);

  const closeShow = useCallback(() => {
    if (typeof onCloseMaintenance === 'function') {
      onCloseMaintenance();
    }
  }, [onCloseMaintenance]);

  useIsomorphicLayoutEffect(() => {
    const dom = fixedRef.current as HTMLElement;
    setRoomHeight(dom.offsetHeight);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    throttle(({ height }) => {
      if (height !== roomHeight) {
        setRoomHeight(height);
      }
    }, 300),
    [roomHeight],
  );

  // Header中的RestrictNotice，不能传入dva，会重复执行
  return (
    <div style={{height: `${roomHeight}px`}} data-class="headerRoomWrapper">
      <ResizeObserver onResize={onResize}>
        <div className={clsx('gbiz-headeroom', styles.headerRoom)} ref={fixedRef}>
          {isShowMaintenance ? (
            <MaintenanceNotice maintenance={maintenance} closeShow={closeShow} />
          ) : (
            <RestrictNotice
              userInfo={userInfo}
              pathname={pathname}
              currentLang={currentLang}
              restrictNoticeStayDuration={restrictNoticeStayDuration}
            />
          )}
          {/* 插入的额外内容 */}
          {typeof topInsertRender === 'function' ? topInsertRender() : null}
          {children}
        </div>
      </ResizeObserver>
    </div>
  );
};

export default HeadRoom;
