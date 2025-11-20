/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo, type ReactNode, useEffect } from 'react';
import { ICNotificationOutlined } from '@kux/icons';
import { Portal } from '@kux/mui-next';
import { IS_CLIENT_ENV } from 'kc-next/env';
import NoSSG from 'tools/No-SSG';
import { clickGaName, siteidGaName } from '../config';
import { gaClickNew } from '../utils/ga';
import { trackClick } from 'tools/sensors';
import NoticeBar from '../NoticeBar';
import PublicNotice from '../components/PublicNotice';
import styles from './styles.module.scss';
import { useNoticeCenterStore } from '../model';

type Props = {
  children: ReactNode;
  onShow?: () => any;
};

export default function NoticeCenter({ children, onShow }: Props) {
  const count = useNoticeCenterStore(state => state.count) || 0;
  const updateNoticeCenter = useNoticeCenterStore(state => state.updateNoticeCenter);
  const subscriptionWs = useNoticeCenterStore(state => state.subscriptionWs);

  const onShowNotice = () => {
    if (onShow) {
      onShow();
    }
    const { zE } = window;
    if (zE) {
      zE('webWidget', 'hide');
    }
    updateNoticeCenter?.({ barVisible: true });
    gaClickNew(clickGaName, {
      siteid: siteidGaName,
      pageid: 'homepage',
      modid: 'notice',
      eleid: 1,
    });
    trackClick(['notice', '1']);
  };

  const noticeCountStyle = useMemo(() => {
    if (count < 10) {
      return {
        width: 16,
        borderRadius: '50%',
      };
    }
    if (count <= 99) {
      return {
        width: 22,
        borderRadius: 8,
      };
    }
    if (count > 99) {
      return {
        width: 28,
        borderRadius: 12,
      };
    }
    return {
      width: 16,
      borderRadius: '50%',
    };
  }, [count]);

  const notice = (
    <span className={styles.StyleNotice} onClick={onShowNotice}>
      <ICNotificationOutlined size={16} color="var(--kux-text)" />
      {+count ? (
        <span className={styles.StyleCount} style={noticeCountStyle}>
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </span>
  );

  const _children = children
    ? React.cloneElement(children, {
        onClick: () => {
          onShowNotice();
          if (children.props.onClick) {
            children.props.onClick();
          }
        },
      })
    : notice;

  useEffect(() => {
    if (!IS_CLIENT_ENV) {
      return;
    }
    subscriptionWs?.();
  }, [subscriptionWs]);

  return (
    <>
      {_children}
      <NoSSG>
        <Portal>
          <NoticeBar />
          <PublicNotice />
        </Portal>
      </NoSSG>
    </>
  );
}
