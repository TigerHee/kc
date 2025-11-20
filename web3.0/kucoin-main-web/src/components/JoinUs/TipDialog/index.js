/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-05-26 11:09:45
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-05-28 12:09:28
 * @FilePath: /kucoin-main-web/src/components/JoinUs/TipDialog/index.js
 * @Description: 三方跳转提醒弹窗
 * 大尺寸是弹窗
 * 小尺寸是抽屉
 *
 *
 */
import React, { useEffect } from 'react';
import { styled } from '@kux/mui/emotion';
import { Dialog, MDialog, Button } from '@kux/mui';
import { _t } from 'tools/i18n';
import { trackClick, saTrackForBiz } from 'utils/ga';
import { createDialogStore } from 'src/components/common/DialogStore';
import clxs from 'classnames';

/** moka链接 */
const MOKA_URL =
  'https://hire-r1.mokahr.com/social-recruitment/kcareers/100000192?locale=en-US#/jobs?keyword=&page=1&anchorName=jobsList';

export const [useTipDialogStore, TipProvider] = createDialogStore();

/** 内容区域 start */
const TipContentWrapper = styled.div`
  padding: 0px 32px 24px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
  .text {
    margin-bottom: 24px;
    &:last-of-type {
      margin-bottom: 0px;
    }
  }
  p {
    margin: 0;
    padding: 0;
  }
  .sub-text {
    text-indent: 1em;
  }
  &.tipContentWrapper_Sm {
    padding: 0px 16px 16px;
    font-size: 16px;
  }
`;
export const TipContent = ({ isSm }) => {
  return (
    <TipContentWrapper
      data-testid="TipContent"
      data-inspector="TipContent"
      className={clxs('tipContentWrapper', { ['tipContentWrapper_Sm']: isSm })}
    >
      <div className="text">{_t('application.tipDialog.text1')}</div>
      <div className="text">
        <p>{_t('application.tipDialog.text2')}</p>
        <p>{_t('application.tipDialog.text3')}</p>
        <p>{_t('application.tipDialog.text4')}</p>
        <div>
          <p>{_t('application.tipDialog.text5')}</p>
          <p className="sub-text">{_t('application.tipDialog.text5.1')}</p>
          <p className="sub-text">{_t('application.tipDialog.text5.2')}</p>
        </div>
      </div>
    </TipContentWrapper>
  );
};
/** 内容区域 end */

/** 弹窗 start */
const NewDialog = styled(Dialog)`
  .KuxDialog-content {
    padding: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  }
  .KuxModalFooter-buttonWrapper {
    .KuxButton-outlined {
      border: none;
      &:hover,
      &:active,
      &:focus {
        background: transparent;
      }
    }
  }
`;
const NewMDialog = styled(MDialog)`
  .KuxModalHeader-root {
    height: unset;
    min-height: 56px;
    padding: 24px 16px 12px 16px;
    border-bottom: none;
    .KuxModalHeader-close {
      top: 22px;
      border-color: rgba(140, 140, 140, 0.2);
      svg.ICClosePlus_svg__icon {
        fill: rgba(140, 140, 140, 0.6);
      }
    }
  }
  .KuxDrawer-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-bottom: 34px;
    .KuxMDialog-content {
      flex: 1;
      overflow-y: auto;
    }
  }
`;

const NewMDialogTipFooter = styled.div`
  padding: 12px 16px 8px 16px;
  .confirm-btn {
    margin-bottom: 12px;
  }
  .cancel-btn {
    &:hover,
    &:active,
    &:focus {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const TipDialog = ({ isSm }) => {
  const { visible, context, closeDialog } = useTipDialogStore();

  /** 关闭弹窗 */
  const onClose = () => {
    /** 埋点 */
    trackClick(['Cancel', '1']);
    closeDialog();
  };

  /** 跳转到摩卡官网 */
  const goMoka = () => {
    /** 埋点 */
    trackClick(['Confirm', '1']);
    /** 关闭弹窗 */
    closeDialog();
    /** 跳转 */
    const newWindow = window.open(MOKA_URL, '_black');
    newWindow.opener = null;
  };

  /** 曝光埋点 */
  useEffect(() => {
    if (visible) {
      saTrackForBiz({}, ['B1RecruitmentRedirect', '1'], {});
    }
  }, [visible]);

  if (isSm) {
    return (
      <NewMDialog
        maskClosable={false}
        back={false}
        show={visible}
        title={_t('assets.bonus.notice')}
        onClose={onClose}
        footer={
          <NewMDialogTipFooter>
            <Button
              onClick={goMoka}
              className="confirm-btn"
              variant="contained"
              fullWidth
              data-testid="okBtn"
            >
              {_t('application.tipDialog.goOn')}
            </Button>
            <Button
              onClick={onClose}
              className="cancel-btn"
              variant="text"
              fullWidth
              data-testid="cancelBtn"
            >
              {_t('cancel')}
            </Button>
          </NewMDialogTipFooter>
        }
      >
        <TipContent isSm />
      </NewMDialog>
    );
  }
  return (
    <NewDialog
      title={_t('assets.bonus.notice')}
      size={'large'}
      open={visible}
      onCancel={onClose}
      onOk={goMoka}
      cancelText={_t('cancel')}
      okText={_t('application.tipDialog.goOn')}
    >
      <TipContent />
    </NewDialog>
  );
};
/** 弹窗 end */
