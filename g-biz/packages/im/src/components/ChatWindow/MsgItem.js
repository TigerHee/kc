/**
 * Owner: iron@kupotech.com
 */
import React, { useRef, useCallback } from 'react';
import { makeStyles } from '@kc/mui/lib/styles';
import cls from 'clsx';
import { Spin } from '@kc/mui';
import { get } from 'lodash';
import { MessageContentType } from './types';
import DefaultAvatar from '../../assets/default_avatar.svg';
import SendFailedIcon from '../../assets/send-failed.svg';

const useStyle = makeStyles(() => {
  return {
    msgItem: {
      marginBottom: 20,
      display: 'flex',
    },
    isMine: {
      flexDirection: 'row-reverse',
    },
    userIcon: {
      width: 32,
      height: 32,
      borderRadius: '100%',
      marginRight: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(132,168,211,0.20)',
      flexShrink: 0,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: '100%',
    },
    msgWrapper: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 8,
    },
    mineMsgWrapper: {
      flexDirection: 'row-reverse',
      marginLeft: 8,
      marginRight: 0,
    },
    sendFailedIcon: {
      width: 20,
      height: 20,
      cursor: 'pointer',
      flexShrink: 0,
    },
    userMsg: {
      padding: 12,
      background: '#fff',
      // boxShadow: '0 2px 12px 0 rgba(0,20,42,0.08)',
      fontSize: 15,
      borderRadius: 6,
      wordBreak: 'break-all',
    },
    msgImg: {
      width: '100%',
      height: 120,
      objectFit: 'contain',
    },
    read: {
      height: 18,
      fontSize: 12,
      marginRight: 2,
      marginTop: 2,
      textAlign: 'right',
      color: 'rgb(36, 174, 143)',
    },
    hasRead: {
      color: 'rgba(0, 0, 0, .4)',
    },
    mineIcon: {
      marginRight: 0,
      marginLeft: 12,
    },
    mineMsg: {
      background: '#24AE8F',
      color: '#fff',
    },
    imgMsg: {
      background: '#fff',
    },
    loadingArea: {
      width: 24,
      height: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      paddingRight: 0,
      paddingLeft: 10,
    },
    mineLoading: {
      paddingRight: 10,
      paddingLeft: 0,
    },
    imgContainer: {
      height: '120px',
      boxSizing: 'content-box',
    },
  };
});

const MsgItem = (props) => {
  const {
    message,
    isMine,
    data,
    // read,
    error,
    loading,
    showPrevImg,
    fileMeta,
    contentType,
    onResendClick,
    currentAvatar,
    otherAvatar,
  } = props;
  const styles = useStyle();
  const imgRef = useRef(null);
  const msgRef = useRef(null);
  // const { t: _t } = useTranslation();

  const handleShowImg = useCallback(() => {
    if (contentType !== MessageContentType.FILE || !imgRef) return;
    const url = get(fileMeta, 'thumbnailUrl');
    if (url) {
      showPrevImg(url);
    }
  }, [fileMeta, contentType]);

  return (
    <div className={cls(styles.msgItem, { [styles.isMine]: isMine })}>
      <div className={cls(styles.userIcon, { [styles.mineIcon]: isMine })}>
        <img
          src={(isMine ? currentAvatar : otherAvatar) || DefaultAvatar}
          alt="user avatar"
          className={styles.avatar}
        />
      </div>
      <div>
        <div className={cls(styles.msgWrapper, { [styles.mineMsgWrapper]: isMine })}>
          <div
            className={cls(styles.userMsg, {
              [styles.mineMsg]: isMine,
              [styles.imgMsg]: contentType === MessageContentType.FILE,
            })}
            ref={msgRef}
            onClick={handleShowImg}
          >
            {contentType === MessageContentType.FILE ? (
              <img
                src={get(fileMeta, 'thumbnailUrl')}
                alt="img"
                className={styles.msgImg}
                ref={imgRef}
              />
            ) : (
              message
            )}
          </div>
          <div
            className={cls(
              styles.loadingArea,
              { [styles.mineLoading]: isMine },
              contentType === MessageContentType.FILE ? styles.imgContainer : null,
            )}
          >
            {loading && <Spin size="small" />}
            {error && (
              <img // eslint-disable-line
                src={SendFailedIcon}
                alt="send-failed"
                onClick={() => onResendClick(data.key)}
                className={styles.sendFailedIcon}
              />
            )}
          </div>
        </div>
        {/* <div className={cls(styles.read, { [styles.hasRead]: read })}>
          {isMine &&
            !loading &&
            !error &&
            (read ? _t('im.chat.msg.have.read') : _t('im.chat.msg.unread'))}
        </div> */}
      </div>
    </div>
  );
};

export default MsgItem;
