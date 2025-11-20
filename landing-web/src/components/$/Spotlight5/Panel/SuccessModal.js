/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Modal } from 'antd';
import successIcon from 'assets/spotlight/successIcon.svg';
import styles from './style.less';

const SuccessModal = (props = {}) => {
  const {
    size = 'small', // small medium
    width,
    onClose,
    titleText = '',
    className = '',
    style = null,
    open,
    children,
    ...other
  } = props;

  const handleClose = () => {
    onClose && onClose();
  };
  return (
    <Modal
      className={styles.successModalWrapper}
      visible={open}
      width={width}
      title={null}
      footer={null}
      maskClosable={false}
      closable={false}
      onCancel={handleClose}
      {...other}
    >
      <div className={styles.titleArea}>
          <img src={successIcon} alt="successIcon" />
          <div>Participated Successfully</div>
      </div>
      <div className={styles.contentArea}>
        {children}
        <div className={styles.successModalButton} onClick={handleClose}>Got it</div>
      </div>
      
    </Modal>
  );
};

export default SuccessModal;
