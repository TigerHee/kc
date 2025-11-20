/**
 * Owner: willen@kupotech.com
 */
import { useNotification } from '@kux/mui-next';
import _ from 'lodash-es';
import React from 'react';
import useLang from 'hooks/useLang';
import { useNoticeNoticeStore } from '../models/notice';

interface PublicNoticeProps {
  notification: any;
  publicNotice: any[];
  setToast: (payload: any) => void;
  removeKeyInGroup: (params: { groupName: string; key: string }) => void;
  consume: (params: { ids: number[] }) => void;
  isRTL: boolean;
}

class PublicNotice extends React.Component<PublicNoticeProps> {
  // 消息模型队列里已经消费过了的最大ID
  comsumeId = 0;

  componentDidMount() {
    const { publicNotice } = this.props;
    this.messageEffect(publicNotice);
  }

  componentDidUpdate(prevProps) {
    const { publicNotice } = this.props;
    if (prevProps.publicNotice !== publicNotice) {
      this.messageEffect(publicNotice);
    }
  }

  messageEffect = (noticeMessages: any[] = []) => {
    const comsumedIds: number[] = [];

    _.each(noticeMessages, item => {
      const { type, extra, id } = item;
      const _msg = item.message;

      // 只消费未处理过的消息
      if (id <= this.comsumeId) {
        return true;
      }
      this.comsumeId = id;
      comsumedIds.push(id);

      switch (type) {
        case 'message.success':
        case 'message.info':
        case 'message.warn':
        case 'message.error':
        case 'message.loading':
        case 'message.toast':
          this.messageNotice(type, [_msg, ...extra]);
          break;
        case 'notification.success':
        case 'notification.info':
        case 'notification.warn':
        case 'notification.error':
        case 'notification.open':
          this.notificationNotice(type, {
            message: _msg,
            ...extra,
          });
          break;
        case 'notification.close':
          this.closeNotification(extra.key);
          break;
        default:
          console.warn(`${type} is not a valid message show type`);
          break;
      }
    });

    // consume
    if (comsumedIds.length) {
      this.props.consume({ ids: comsumedIds });
    }
  };

  // 关闭某个key指向的Notification
  closeNotification = key => {
    const { notification } = this.props;
    if (key !== undefined) {
      notification.close(key);
    }
  };

  // notification关闭的callback
  handleClose = (groupName, key) => {
    this.props.removeKeyInGroup({ groupName, key });
  };

  messageNotice = (type: string, _args: any[] = []) => {
    const _method = type.split('.')[1];
    this.props.setToast({
      type: _method,
      message: _args[0],
    });
  };

  notificationNotice = (type: string, _props: any = {}) => {
    const { notification } = this.props;
    const _method = type.split('.')[1];
    const { groupName, ...notifyProps } = _props;
    const { isRTL } = this.props;

    const onCloseConfig =
      groupName && notifyProps.key !== undefined
        ? {
            onClose: this.handleClose.bind(this, groupName, notifyProps.key),
          }
        : {};
    if (typeof notification[_method] === 'function') {
      // fix notification click
      if (typeof _props.onClick === 'function') {
        notifyProps.message = (
          <div className="pointer" onClick={_props.onClick}>
            {_props.message}
          </div>
        );
        notifyProps.description = (
          <div className="pointer" onClick={_props.onClick}>
            {_props.description}
          </div>
        );
      }
      notification[_method]({
        ...onCloseConfig,
        ...notifyProps,
        placement: isRTL ? 'top-left' : 'top-right',
      });
    } else {
      console.warn(`notification.${_method} is not function`);
    }
  };

  render() {
    return null;
  }
}

export default props => {
  const publicNotice = useNoticeNoticeStore(state => state.publicNotice);
  const setToast = useNoticeNoticeStore(state => state.setToast);
  const removeKeyInGroup = useNoticeNoticeStore(state => state.removeKeyInGroup);
  const consume = useNoticeNoticeStore(state => state.consume);
  const { isRTL } = useLang();
  const notification = useNotification();

  return (
    <PublicNotice
      {...props}
      notification={notification}
      publicNotice={publicNotice}
      setToast={setToast}
      removeKeyInGroup={removeKeyInGroup}
      consume={consume}
      isRTL={isRTL}
    />
  );
};
