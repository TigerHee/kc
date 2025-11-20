/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Modal } from '@kux/design';
import { Trans } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import logo from '../../../asset/userRestricted.svg';
import { composeUrl } from '../../../utils';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { BaseDialogProps } from '../../../types';

export const jumpPage = (url: string) => {
  const newWindow = window.open(addLangToPath(composeUrl(url)));
  if (newWindow) newWindow.opener = null;
};

export const PrivacyPolicy = ({
  showDefaultPolicy,
  privacy,
  privacyUrl,
  linkTextHasLinkClass,
}: {
  showDefaultPolicy?: boolean;
  privacy?: string;
  privacyUrl?: string;
  linkTextHasLinkClass?: string;
}) => {
  return showDefaultPolicy ? (
    <div className={styles.Tips}>
      <Trans i18nKey="wtvAa6fsU5APWF5H3bEqQN" ns="userRestricted">
        _<span onClick={() => jumpPage('/news/en-privacy-policy')}>_</span>_
        <span onClick={() => jumpPage('/news/en-terms-of-use')}>_</span>
      </Trans>
    </div>
  ) : privacy ? (
    <div className={styles.PrivacyLink}>
      <div className={clsx(styles.LinkText, linkTextHasLinkClass)} onClick={() => privacyUrl && jumpPage(privacyUrl)}>
        {privacy}
      </div>
    </div>
  ) : null;
};

const BaseDialog: React.FC<BaseDialogProps> = ({
  visible,
  title,
  content,
  buttonRefuse,
  onCancel,
  buttonAgree,
  onOk,
  showDefaultPolicy,
  privacy,
  privacyUrl,
  closable,
  icon,
}) => {
  // 使用变量而不是对象字面量来避免 bracket notation
  const wrapperClosableClass = closable ? styles.WrapperClosable : '';
  const linkTextHasLinkClass = privacyUrl ? styles.LinkTextHasLink : '';

  return (
    <Modal
      isOpen={!!visible}
      onOk={onOk}
      onCancel={onCancel}
      onClose={onCancel}
      cancelText={buttonRefuse || null}
      okText={buttonAgree || null}
      style={{ margin: 28 }}
      centeredFooterButton
      {...(closable ? { showCloseX: true } : { showCloseX: false, header: () => null })}
      className={styles.ExtendDialog}
    >
      <div className={clsx(styles.Wrapper, wrapperClosableClass)}>
        {/* TODO: 要换成组件库的 */}
        <img src={icon || logo} alt="logo" />
        <div className={styles.Title}>{title}</div>
        <div className={styles.Content}>{content}</div>
        <PrivacyPolicy
          showDefaultPolicy={showDefaultPolicy}
          privacy={privacy}
          privacyUrl={privacyUrl}
          linkTextHasLinkClass={linkTextHasLinkClass}
        />
      </div>
    </Modal>
  );
};

export default BaseDialog;
