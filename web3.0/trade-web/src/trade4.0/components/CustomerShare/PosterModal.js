/**
 * Owner: garuda@kupotech.com
 * 业务组件，动态海报分享
 */
import React, { useMemo } from 'react';

import { styled } from '@kux/mui/emotion';
import { useResponsive } from '@kux/mui/hooks';

import clsx from 'clsx';

import { _t } from 'utils/lang';

import { ICClosePlusOutlined } from '@kux/icons';
import { Dialog } from '@kux/mui';

import ShareButton from './ShareButton';

const MobileDialog = styled(Dialog)`
  &.share-mobile-dialog {
    .KuxModalHeader-root {
      height: unset;
    }
    .KuxDialog-body {
      border-radius: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .KuxDialog-content {
    padding: 0;
    height: 100%;
  }
  .share-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: space-evenly;
    padding-top: 16px;
  }
  .share-view {
    display: flex;
    width: 100%;
    height: auto;
    background-color: ${(props) => props.theme.colors.layer};
    border-radius: 16px 16px 0 0;
    flex: 1;
    max-height: 220px;
    flex-direction: column;
  }
  .share-view-header {
    position: relative;
    padding: 16px 40px 16px 16px;
    border-radius: 16px 16px 0px 0px;
    background: linear-gradient(180deg, rgba(1, 188, 141, 0.12) 0%, rgba(255, 255, 255, 0) 100%),
      ${(props) => props.theme.colors.layer};
    min-height: 32px;

    .dialog-close {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translate(0, -50%);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${(props) => props.theme.colors.divider8};
      border-radius: 50%;
      font-size: 12px;
      color: ${(props) => props.theme.colors.icon60};
      cursor: pointer;
    }
  }
  .share-button-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 16px 0;
    justify-content: space-around;
    flex: 1;
    user-select: none;

    .share-item-wrapper {
      display: flex;
      width: 100%;
      align-items: center;
    }
    .share-button-operator {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
      .text {
        line-height: 1;
      }
    }
    .share-item {
      display: flex;
      flex-direction: column;
      width: 20%;
      align-items: center;
      img {
        width: 40px;
        margin-bottom: 4px;
      }
      > span {
        font-size: 12px;
        line-height: 1.3;
        color: ${(props) => props.theme.colors.text60};
      }
    }
    .operator-button {
      margin-top: 16px;
      width: 45%;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:first-of-type {
        margin-right: 16px;
      }
    }
    .icon-box {
      font-size: 16px;
      display: flex;
      margin: 0 6px 0 0;
      .KuxSpin-root,
      .KuxSpin-wrapper,
      .KuxSpin-circle {
        width: 24px;
        height: 24px;
      }
      .KuxSpin-logo {
        width: 12px;
        height: 12px;
      }
    }
  }
`;

const PCDialog = styled(Dialog)`
  .KuxDialog-body {
    width: 640px;
    max-width: 640px;
  }
  .share-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .share-button-wrapper {
    padding: 24px 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    user-select: none;

    .operator-button {
      display: flex;
      flex-direction: column;
      height: unset;
    }
    .icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid ${(props) => props.theme.colors.divider8};
      color: ${(props) => props.theme.colors.icon};
      margin-bottom: 4px;
      .KuxSpin-root,
      .KuxSpin-wrapper,
      .KuxSpin-circle {
        width: 40px;
        height: 40px;
      }
      .KuxSpin-logo {
        width: 16px;
        height: 16px;
      }
    }
    .text {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 400;
      color: ${(props) => props.theme.colors.text60};
    }
  }
  .share-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 5;
  }
  .share-button-operator {
    display: flex;
    flex-grow: 3;
    justify-content: space-evenly;
  }
  .share-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    > img {
      width: 40px;
      height: 40px;
      margin-bottom: 4px;
    }
    > span {
      font-size: 12px;
      line-height: 1.3;
      color: ${(props) => props.theme.colors.text60};
    }
  }
`;

const PosterMobile = ({
  visible,
  onCancel,
  content,
  dialogProps,
  shareUrl,
  shareTitle,
  onlyShareClick,
  onShareClick,
  onSave,
  onCopy,
  mobileShareSlot,
  className,
  shareSlot,
  saveLoading,
}) => {
  return (
    <MobileDialog
      className={clsx('share-mobile-dialog', className)}
      size="fullWidth"
      showCloseX={false}
      open={visible}
      onOk={onCancel}
      onCancel={onCancel}
      title=""
      cancelText=""
      okText=""
      maskClosable={false}
      footer={null}
      {...dialogProps}
    >
      <div className="share-content">
        <div className="content">{content}</div>
        {shareSlot}
        <div className="share-view">
          <div className="share-view-header">
            {mobileShareSlot}
            <div className="dialog-close" onClick={onCancel}>
              <ICClosePlusOutlined />
            </div>
          </div>
          <ShareButton
            shareUrl={shareUrl}
            shareTitle={shareTitle}
            onlyShareClick={onlyShareClick}
            onShareClick={onShareClick}
            onSave={onSave}
            onCopy={onCopy}
            isMobile
            saveLoading={saveLoading}
          />
        </div>
      </div>
    </MobileDialog>
  );
};

const PosterPc = ({
  visible,
  onCancel,
  content,
  dialogProps,
  shareUrl,
  shareTitle,
  onlyShareClick,
  onShareClick,
  onSave,
  onCopy,
  className,
  shareModalTitle,
  shareSlot,
  saveLoading,
}) => {
  return (
    <PCDialog
      className={clsx('share-pc-dialog', className)}
      showCloseX
      open={visible}
      onOk={onCancel}
      onCancel={onCancel}
      title={shareModalTitle || _t('share.modalTitle')}
      cancelText=""
      okText=""
      maskClosable={false}
      footer={null}
      {...dialogProps}
    >
      <div className="share-content">
        <div className="content">{content}</div>
        {shareSlot}
        <ShareButton
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          onlyShareClick={onlyShareClick}
          onShareClick={onShareClick}
          onSave={onSave}
          onCopy={onCopy}
          isMobile={false}
          saveLoading={saveLoading}
        />
      </div>
    </PCDialog>
  );
};

const PosterModal = (props) => {
  const { xs, sm } = useResponsive();
  const isMobile = useMemo(() => xs && !sm, [sm, xs]);

  return isMobile ? <PosterMobile {...props} /> : <PosterPc {...props} />;
};

export default React.memo(PosterModal);
