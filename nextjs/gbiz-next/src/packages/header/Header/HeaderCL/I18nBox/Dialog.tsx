/**
 * Owner: iron@kupotech.com
 */
import React, { FC } from 'react';
import clsx from 'clsx';
import { Modal } from '@kux/design';
import styles from '../../I18nBox/styles.module.scss';

interface DialogProps {
  Title: React.ComponentType;
  modalVisible: boolean;
  closeModal: () => void;
  getLang: () => string;
  t: (key: string) => string;
}

const Dialog: FC<DialogProps> = props => {
  const { Title, modalVisible, closeModal, getLang, t } = props;

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
      <div className={styles.overlayWrapper}>
        <h4 className={styles.overlayTitle}>{t('newheader.select.lang')}</h4>
        {getLang()}
      </div>
    </Modal>
  );
};

export default Dialog;
