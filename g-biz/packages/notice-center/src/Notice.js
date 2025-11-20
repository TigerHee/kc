/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo, useEffect } from 'react';
import { ICNotificationOutlined } from '@kux/icons';
import { styled, useTheme, Portal } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import NoSSG from './components/NoSSG';
import { clickGaName, siteidGaName } from './config';
import { gaClickNew, trackClick } from './utils/ga';
import NoticeBar from './NoticeBar';
import PublicNotice from './components/PublicNotice';

const StyleNotice = styled.span(({ theme }) => ({
  width: '40px',
  height: '40px',
  background: theme.colors.cover4,
  marginLeft: '-12px',
  borderRadius: '50%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    '& svg': {
      fill: theme.colors.primary,
    },
  },
  '[dir="rtl"] &': {
    marginLeft: '0px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '32px',
    height: '32px',
    lineHeight: '32px',
    fontSize: '14px',
    '& svg': {
      width: '16px',
      height: '16px',
    },
  },
}));

const StyleCount = styled.span(({ theme, width, borderRadius }) => ({
  position: 'absolute',
  top: '-3px',
  left: '30px',
  height: 16,
  borderRadius,
  border: `1px solid ${theme.colors.background}`,
  width,
  background: theme.colors.primary,
  color: theme.colors.textEmphasis,
  padding: '0 4px',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 600,
  fontSize: 10,
  zoom: 0.85,
  [theme.breakpoints.down('sm')]: {
    top: '-6px',
    left: '26px',
  },
}));

export default function NoticeCenter({ children, onShow }) {
  const count = useSelector((state) => state.notice_event_notice_center.count);
  const theme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: 临时注释，后续恢复
    // dispatch({ type: 'notice_event_notice_center/pullUserKyc' });
  }, []);

  const onShowNotice = () => {
    if (onShow) {
      onShow();
    }
    const { zE } = window;
    if (zE) {
      zE('webWidget', 'hide');
    }
    dispatch({
      type: 'notice_event_notice_center/update',
      payload: { barVisible: true },
    });
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
    <StyleNotice onClick={onShowNotice} theme={theme}>
      <ICNotificationOutlined size={20} color={colors.text} />
      {+count ? (
        <StyleCount {...noticeCountStyle} theme={theme}>
          {count > 99 ? '99+' : count}
        </StyleCount>
      ) : null}
    </StyleNotice>
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
