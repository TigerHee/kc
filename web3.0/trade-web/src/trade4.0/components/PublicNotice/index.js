/**
 * Owner: borden@kupotech.com
 */
import React, { useRef, useEffect, memo } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { useSnackbar, useNotification } from '@kux/mui';
import { MaxNotification } from 'config';
import { useIsRTL } from '@/hooks/common/useLang';

/**
 * PublicNotice
 */
const PublicNotice = (props) => {
  const { ...restProps } = props;

  // 消息模型队列里已经消费过了的最大ID
  const comsumeId = useRef(0);
  const notificationIds = useRef([]);
  const notification = useNotification();
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const isRtl = useIsRTL();

  const publicNotice = useSelector((state) => state.notice.publicNotice);

  const notificationConsume = () => {
    const len = notificationIds.current.length;
    const cosumeLength = len - MaxNotification;
    if (cosumeLength > 0) {
      const _notificationIds = notificationIds.current.slice(0, cosumeLength);
      _.each(_notificationIds, (item) => {
        notification.close(item);
      });
      notificationIds.current = notificationIds.current.slice(
        cosumeLength,
        len,
      );
    }
  };

  const messageEffect = (noticeMessages = []) => {
    const comsumedIds = [];
    _.each(noticeMessages, (item) => {
      const { type, extra, id, groupName } = item;
      const _msg = item.message;
      // 只消费未处理过的消息
      if (id <= comsumeId.current) {
        return true;
      }
      comsumeId.current = id;
      comsumedIds.push(id);
      switch (type) {
        case 'message.success':
        case 'message.info':
        case 'message.warning':
        case 'message.error':
        case 'message.loading':
          messageNotice(type, { message: _msg, ...extra });
          break;
        case 'notification.success':
        case 'notification.info':
        case 'notification.warning':
        case 'notification.error':
        case 'notification.open':
          notificationNotice(type, {
            key: id,
            groupName,
            message: _msg,
            direction: isRtl ? 'rtl' : 'ltr',
            ...extra,
          });
          break;
        default:
          console.warn(`${type} is not a valid message show type`);
          break;
      }
    });

    // consume
    if (comsumedIds.length) {
      dispatch({
        type: 'notice/consume',
        payload: {
          ids: comsumedIds,
        },
      });
    }
  };

  const messageNotice = (type, _args = {}) => {
    const _method = type.split('.')[1];
    const messageProps = { ..._args };
    if (typeof message[_method] === 'function') {
      message[_method](_args.message, messageProps);
    } else {
      console.warn(`message.${_method} is not function`);
    }
  };

  const getNotificationKey = ({ key }) => {
    if (!notificationIds.current.includes(key)) {
      notificationIds.current.push(key);
      notificationConsume();
    }
  };

  const notificationNotice = (type, _props = {}) => {
    const _method = type.split('.')[1];
    const notifyProps = { ..._props };
    if (typeof notification[_method] === 'function') {
      // fix notification click
      if (typeof _props.onClick === 'function') {
        notifyProps.message = (
          <div className={'pointer'} onClick={_props.onClick}>
            {_props.message}
          </div>
        );
        notifyProps.description = (
          <div className={'pointer'} onClick={_props.onClick}>
            {_props.description}
          </div>
        );
      }
      notifyProps.action = getNotificationKey;
      notification[_method]({ ...notifyProps, placement: isRtl ? 'top-left' : 'top-right' });
    } else {
      console.warn(`notification.${_method} is not function`);
    }
  };

  useEffect(() => {
    messageEffect(publicNotice);
  }, [publicNotice]);

  return null;
};

export default memo(PublicNotice);
