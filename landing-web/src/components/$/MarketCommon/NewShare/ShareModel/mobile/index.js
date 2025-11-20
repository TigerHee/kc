/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, forwardRef } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@kufox/mui';
import CloseOutlined from '@kufox/icons/lib/components/CloseOutlined';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import { _t } from 'utils/lang';
import _ from 'lodash';
import { getShareBtns } from './config';
import styles from './style.less';
import clxs from 'classnames';
import loadable from '@loadable/component';
import { ReactComponent as CopySvg } from 'assets/share/mobile/copy.svg';
import { ReactComponent as SaveSvg } from 'assets/share/mobile/save.svg';

const GbizShareModuleLoadable = loadable.lib(() => System.import('@remote/share'));

const _ShareMobile = (props, ref) => {
  const {
    open = false,
    className = '',
    rootProps = {},
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    poster = '',
    _stop = () => {},
    createImg = () => {},
    maskClick = () => {},
    shareClick = () => {},
    darkMode = false,
    ads = {},
  } = props || {};
  const { message } = useSnackbar();

  const shareBtns = useMemo(
    () => {
      return getShareBtns(shareUrl, shareTitle);
    },
    [shareUrl, shareTitle],
  );

  // 轮播组件
  const ShareCarousel = props.GbizShareModule?.ShareCarousel || <></>;
  const isShowModalTitle = _.isEmpty(ads)

  return (
    <Dialog
      className={`${styles.shareMobile} ${className}`}
      size="fullWidth"
      showCloseX={false}
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title=""
      cancelText=""
      okText=""
      maskClosable={false}
      rootProps={rootProps}
    >
      <div className={styles.shareContent}>
        <div className={styles.content} onClick={maskClick}>
          <div className={styles.contentCenter}>
            <img className={styles.poster} src={poster} alt="poster" onClick={_stop} />
          </div>
        </div>
        <div className={clxs(styles.shareView, darkMode && styles.dark_view)}>
          <div className={styles.top}>
            {isShowModalTitle ? (
              <span>{_t('inviteFriend.share')}</span>
            ) : (
              <ShareCarousel ads={ads} />
            )}
            <CloseOutlined className={styles.closeIcon} onClick={onCancel} />
          </div>
          <div className={styles.shareList}>
            {shareBtns.map(item => {
              const { name = '', icon, url, gaKey = '' } = item || {};
              const isCopy = name === 'Copy';
              const isSave = name === 'Save';
              return isCopy ? (
                <CopyToClipboard
                  key={name}
                  text={`${shareTitle} ${shareUrl}`}
                  onCopy={() => {
                    if (shareTitle || shareUrl) {
                      message.success(_t('spea.share.toast'));
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
                    <CopySvg className={clxs(darkMode && styles.dark_svg_for_copy)} />
                    <span>{name}</span>
                  </div>
                </CopyToClipboard>
              ) : (
                <div
                  className={styles.shareItem}
                  key={name}
                  onClick={() => {
                    isSave ? createImg() : shareClick(url, gaKey);
                  }}
                >
                  {isSave ? <SaveSvg className={clxs(darkMode && styles.dark_svg_for_save)} /> : <img src={icon} alt={name} />}
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

const ShareMobile = forwardRef(_ShareMobile);

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
