/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, forwardRef } from 'react';
import { Dialog } from '@kufox/mui';
import { CloseOutlined } from '@kufox/icons';
import { _t } from 'utils/lang';
import _ from 'lodash';
import loadable from '@loadable/component';
import { getShareBtns } from './config';
import longPressIcon from 'assets/share/mobile/long_press.png';
import styles from './style.less';

const GbizShareModuleLoadable = loadable.lib(() => System.import('@remote/share'));

const ShareMobile = (props) => {
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
    // createImg = () => {},
    maskClick = () => {},
    shareClick = () => {},
    ads = {},
  } = props || {};

  const shareBtns = useMemo(() => {
    return getShareBtns(shareUrl, shareTitle);
  }, [shareUrl, shareTitle]);

  // 轮播组件
  const ShareCarousel =  props.GbizShareModule?.ShareCarousel || <div className={styles.topTitle}>{_t('o69mh4adzBJvYPXrt9mSvE')}</div>;
  const isShowModalTitle = _.isEmpty(ads)

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
            <div className={styles.longPressView} onClick={_stop}>
              <img src={longPressIcon} alt="long-press" />
              <span>{isZh ? '长按下载图片至本地' : 'Press and hold to download'}</span>
            </div>
          </div>
        </div>
        <div className={styles.shareView}>
          <div className={styles.top}>
            {isShowModalTitle ? (
              <div className={styles.topTitle}>{_t('o69mh4adzBJvYPXrt9mSvE')}</div>
            ) : (
              <div className={styles.adsWrap}>
                <ShareCarousel ads={ads} />
              </div>
            )}
            <CloseOutlined iconId="close" className={styles.closeIcon} onClick={onCancel} />
          </div>
          <div className={styles.shareList}>
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
                  <span>{name}</span>
                </div>
              ) : (
                <div className={styles.shareItem} key={name}>
                  <img style={{ opacity: 0 }} alt="" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const ShareMobileLoadable = forwardRef((props, ref) => {
  const { children, ...rest } = props || {};
  return (
    <GbizShareModuleLoadable>
      {(module) => {
        return (
          <ShareMobile
            {...rest}
            ref={ref}
            GbizShareModule={module}
          >
            {children}
          </ShareMobile>
        )
      }}
    </GbizShareModuleLoadable>
  )
});

export default ShareMobileLoadable;
