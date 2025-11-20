/**
 * Owner: lena@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { styled, Dialog, useResponsive } from '@kux/mui';
import { useTranslation, Trans } from '@tools/i18n';
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
      margin: 0 16px;
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  .KuxModalHeader-root {
    padding: 32px 32px 24px 32px;
    height: auto !important;
    flex-shrink: 0;
    .KuxModalHeader-title {
      padding-right: 58px;
      width: 100%;
      [dir='rtl'] & {
        padding-right: unset;
        padding-left: 58px;
      }
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 24px 24px 16px 24px !important;
      min-height: auto !important;
      .KuxModalHeader-title {
        font-size: 20px;
        padding-right: 46px;
        [dir='rtl'] & {
          padding-right: unset;
          padding-left: 46px;
        }
      }
      .KuxModalHeader-close {
        top: 24px !important;
        right: 24px !important;
      }
    }
  }
  .KuxDialog-content {
    display: flex;
    flex-direction: column;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0 24px;
    }
  }
  .KuxModalFooter-root {
    padding: 14px 32px 32px 32px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 12px 24px 24px 24px;
    }
  }
`;

const Content = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -ms-scrollbar-track-color: transparent;
`;
const AdminTips = styled.p`
  font-size: 14px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.text60};
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.cover8};
  margin: 20px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 16px 0;
  }
`;
const KycLevel = styled.div`
  & > h3 {
    font-size: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    line-height: 130%;
    margin-bottom: 6px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 14px;
    }
  }
  & > div {
    font-size: 16px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 4px;
    &:last-of-type {
      margin-bottom: 0px;
    }
    & > span {
      font-weight: 500;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 14px;
    }
  }
`;
const UserAgreement = styled.div`
  margin-top: 24px;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  line-height: 130%;
  text-align: left;
  [dir='rtl'] & {
    text-align: right;
  }
  span {
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export default ({ notice, onClose, onOk, visible, userInfo, currentLang }) => {
  const { content, kycClearAt } = notice || {};
  const i18nKey = 'userRestricted';
  const { t: _t } = useTranslation(i18nKey);
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const handleCancel = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_EXAMINE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onClose();
  }, [userInfo]);

  const handleOk = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_EXAMINE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onOk();
    window.location.href = addLangToPath(
      composeUrl('/account/kyc?app_line=ACCOUNT&source=DEFAULT'),
      currentLang,
    );
  }, [userInfo, currentLang]);

  const clearTime = useMemo(() => {
    if (kycClearAt) {
      const str = new Date(kycClearAt).toISOString();
      const arr = str?.split('T');
      const space = ' ';
      return arr[0].replace(/-/g, '/') + space + arr[1].split('.')[0];
    }
  }, [kycClearAt]);

  // 计算打回结束时间 - 当前时间 > 1年
  const isOverOneYear = dayjs.duration(dayjs(notice.kycClearAt).diff(dayjs())).asYears() >= 1;

  return (
    <ExtendDialog
      size="medium"
      open={visible}
      title={_t('aGLiVVCYQQc3qbqz9Rugmb')}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={null}
      okText={_t('3Dn54WPNF5VzE5PZNVQ42C')}
      okButtonProps={{ size: isH5 ? 'basic' : 'large', fullWidth: true }}
      rootProps={{ 'data-nosnippet': true }}
    >
      <Content>
        <AdminTips>{content}</AdminTips>
        {content ? <Line /> : null}
        <KycLevel>
          <h3>{_t('2vW7TMpb66typtNx1LDyNt')}</h3>
          <div>{_t('hXuuxGgQZ3pYpPEhtXFepB')}</div>
          <div>
            {isOverOneYear ? (
              _t('262ee07aefe84000a800')
            ) : (
              <Trans i18nKey="ugX6gMQu3aTn5fgBnWUC2o" ns={i18nKey} values={{ date: clearTime }}>
                如您非该地区使用者，请
                <span>2023-07-30（UTC） </span>
                前，重新提交身份认证。在此期限后，您的
                <span>身份认证状态将会重置</span>
              </Trans>
            )}
          </div>
        </KycLevel>
      </Content>
      <UserAgreement>
        <Trans i18nKey="s7bVrYwynBGUQWmFfoTnsA" ns={i18nKey}>
          相关政策
          <span
            onClick={() => {
              const url = addLangToPath(composeUrl('/news/en-terms-of-use'), currentLang);
              const newWindow = window.open(url);
              if (newWindow) newWindow.opener = null;
            }}
          >
            详见《用户协议》
          </span>
        </Trans>
      </UserAgreement>
    </ExtendDialog>
  );
};
