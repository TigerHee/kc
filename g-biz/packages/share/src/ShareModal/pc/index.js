import React, { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog, useSnackbar, styled, useTheme } from '@kux/mui';

import _ from 'lodash';

import { css } from '@emotion/react';
import { useLang } from '../../hookTool';
import closeSvg from '../../asset/close.svg';
import { getShareBtns } from './config';
import { getDisplayShareBtn } from '../../utils/helper';
import hotPng from '../../asset/hot.png';
import Marquee from '../components/Marquee';

const ShareDialog = styled(Dialog)`
  .KuxModalFooter-root {
    padding: unset;
    padding-bottom: 32px;
  }
  [dir='rtl'] & {
    .KuxDialog-body {
      .KuxModalHeader-root {
        justify-content: unset;
        .KuxModalHeader-close {
          right: unset;
          left: 32px;
        }
      }
    }
  }
`;
const useStyles = ({ colors } = {}) => {
  return {
    sharePc: css`
      /* max-width: 600px !important; */
      [dir='rtl'] & {
        .KuxDialog-header > div:first-of-type {
          right: unset;
          left: 24px;
        }
      }
    `,
    content: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    poster: css`
      width: 265px;
      background: #fff;
    `,
    copyIcon: css`
      position: absolute;
      right: 16px;
      bottom: 80px;
      width: 56px;
      height: 56px;
      background-color: rgba(216, 216, 216, 0.8);
      border-radius: 50%;
      cursor: pointer;
    `,
    downIcon: css`
      position: absolute;
      right: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      background-color: rgba(216, 216, 216, 0.8);
      border-radius: 50%;
      cursor: pointer;
    `,
    shareView: css`
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      margin-top: 8px;
    `,
    shareItem: css`
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 52px;
      margin-top: 16px;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      span {
        margin-top: 6px;
        color: ${colors.text60};
        font-size: 12px;
        line-height: 16px;
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
      right: -6px;
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
  };
};

const SharePc = (props) => {
  const { t: _t } = useLang();
  const _theme = useTheme();
  const styles = useStyles({ colors: _theme.colors });
  const {
    open = false,
    onCancel = () => {},
    shareUrl = '',
    shareTitle = '',
    poster = '',
    createImg = () => {},
    shareClick = () => {},
    maskClose = true,
    shareModalTitle,
    renderDomAsImg,
    marqueeText = '',
    // diyModalTitle = null,
    // diyModalIcon = null,
    onCopy = null,
    replaceShareBtn = {},
    rootProps = {},
    theme = 'light',
  } = props || {};
  const { message } = useSnackbar();

  const shareBtns = useMemo(() => {
    return getShareBtns(shareUrl, shareTitle, { isDark: theme === 'dark' });
  }, [shareUrl, shareTitle, theme]);

  return (
    <ShareDialog
      css={styles.sharePc}
      showCloseX
      open={open}
      onOk={onCancel}
      onCancel={onCancel}
      title={shareModalTitle || _t('inviteB.manage.poster.share')}
      cancelText=""
      closeNode={<img src={closeSvg} css={styles.closeIcon} alt="" />}
      okText=""
      maskClosable={maskClose}
      rootProps={rootProps}
      size="large"
    >
      <div css={styles.content}>
        {renderDomAsImg ? (
          renderDomAsImg()
        ) : (
          <img css={styles.poster} src={poster} alt="poster" /> // eslint-disable-line
        )}
      </div>
      {marqueeText ? <Marquee text={marqueeText} /> : ''}
      <div css={styles.shareView}>
        {shareBtns.map((item) => {
          const target = getDisplayShareBtn(item, replaceShareBtn);
          const { name = '', icon, url, gaKey = '' } = target || {};

          return name === 'Copy' ? (
            <CopyToClipboard
              text={`${shareTitle} ${shareUrl}`}
              onCopy={() => {
                /** 使用层如果传递了 onCopy 优先使用外部传入的onCopy， message为兜底 */
                if (_.isFunction(onCopy)) {
                  onCopy();
                } else if (shareTitle || shareUrl) {
                  message.success(
                    <span className="gbiz-share-success-txt">
                      {_t('inviteB.manage.copy.share')}
                    </span>,
                  );
                }
              }}
            >
              <div
                css={styles.shareItem}
                key={name}
                onClick={() => {
                  shareClick(url, gaKey, { shareTitle, shareUrl, ...target });
                }}
              >
                <img src={icon} alt={name} />
                <span>{name}</span>
              </div>
            </CopyToClipboard>
          ) : (
            <div
              css={styles.shareItem}
              key={name}
              onClick={() => {
                name === 'Save'
                  ? createImg()
                  : shareClick(url, gaKey, { shareTitle, shareUrl, ...target });
              }}
            >
              {target?.isHot ? (
                <div css={styles.hotTag}>
                  <div className="hotText">Hot</div>
                </div>
              ) : (
                ''
              )}
              <img src={icon} alt={name} />
              <span>{name}</span>
            </div>
          );
        })}
      </div>
    </ShareDialog>
  );
};

export default SharePc;
