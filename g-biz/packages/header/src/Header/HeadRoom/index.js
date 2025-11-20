/**
 * Owner: iron@kupotech.com
 */
import { ResizeObserver, styled, useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import { find, includes, throttle } from 'lodash';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import RestrictNotice from '../RestrictNotice';

const MaintenanceNotice = loadable(() => import('../MaintenanceNotice'));

const HeaderRoomWrapper = styled.div`
  height: ${(props) => props.roomHeight}px;
`;

const HeaderRoom = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${(props) => props.theme.colors.overlay};
  transition: background-color 0.5s ease;
`;

const HeadRoom = ({ children, miniMode, ...otherProps }) => {
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
  const fixedRef = useRef();
  const theme = useTheme();

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

  useLayoutEffect(() => {
    const dom = fixedRef.current;
    setRoomHeight(dom.offsetHeight);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    throttle((size) => {
      if (size.offsetHeight !== roomHeight) {
        setRoomHeight(size.offsetHeight);
      }
    }, 300),
    [roomHeight],
  );

  return (
    <HeaderRoomWrapper roomHeight={roomHeight} data-class="headerRoomWrapper">
      <ResizeObserver onResize={onResize}>
        <HeaderRoom theme={theme} className="gbiz-headeroom" ref={fixedRef}>
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
        </HeaderRoom>
      </ResizeObserver>
    </HeaderRoomWrapper>
  );
};

export default HeadRoom;
