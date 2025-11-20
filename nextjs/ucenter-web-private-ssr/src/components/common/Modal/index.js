import { Button, Modal, useIsMobile } from '@kux/design';
import clsx from 'clsx';
import { _t } from 'tools/i18n';
import * as styles from './index.module.scss';

// 安全项提示弹窗
const SecurityTipModal = ({ isOpen, onClose, onOk, iconUrl, title, content, ...otherProps }) => {
  const isH5 = useIsMobile();
  return (
    <Modal
      isOpen={isOpen}
      mobileTransform
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      className={styles.modal}
      onClose={onClose}
      size="small"
      showCloseX={!isH5}
      header={isH5 ? null : undefined}
      {...otherProps}
    >
      <div className={clsx(styles.tipModalContent, isH5 && styles.tipModalContentH5)}>
        <div className={styles.iconWrap}>
          <img src={iconUrl} alt="icon" />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
        <div className={styles.footer}>
          <Button fullWidth onClick={onClose}>
            {_t('cancel')}
          </Button>
          <Button type="primary" fullWidth onClick={onOk}>
            {_t('confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SuccessModal = ({ isOpen, onClose, onOk, iconUrl, title, content, ...otherProps }) => {
  const isH5 = useIsMobile();
  return (
    <Modal
      isOpen={isOpen}
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      onClose={onClose}
      size="small"
      showCloseX={false}
      header={null}
      {...otherProps}
    >
      <div
        className={clsx(
          styles.tipModalContent,
          styles.successModalContent,
          isH5 && styles.tipModalContentH5,
        )}
      >
        <div className={styles.iconWrap}>
          <img src={iconUrl} alt="icon" />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
        <div className={styles.footer}>
          <Button type="primary" fullWidth onClick={onOk}>
            {_t('9bca1e89db524000a097')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// 解绑提示弹窗
const SecurityUnbindTipModal = ({ isOpen, onClose, onOk, iconUrl, title, content, okText }) => {
  const isH5 = useIsMobile();
  return (
    <Modal
      isOpen={isOpen}
      mobileTransform
      className={styles.modal}
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      onClose={onClose}
      size="small"
      showCloseX={!isH5}
      header={isH5 ? null : undefined}
    >
      <div className={clsx(styles.tipModalContent, isH5 && styles.tipModalContentH5)}>
        <div className={styles.iconWrap}>
          <img src={iconUrl} alt="icon" />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
        <div className={styles.unbindFooter}>
          <Button type="primary" fullWidth onClick={onOk}>
            {okText}
          </Button>
          <Button fullWidth type="text" onClick={onClose}>
            {_t('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { SecurityTipModal, SuccessModal, SecurityUnbindTipModal };
