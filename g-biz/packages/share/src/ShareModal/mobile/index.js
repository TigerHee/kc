import React, { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog, useSnackbar, Button, useTheme } from '@kux/mui';

import { css } from '@emotion/react';
import _ from 'lodash';
// import { CloseOutlined } from '@kufox/icons';
import { useLang } from '../../hookTool';
import closeSvg from '../../asset/close.svg';
import closeDarkSvg from '../../asset/close-dark.svg';
import closeDarkSvg2 from '../../asset/close_dark.svg';
import hotPng from '../../asset/hot.png';

import Marquee from '../components/Marquee';
import { getDisplayShareBtn } from '../../utils/helper';
import { getShareBtns, getOperateBtns, OPERATE_BTN_TYPE } from './config';
import { ShareCarousel } from '../../shareV3/ShareCarousel';

const useStyles = ({ showSaveAsImg, colors }) => {
  return {
    shareMobile: css`
      height: 100% !important;
      max-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      .KuxDialog-mask {
        backdrop-filter: blur(5.5px);
      }
      .KuxDialog-body {
        height: 100%;
        flex: unset;
        background: transparent !important;
        .KuxModalHeader-root,
        .KuxDialog-footer-root {
          display: none;
        }
      }

      .KuxDialog-content {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
      }
    `,
    shareContent: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 100vh;
      /* max-height: 100%; */
    `,
    content: css`
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      width: 100%;
      overflow: hidden;
    `,
    contentCenter: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    `,
    poster: css`
      width: calc(100% - 48px);
      height: calc(100% - 48px);
      object-fit: contain;
    `,
    shareView: css`
      width: 100%;
      height: auto;
      background: ${colors.layer};
      border-radius: 16px 16px 0 0;
    `,
    top: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: auto;
      min-height: 30px;
      padding-top: 12px;
      color: #00142a;
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
    `,
    closeIcon: css`
      position: absolute;
      top: 22px;
      left: 21px;
      width: 15px;
      height: 15px;
    `,
    adsTop: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: auto;
      min-height: 30px;
      color: #00142a;
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
    `,
    adsCloseIcon: css`
      position: absolute;
      top: 12px;
      right: 10px;
      width: 16px;
      height: 16px;
      z-index: 9;
      box-sizing: content-box;
      padding: 6px;
    `,
    shareList: css`
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      padding-bottom: 46px;
      padding-top: 16px;
      overflow: hidden;
    `,
    shareItem: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 20%;
      height: auto;
      /* padding: 8px 0; */
      span {
        margin-top: 4px;
        color: ${colors.text60};
        font-size: 12px;
        line-height: 14px;
      }
    `,
    shareItemImgBox: css`
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: relative;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    `,
    hotTag: css`
      position: absolute;
      font-family: Kufox Sans;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: 130%;
      color: #fff;
      top: -6px;
      right: -12px;
      border-radius: 20px;
      min-width: 26px;
      min-height: 16px;
      .hotText {
        position: relative;
        z-index: 2;
        min-width: 26px;
        min-height: 16px;
        text-align: center;
      }
      ::after {
        position: absolute;
        content: '';
        bottom: 0px;
        left: 0px;
        background: url(${hotPng}) no-repeat;
        background-size: 100% 100%;
        background-position: center;
        min-width: 26px;
        height: 16px;
        z-index: 1;
      }
    `,
    operateList: css`
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 8px;
      .KuxButton-contained {
        height: 40px;
        border-radius: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
      }
    `,
    saveBtn: css`
      overflow: hidden;
      img {
        width: 16px;
        margin-right: 6px;
        [dir='rtl'] & {
          margin-right: 0;
          margin-left: 6px;
        }
      }
      span {
        font-size: 14px;
        font-weight: 600;
        line-height: 130%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    `,
    copyBtn: css`
      margin-left: ${showSaveAsImg ? '12px' : '0'};
      [dir='rtl'] & {
        margin-left: 0;
        margin-right: ${showSaveAsImg ? '12px' : '0'};
      }
      overflow: hidden;
      img {
        width: 16px;
        margin-right: 6px;
        [dir='rtl'] & {
          margin-right: 0;
          margin-left: 6px;
        }
      }
      span {
        font-size: 14px;
        font-weight: 600;
        line-height: 130%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    `,
    moreBtn: css`
      display: flex;
      margin-left: 12px;
      width: 40px;
      img {
        width: 40px;
      }
    `,
    diyModalTitleTop: css`
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: auto;
      padding: 16px;
      padding-bottom: 0px;
      color: #00142a;
      font-weight: 500;
      font-size: 18px;
      line-height: 30px;
      border-radius: 16px 16px 0px 0px;
      background: linear-gradient(180deg, rgba(1, 188, 141, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
    `,
    diyModalTitle: css`
      display: flex;
      flex: 1;
      align-items: center;
      margin-right: 16px;
      [dir='rtl'] & {
        margin-right: 0;
        margin-left: 16px;
      }
    `,
    diyModalCloseIcon: css`
      width: 16px;
      height: 16px;
    `,
    shareBtnList: css`
      width: 100%;
      display: flex;
      align-items: baseline;
      margin-bottom: 20px;
    `,
    shareItemName: css`
      text-align: center;
    `,
  };
};

const ShareMobile = (props) => {
  const { t: _t } = useLang();
  const {
    open = false,
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    // shareDesc = '',
    poster = '',
    _stop = () => {},
    createImg = () => {},
    maskClick = () => {},
    shareClick = () => {},
    renderDomAsImg,
    shareModalTitle = '',
    diyModalTitle = null,
    onCopy = null,
    replaceShareBtn = {},
    marqueeText = null,
    rootProps = {},
    showSaveAsImg = true,
    // darkMode = false,
    ads = {},
    theme = 'light',
  } = props || {};
  const isDark = theme === 'dark';
  const _theme = useTheme();
  const styles = useStyles({ poster, showSaveAsImg, colors: _theme.colors });

  const { message } = useSnackbar();
  const shareBtns = useMemo(() => {
    return getShareBtns(shareUrl, shareTitle);
  }, [shareUrl, shareTitle]);

  const isShowModalTitle = _.isEmpty(ads);
  const renderShareBtns = () => {
    return shareBtns.map((item) => {
      const target = getDisplayShareBtn(item, replaceShareBtn);
      return (
        <div
          className="gbiz_share_btn_shareItem"
          css={styles.shareItem}
          key={target?.name}
          onClick={() => {
            shareClick(target?.url, target?.gaKey, { shareTitle, shareUrl, ...target });
          }}
        >
          <div className="gbiz_share_btn_shareItemImgBox" css={styles.shareItemImgBox}>
            {target?.isHot ? (
              <div css={styles.hotTag}>
                <div className="hotText">Hot</div>
              </div>
            ) : (
              ''
            )}
            <img src={target?.icon} alt={target?.name} />
          </div>
          <span className="gbiz_share_btn_shareItemName" css={styles.shareItemName}>
            {target?.name}
          </span>
        </div>
      );
    });
  };
  const BottomHeader = () => {
    if (diyModalTitle) {
      return (
        <div className="gbiz_share_diyModalTitle_top" css={styles.diyModalTitleTop}>
          <div className="gbiz_share_diyModalTitle" css={styles.diyModalTitle}>
            {diyModalTitle}
          </div>
          {/*  eslint-disable-next-line */}
          <img src={closeDarkSvg} css={styles.diyModalCloseIcon} onClick={onCancel} alt="" />
        </div>
      );
    }
    return isShowModalTitle ? (
      <div css={styles.top}>
        {shareModalTitle || _t('inviteB.manage.poster.share')}
        {/*  eslint-disable-next-line */}
        <img src={closeSvg} css={styles.closeIcon} onClick={onCancel} alt="" />
      </div>
    ) : (
      <div css={styles.adsTop}>
        <ShareCarousel ads={ads} />
        {/*  eslint-disable-next-line */}
        <img
          src={isDark ? closeDarkSvg2 : closeSvg}
          css={styles.adsCloseIcon}
          onClick={onCancel}
          alt=""
        />
      </div>
    );
  };

  return (
    <Dialog
      css={styles.shareMobile}
      size="fullWidth"
      showCloseX={false}
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title=""
      cancelText=""
      okText=""
      maskClosable={false}
      footer={null}
      rootProps={rootProps}
    >
      <div css={styles.shareContent}>
        <div css={styles.content} onClick={maskClick}>
          <div css={styles.contentCenter}>
            {/* eslint-disable-next-line */}
            {renderDomAsImg ? (
              renderDomAsImg()
            ) : (
              <img css={styles.poster} src={poster} alt="poster" onClick={_stop} /> // eslint-disable-line
            )}
          </div>
        </div>
        <div css={styles.shareView}>
          <BottomHeader />
          <div css={styles.shareList}>
            <div className="gbiz_share_shareBtnList" css={styles.shareBtnList}>
              {renderShareBtns()}
            </div>
            {marqueeText ? <Marquee text={marqueeText} /> : ''}
            <div css={styles.operateList}>
              {getOperateBtns.map((item) => {
                const { name = '', icon: _icon, iconDark, url, gaKey = '' } = item || {};
                const icon = isDark ? iconDark : _icon;
                let btn;
                switch (name) {
                  case OPERATE_BTN_TYPE.copy:
                    btn = (
                      <CopyToClipboard
                        text={`${shareTitle} ${shareUrl}`}
                        onCopy={() => {
                          if (shareTitle || shareUrl) {
                            _.isFunction(onCopy)
                              ? onCopy()
                              : message.success(
                                  <span className="gbiz-share-success-txt">
                                    {_t('inviteB.manage.copy.share')}
                                  </span>,
                                );
                          }
                        }}
                      >
                        <Button
                          css={styles.copyBtn}
                          key={name}
                          type="default"
                          onClick={() => {
                            shareClick(url, gaKey, { shareTitle, shareUrl, ...item });
                          }}
                        >
                          <img src={icon} alt={name} />
                          <span>{_t('sTkpRT7EiVTxqr6sApV5Aj')}</span>
                        </Button>
                      </CopyToClipboard>
                    );
                    break;
                  case OPERATE_BTN_TYPE.save:
                    if (showSaveAsImg) {
                      btn = (
                        <Button
                          css={styles.saveBtn}
                          key={name}
                          onClick={() => {
                            createImg();
                          }}
                        >
                          <img src={icon} alt={name} />
                          <span>{_t('x8nfNnRNkgqeds6C4AfUC8')}</span>
                        </Button>
                      );
                    }
                    break;
                  default:
                    break;
                }
                return btn;
              })}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ShareMobile;
