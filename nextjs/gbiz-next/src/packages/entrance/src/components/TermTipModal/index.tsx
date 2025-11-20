import { Button, Modal } from '@kux/design';
import clsx from 'clsx';
import { Trans } from 'tools/i18n';
import { getTermUrl, getTermId } from 'tools/term';
import { useLang } from '../../hookTool';
import styles from './index.module.scss';
import { getTenantConfig } from '../../config/tenant';

export const TermTipModal = ({ isOpen, onClose, onOk, multiSiteConfig }) => {
  const { t } = useLang();
  const termTipInfo = getTenantConfig().signup.termTipInfo;
  const url1 = getTermUrl(getTermId('agreementTerm', multiSiteConfig?.termConfig));
  const url2 = getTermUrl(getTermId('privacyUserTerm', multiSiteConfig?.termConfig));

  return (
    <Modal
      isOpen={isOpen}
      className={styles.tipModal}
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      onClose={onClose}
      size="small"
      showCloseX
      title={<div className={styles.title}>{t('8a8ea0bca2e44800af8a')}</div>}
    >
      <div className={clsx(styles.container)}>
        <div className={styles.content}>
          <Trans
            i18nKey={termTipInfo.i18nKey}
            ns="entrance"
            values={{
              url1,
              url2,
            }}
            components={{
              a1: <a href={url1} target="_blank" rel="noopener noreferrer" />,
              a2: <a href={url2} target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </div>
        <Button className={styles.btn} type="primary" fullWidth onClick={onOk}>
          {t('f8feaaae93bc4000a249')}
        </Button>
      </div>
    </Modal>
  );
};
