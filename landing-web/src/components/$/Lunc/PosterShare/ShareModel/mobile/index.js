/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { ArrowLeftOutlined  } from '@kufox/icons';
import { Dialog } from '@kufox/mui';
import { getShareBtns } from './config';
import styles from './style.less';
import CopyToClipboard from 'react-copy-to-clipboard';
import { message } from 'antd';
import { _t } from 'utils/lang';

const ShareMobile = props => {
  const {
    open = false,
    className = '',
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    poster = '',
    isZh = false,
    _stop = () => {},
    createImg = () => {},
    maskClick = () => {},
    shareClick = () => {},
  } = props || {};

  const shareBtns = useMemo(
    () => {
      return getShareBtns(shareUrl, shareTitle);
    },
    [shareUrl, shareTitle],
  );

  return (
    <Dialog
      className={`${styles.shareMobile} ${className}`}
      maxWidth={false}
      fullScreen={true}
      showCloseX={false}
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title=""
      cancelText=""
      okText=""
      maskClosable={false}
    >
      <div className={styles.shareContent}>
        <div className={styles.content} onClick={maskClick}>
          <div className={styles.contentCenter}>
            <img className={styles.poster} src={poster} alt="poster" onClick={_stop} />
          </div>
        </div>
        <div className={styles.shareView}>
          <div className={styles.top}>
            {isZh ? '分享有礼' : 'Share'}
            <ArrowLeftOutlined iconId="close" className={styles.closeIcon} onClick={onCancel} />
          </div>
          <div className={styles.shareList}>
            {shareBtns.map(item => {
              const { name = '', icon, url, gaKey = '' } = item || {};
              return name === 'Copy' ? (
                <CopyToClipboard
                  key={name}
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
              ) : (
                <div
                  className={styles.shareItem}
                  key={name}
                  onClick={() => {
                    name === 'Save' ? createImg() : shareClick(url, gaKey);
                  }}
                >
                  <img src={icon} alt={name} />
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ShareMobile;
