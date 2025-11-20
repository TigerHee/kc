/**
 * Owner: willen@kupotech.com
 */
import { ICArrowRight2Outlined, ICCloseOutlined } from '@kux/icons';
import { useTheme } from '@kux/mui-next';
import React from 'react';
import showDatetime from '../../utils/showDatetime';
import { TYPE_MAP as _TYPE_MAP } from '../config';
import { useNoticeCenterStore } from 'packages/notice-center/model';
import clsx from 'clsx';
import { useRouter } from 'kc-next/compat/router';
import styles from './styles.module.scss';

class MsgPanel extends React.Component<{
  setDelete: (params: { eventIds: string[] }) => void;
  setRead: (params: { eventIds: string[] }) => void;
  type: string;
  read: boolean;
  sendTime: string;
  title: string;
  content: string;
  messageContext: { context: any; webActionUrl: string; id: string };
  theme: any;
  router: any;
}> {
  handleClickDelete = (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.setDelete({
      eventIds: [eventId],
    });
  };

  handleClickPanel = async (read, eventId) => {
    const TYPE_MAP = _TYPE_MAP(process.env.LEGACY ? window.noticePushTo : this.props.router.push);
    const {
      type,
      messageContext: { context, webActionUrl },
    } = this.props;
    if (!read) {
      this.props.setRead({
        eventIds: [eventId],
      });
    }

    // 配置跳转地址情况, 使用 _default hookClick, 未配置跳转地址情况，调用相应templateCode下 hookClick
    const uiConfig = (webActionUrl ? TYPE_MAP._default : TYPE_MAP[type]) || {};
    if (typeof uiConfig.hookClick === 'function') {
      uiConfig.hookClick(context, webActionUrl);
    }
  };

  render() {
    const { type, read, sendTime, title, content, messageContext, theme } = this.props;
    const TYPE_MAP = _TYPE_MAP(process.env.LEGACY ? window.noticePushTo : this.props.router.push);
    const msgTypeConfig = TYPE_MAP[type] || TYPE_MAP._default;

    return (
      <div
        onClick={() => {
          this.handleClickPanel(read, messageContext.id);
        }}
        className={styles.MsgPanelWrapper}
      >
        <div className={styles.IconWrapper}>
          {msgTypeConfig.icon}
          {!read && (
            <div className={styles.UnReadWrapper}>
              <div className={styles.UnReadDot} />
            </div>
          )}
        </div>
        <div className={styles.ContentWrapper}>
          <div className={styles.MsgHead}>
            <span className={styles.TitleWrapper}>
              <span className={clsx(styles.TitleText, 'msgTitle')}>
                {title}
                <ICArrowRight2Outlined
                  className={clsx(styles.ArrowRight, 'arrow-right')}
                  size={16}
                  color={theme.colors.primary}
                />
              </span>
              <ICCloseOutlined
                size={12}
                onClick={e => this.handleClickDelete(e, messageContext.id)}
                color={theme.colors.icon40}
                className="close-icon"
              />
            </span>
            <span className={styles.Time}>{showDatetime(sendTime, 'HH:mm')}</span>
          </div>
          <div className={styles.MsgInfo}>{content}</div>
        </div>
      </div>
    );
  }
}

export default props => {
  const theme = useTheme();
  const setDelete = useNoticeCenterStore(state => state.setDelete);
  const setRead = useNoticeCenterStore(state => state.setRead);
  const router = useRouter();

  return <MsgPanel theme={theme} setDelete={setDelete} setRead={setRead} router={router} {...props} />;
};
