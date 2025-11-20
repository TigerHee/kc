/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@kufox/mui';
import { message } from 'antd';
import { getShareBtns } from './config';
import { _t } from 'utils/lang';
import cls from 'classname';
import down from 'assets/share/pc/down.svg';
import copyImg from 'assets/share/pc/copyBtn.svg';
import copyIcon from 'assets/share_dark/pc/copy.svg';
import copyIcon2 from 'assets/share_dark/pc/copy-other.svg';
import downloadIcon from 'assets/share_dark/pc/download.svg';
import downloadIcon2 from 'assets/share_dark/pc/download-other.svg';
import styles from './style.less';

const SharePc = props => {
  const {
    open = false,
    className = '',
    onCancel = () => { },
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    poster = '',
    isZh = false,
    createImg = () => { },
    shareClick = () => { },
    maskClose = true,
    showCopy = false,
    showDownload = false,
    onlyDownloadChanel, // 只显示下载图片弹窗
    openSocial = () => { },
    options,
  } = props || {};

  const { withWhite = false, webClassNames = '' } = options || {};
  const shareBtns = useMemo(() => {
    return getShareBtns(shareUrl, shareTitle);
  }, [shareUrl, shareTitle]);

  const downloadPoster = useCallback((e) => {
    createImg(e);
    openSocial(onlyDownloadChanel);
    setTimeout(() => {
      onCancel();
    }, 300);
  }, [openSocial, onlyDownloadChanel, createImg, onCancel]);

  const title = !onlyDownloadChanel ? _t('inviteFriend.share') : _t('gyUKyDBhkNY3p4wfh8J9jD');
  return (
    <Dialog
      className={
        cls(styles.sharePc, className, webClassNames, {
          [styles.withWhite]: withWhite
        })
      }
      maxWidth="sm"
      showCloseX
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title={title}
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
        {
          showDownload && <img className={styles.downIcon} src={down} alt="down" onClick={createImg} />
        }
      </div>
        {
          !onlyDownloadChanel && (
            <div className={styles.shareView}>
              {shareBtns.map(item => {
                const { name = '', icon, url, gaKey = '' } = item || {};
                return icon ? (
                  <div
                    className={cls(styles.shareItem, {
                      [styles.white]: withWhite
                    })}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    key={name}
                    // href={url}
                    onClick={() => {
                      shareClick(url, gaKey, name);
                    }}
                  >
                    <img src={icon} alt={name} />
                    <span>{name}</span>
                  </div>
                ) : (
                  <span className={styles.shareItem} style={{ cursor: 'default' }} key={name} />
                );
              })}
              {/* copy link */}
              <div
                className={styles.shareItem}
              >
                <CopyToClipboard
                  text={shareUrl}
                  onCopy={() => message.success(`${_t('choice.invite.modal.invite.cpoy.success')}`)}>
                  <div className={cls(styles.copyShareItem, {
                    [styles.white]: withWhite
                  })}>
                    <img src={withWhite ? copyIcon2 : copyIcon} alt="copy-icon" />
                    <span>{_t('copy')}</span>
                  </div>
                </CopyToClipboard>
              </div>
              {/* download link */}
              <div
                className={cls(styles.shareItem, {
                  [styles.white]: withWhite
                })}
                onClick={(e) => {
                  createImg(e);
                }}
              >
                <img src={withWhite ? downloadIcon2 : downloadIcon} alt="download-icon" />
                <span>{_t('newcomerGuide.downloadApp.button')}</span>
              </div>
              </div>
          )
        }
        {
          onlyDownloadChanel && (
            <section className={styles.download}>
                <span
                  onClick={downloadPoster}
                >
                  {_t('dcu7bFqYdWMnPbiUs7hJuS')}
                </span>
            </section>
          )
        }
    </Dialog>
  );
};

export default SharePc;
