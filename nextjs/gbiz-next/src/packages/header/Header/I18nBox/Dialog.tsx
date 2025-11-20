/**
 * Owner: iron@kupotech.com
 */
import React, { FC } from 'react';
import { Modal } from '@kux/design';
import clsx from 'clsx';
import styles from './styles.module.scss';

const types = ['lang', 'currency'];

interface DialogProps {
  Title: React.ComponentType;
  modalVisible: boolean;
  closeModal: () => void;
  tab: string;
  getCurrency: () => string;
  getLang: () => string;
  t: (key: string) => string;
}

const Dialog: FC<DialogProps> = props => {
  const { Title, modalVisible, closeModal, tab, getCurrency, getLang, t } = props;

  return (
    <Modal
      maskClosable
      showCloseX
      footer={null}
      title={<Title />}
      size="large"
      isOpen={modalVisible}
      onClose={closeModal}
      className={clsx('Gbiz-I18nBox', styles.dialogWrapper)}
      data-inspector="inspector_i18n_dialog"
    >
      {tab === types[0] ? (
        <div className={styles.overlayWrapper}>
          <h4 className={styles.overlayTitle}>{t('newheader.select.lang')}</h4>
          {getLang()}
        </div>
      ) : (
        <div className={styles.overlayWrapper}>
          <h4 className={styles.overlayTitle}>{t('newheader.select.currency')}</h4>
          <div className={styles.content}>{getCurrency()}</div>
        </div>
      )}
    </Modal>
  );
};

export default Dialog;
