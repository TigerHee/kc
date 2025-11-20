import { Button, Modal, type IModalProps } from '@kux/design';
import useIsMobile from '../../../../hooks/useIsMobile';
import clsx from 'clsx';
import { useLang } from '../../../../hookTool';
import styles from './index.module.scss';


type IModal = Omit<IModalProps, 'children'> & {
  iconUrl: string;
}

// 安全项提示弹窗
const SecurityTipModal = ({ isOpen, onClose, onOk, iconUrl, title, content, ...otherProps }: IModal) => {
  const isH5 = useIsMobile();
  const { t } = useLang();
  return (
    <Modal
      isOpen={isOpen}
      mobileTransform
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      onClose={onClose}
      className={styles.modal}
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
            {t('cancel')}
          </Button>
          <Button type="primary" fullWidth onClick={onOk}>
            {t('vHBPtPwoVzxY4ZqfjDhAaR')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SuccessModal = ({ isOpen, onClose, onOk, iconUrl, title, content, ...otherProps }: IModal) => {
  const isH5 = useIsMobile();
  const { t } = useLang();
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
            {t('9bca1e89db524000a097')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// 解绑提示弹窗
const SecurityUnbindTipModal = ({ isOpen, onClose, onOk, iconUrl, title, content, okText }: IModal) => {
  const isH5 = useIsMobile();
  const { t } = useLang();
  return (
    <Modal
      isOpen={isOpen}
      mobileTransform
      footer={null}
      maskClosable={false}
      onCancel={onClose}
      onClose={onClose}
      size="small"
      showCloseX={false}
      header={null}
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
            {t('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { SecurityTipModal, SuccessModal, SecurityUnbindTipModal };
