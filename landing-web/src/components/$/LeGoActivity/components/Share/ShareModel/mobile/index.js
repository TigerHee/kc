/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { message } from 'antd';
import { startsWith } from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@kufox/mui';
import { _t } from 'src/utils/lang';
import cls from 'classname';
import closeIcon from 'assets/share_dark/mobile/close.svg';
import copyIcon from 'assets/share_dark/mobile/copy-default.svg';
import copyIcon2 from 'assets/share_dark/mobile/copy-other.svg';
import { getShareBtns } from './config';
import styles from './style.less';

const prefix  = 'data:image/jpeg;base64,';

const getSrc = (base64) => {
  if (!startsWith(base64, prefix)) return (prefix + base64);
  return base64;
}


const ShareMobile = props => {
  const {
    open = false,
    className = '',
    onCancel = () => { },
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    poster = '',
    isZh = false,
    _stop = () => { },
    createImg = () => { },
    maskClick = () => { },
    shareClick = () => { },
    onlyDownloadChanel, // 只显示下载图片弹窗
    openSocial = () => { },
    options,
  } = props || {};

  const { withWhite = false } = options || {};
  const shareBtns = useMemo(() => {
    return getShareBtns(shareUrl, shareTitle);
  }, [shareUrl, shareTitle]);

  const downloadPoster = useCallback((e) => {
    openSocial(onlyDownloadChanel);
    setTimeout(() => {
      maskClick();
    }, 300);
  }, [openSocial, onlyDownloadChanel, maskClick]);

  const title = !onlyDownloadChanel ? _t('inviteFriend.share') : _t('gyUKyDBhkNY3p4wfh8J9jD');

  const _poster = useMemo(() => {
    return getSrc(poster);
  }, [poster]);

  
  return (
    <Dialog
      className={
        cls(styles.shareMobile, className)
      }
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
            <img className={styles.poster} src={_poster} alt="poster" onClick={_stop} />
            <h3 className={styles.hint}>{_t('mDiMnrRsrdGALU4bN75vcq')}</h3>
          </div>
        </div>
        <div className={cls(styles.shareView, {
          [styles.white]: withWhite,
        })}>
          <div className={styles.top}>
            <img
              src={closeIcon}
              alt='close-icon'
              className={styles.closeIcon}
              onClick={onCancel}
            />
            {title}
          </div>
          {
            !onlyDownloadChanel ? (
              <>
                <div className={styles.shareList}>
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
                      <div className={styles.shareItem} key={name}>
                        <img style={{ opacity: 0 }} alt="" />
                      </div>
                    );
                  })}
                  {/* 拷贝链接 */}
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
                </div>
              </>
            ) : null
          }
          {
            onlyDownloadChanel ? (
              <>
                <section className={styles.download}>
                  <span
                    onClick={downloadPoster}
                  >
                    {_t('mdqgaQZtJNH394yBd16eCF')}
                  </span>
                </section>
              </>
            ) : null
          }
        </div>
      </div>
    </Dialog>
  );
};

export default ShareMobile;
