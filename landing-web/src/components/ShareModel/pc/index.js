/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@kufox/mui';
import { message } from 'antd';
import { getShareBtns } from './config';
import { _t } from 'utils/lang';
import down from 'assets/share/pc/down.svg';
import copyImg from 'assets/share/pc/copyBtn.svg';
import styles from './style.less';

const SharePc = (props) => {
  const {
    open = false,
    className = '',
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    poster = '',
    isZh = false,
    createImg = () => {},
    shareClick = () => {},
    maskClose = true,
    showCopy = false,
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
      title={_t('o69mh4adzBJvYPXrt9mSvE')}
      cancelText=""
      okText=""
      maskClosable={maskClose}
    >
      <div className={styles.content}>
        <img className={styles.poster} src={poster} alt="poster" />
        {showCopy ? (
          <CopyToClipboard
            text={decodeURIComponent(`${shareTitle} ${shareUrl}`)}
            onCopy={() => {
              if (shareTitle || shareUrl) {
                message.success(_t('copy.success'));
              }
            }}
          >
            <img className={styles.copyIcon} src={copyImg} alt="copy" />
          </CopyToClipboard>
        ) : null}
        <img className={styles.downIcon} src={down} alt="down" onClick={createImg} />
      </div>
      <div className={styles.shareView}>
        {shareBtns.map((item) => {
          const { name = '', icon, url, gaKey = '' } = item || {};
          return icon ? (
            <div
              className={styles.shareItem}
              // target="_blank"
              // rel="noopener noreferrer"
              key={name}
              // href={url}
              onClick={() => {
                shareClick(url, gaKey, name);
              }}
            >
              <img src={icon} alt={name} />
            </div>
          ) : (
            <span className={styles.shareItem} style={{ cursor: 'default' }} key={name} />
          );
        })}
      </div>
    </Dialog>
  );
};

export default SharePc;
