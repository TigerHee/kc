/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@kufox/mui';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import { _t } from 'utils/lang';
import { getShareBtns } from './config';
import styles from './style.less';

const SharePc = props => {
  const {
    open = false,
    className = '',
    rootProps = {},
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    poster = '',
    createImg = () => {},
    shareClick = () => {},
    maskClose = true,
    roundBorder = false,
  } = props || {};
  const { message } = useSnackbar();

  const shareBtns = useMemo(
    () => {
      return getShareBtns(shareUrl, shareTitle);
    },
    [shareUrl, shareTitle],
  );

  return (
    <Dialog
      className={`${styles.sharePc} ${roundBorder ? styles.roundBorder : ''} ${className}`}
      rootProps={rootProps}
      showCloseX
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title={_t('inviteFriend.share')}
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
          return name === 'Copy' ? (
            <CopyToClipboard
              key={name}
              text={`${shareTitle} ${shareUrl}`}
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
    </Dialog>
  );
};

export default SharePc;
