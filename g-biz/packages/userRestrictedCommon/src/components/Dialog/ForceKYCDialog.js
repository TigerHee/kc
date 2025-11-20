/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import { styled, Dialog } from '@kux/mui';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import { composeUrl } from '../../utils';

const ExtendDialog = styled(Dialog)`
  .KuxModalHeader-close {
    [dir='rtl'] & {
      right: unset;
      left: 32px;
    }
  }
  .KuxDialog-body {
    max-height: 66.6vh;
    ${(props) => props.theme.breakpoints.down('sm')} {
      max-width: unset;
      width: calc(100% - 48px);
      margin: 16px !important;
    }
  }
  .KuxModalHeader-root {
    flex-shrink: 0;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 24px 24px 16px !important;
    }
  }
  .KuxDialog-content {
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0 24px;
    }
  }
  .KuxModalFooter-root {
    word-break: break-word;
    .KuxButton-root {
      height: 40px;
      padding: 0 24px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 32px 24px 24px;
      .KuxModalFooter-buttonWrapper {
        display: flex;
        flex-wrap: wrap-reverse;
        gap: 12px;
        & > button {
          width: 100%;
        }
        & > button:nth-of-type(1) {
          margin-right: 0;
        }
      }
    }
  }
`;

const Content = styled.div`
  overflow: auto;
  word-break: break-word;
  font-size: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export default ({ notice, onClose, onOk, visible, userInfo, currentLang }) => {
  const { title, content, buttonRefuse, buttonAgree, buttonAgreeWebUrl, buttonRefuseWebUrl } =
    notice || {};

  const handleCancel = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_FORCE_KYC_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onClose();
    if (buttonRefuseWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonRefuseWebUrl), currentLang);
    }
  }, [userInfo, buttonRefuseWebUrl, currentLang]);

  const handleOk = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_FORCE_KYC_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onOk();
    if (buttonAgreeWebUrl) {
      window.location.href = addLangToPath(composeUrl(buttonAgreeWebUrl), currentLang);
    }
  }, [userInfo, buttonAgreeWebUrl, currentLang]);

  return (
    <ExtendDialog
      open={visible}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={buttonRefuse || null}
      okText={buttonAgree || null}
      style={{ margin: 28 }}
      cancelButtonProps={{ size: 'small' }}
      okButtonProps={{ size: 'small' }}
      centeredFooterButton={!(buttonAgree && buttonRefuse)}
      rootProps={{ 'data-nosnippet': true }}
    >
      <Content>{content}</Content>
    </ExtendDialog>
  );
};
