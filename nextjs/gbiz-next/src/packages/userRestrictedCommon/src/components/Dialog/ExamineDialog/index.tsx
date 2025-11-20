/**
 * Owner: lena@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { Modal, useResponsive } from '@kux/design';
import { useTranslation, Trans } from 'tools/i18n';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';
import { composeUrl } from '../../../utils';
import styles from './styles.module.scss';
import { Notice, UserInfo } from '../../../types';

interface Props {
  notice?: Notice;
  onClose: () => void;
  onOk: () => void;
  visible: boolean;
  userInfo?: UserInfo;
}

const ExamineDialog: React.FC<Props> = ({ notice, onClose, onOk, visible, userInfo }) => {
  const { content, kycClearAt } = notice || {};
  const i18nKey = 'userRestricted';
  const { t: _t } = useTranslation(i18nKey);
  const rv = useResponsive();
  const isH5 = rv === 'sm';

  const handleCancel = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_EXAMINE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onClose();
  }, [userInfo, onClose]);

  const handleOk = useCallback(() => {
    // 关闭弹窗后，本地记录最近登录时间戳
    if (userInfo?.lastLoginAt) {
      storage.setItem(`GBIZ_EXAMINE_DIALOG_CLOSE_TIME`, userInfo.lastLoginAt);
    }
    onOk();
    window.location.replace(addLangToPath(composeUrl('/account/kyc?app_line=ACCOUNT&source=DEFAULT')));
  }, [userInfo, onOk]);

  const clearTime = useMemo(() => {
    if (kycClearAt) {
      const str = new Date(kycClearAt).toISOString();
      const arr = str?.split('T');
      const space = ' ';
      return arr[0].replace(/-/g, '/') + space + arr[1].split('.')[0];
    }
    return '';
  }, [kycClearAt]);

  // 计算打回结束时间 - 当前时间 > 1年
  const isOverOneYear = useMemo(() => {
    if (notice?.kycClearAt) {
      return dayjs.duration(dayjs(notice.kycClearAt).diff(dayjs())).asYears() >= 1;
    }
    return false;
  }, [notice?.kycClearAt]);

  return (
    <Modal
      size="medium"
      isOpen={visible}
      title={_t('aGLiVVCYQQc3qbqz9Rugmb')}
      onOk={handleOk}
      onCancel={handleCancel}
      onClose={handleCancel}
      cancelText={null}
      okText={_t('3Dn54WPNF5VzE5PZNVQ42C')}
      className={styles.ExamineDialog}
    >
      <div className={styles.Content} data-nosnippet={true}>
        <p className={styles.AdminTips}>{content}</p>
        {content ? <div className={styles.Line} /> : null}
        <div className={styles.KycLevel}>
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
        </div>
      </div>
      <div className={styles.UserAgreement}>
        <Trans i18nKey="s7bVrYwynBGUQWmFfoTnsA" ns={i18nKey}>
          相关政策
          <span
            onClick={() => {
              const url = addLangToPath(composeUrl('/news/en-terms-of-use'));
              const newWindow = window.open(url);
              if (newWindow) newWindow.opener = null;
            }}
          >
            详见《用户协议》
          </span>
        </Trans>
      </div>
    </Modal>
  );
};

export default ExamineDialog;
