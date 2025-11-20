/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@kufox/mui';
import { message } from 'antd';
import { getShareBtns } from './config';
import { _t } from 'utils/lang';
import styles from './style.less';

const SharePc = props => {
  const {
    open = false,
    className = '',
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    poster = '',
    isZh = false,
    createImg = () => {},
    shareClick = () => {},
    maskClose = true,
  } = props || {};

  const shareBtns = useMemo(() => {
    return getShareBtns(shareUrl, shareTitle);
  }, [shareUrl, shareTitle]);

  return (
    <Dialog
      className={`${styles.sharePc} ${className}`}
      maxWidth="sm"
      showCloseX
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title={isZh ? '分享有礼' : 'Share to Friends'}
      cancelText=""
      okText=""
      maskClosable={maskClose}
    >
      <div className={styles.content}>
        <img className={styles.poster} src={poster} alt="poster" />
      </div>
      <div className={styles.shareView}>
        {shareBtns.map(item => {
          const { name = '', icon, url, gaKey = '' } = item || {};
          return  name ==='Copy'? 
          <CopyToClipboard
            text={decodeURIComponent(`${shareTitle} ${shareUrl}`)}
            onCopy={() => {
              if (shareTitle || shareUrl) {
                message.success(_t('copy.success'));
              }
            }}
          >
            <div
                className={styles.shareItem}
                key={name}
                onClick={() => {
                  shareClick(url, gaKey);
                }}
              >
                <img src={icon} alt={name} />
                <span>{name}</span>
              </div>
          </CopyToClipboard>
          : <div
              className={styles.shareItem}
              key={name}
              onClick={() => {
                name ==='Save' ? createImg() : shareClick(url, gaKey);
              }}
            >
              <img src={icon} alt={name} />
              <span>{name}</span>
            </div>
       ;
        })}
      </div>
    </Dialog>
  );
};

export default SharePc;
